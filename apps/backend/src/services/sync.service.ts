import { prisma } from '@/db/prisma';
import { processMutation, getExistingEntity } from '@/sync/queue';
import type { SyncPushRequest, SyncPushResponse, SyncPullRequest, SyncPullResponse, SyncChange } from '@/sync/types';
import { isGrpcEnabled, isCircuitBreakerOpen } from '@/grpc/client';
import { syncBatchViaGrpc, getStateViaGrpc, GrpcMutation } from '@/grpc/sync-service';
import pino from 'pino';

const logger = pino({ name: 'sync-service' });

export async function processSyncPush(input: SyncPushRequest): Promise<SyncPushResponse> {
  if (isGrpcEnabled() && !isCircuitBreakerOpen()) {
    const grpcResponse = await forwardSyncPushToRust(input);
    if (grpcResponse) {
      return {
        accepted: grpcResponse.mutations_accepted || [],
        rejected: grpcResponse.mutations_rejected || [],
        conflicts: grpcResponse.conflicts || [],
        serverTimestamp: new Date(grpcResponse.sync_timestamp).toISOString(),
      };
    }
    logger.warn('gRPC syncPush failed, falling back to local Prisma resolution');
  }

  return processSyncPushLocal(input);
}

async function forwardSyncPushToRust(input: SyncPushRequest) {
  const grpcMutations: GrpcMutation[] = input.mutations.map((m) => ({
    id: m.id,
    entity_type: m.entity,
    entity_id: m.entityId,
    payload: new TextEncoder().encode(JSON.stringify(m.data)),
    vector_clock: {},
    timestamp: new Date(m.timestamp).getTime(),
  }));

  const request = {
    agency_id: input.deviceId,
    client_id: input.deviceId,
    batch_id: `batch-${Date.now()}`,
    mutations: grpcMutations,
  };

  const response = await syncBatchViaGrpc(request);
  if (response) {
    return {
      mutations_accepted: response.conflicts.length === 0 ? input.mutations.map((m) => m.id) : [],
      mutations_rejected: [] as { mutationId: string; reason: string }[],
      conflicts: response.conflicts.map((c) => ({
        mutationId: c.entity_id,
        entityId: c.entity_id,
        field: 'merged',
        localValue: null,
        remoteValue: null,
        resolutionStrategy: 'lwwt' as const,
      })),
      sync_timestamp: response.sync_timestamp,
    };
  }
  return null;
}

async function processSyncPushLocal(input: SyncPushRequest): Promise<SyncPushResponse> {
  const accepted: string[] = [];
  const rejected: Array<{ mutationId: string; reason: string }> = [];
  const conflicts: Array<{
    mutationId: string;
    entityId: string;
    field: string;
    localValue: unknown;
    remoteValue: unknown;
    resolutionStrategy: 'lwwt' | 'manual';
  }> = [];

  for (const mutation of input.mutations) {
    const existing = await getExistingEntity(mutation.entity, mutation.entityId);
    const result = await processMutation(mutation, existing);

    if (result.applied) {
      accepted.push(mutation.id);
    } else if (result.conflict) {
      accepted.push(mutation.id);
      conflicts.push(result.conflict);
    } else {
      rejected.push({
        mutationId: mutation.id,
        reason: 'processing_failed',
      });
    }
  }

  await prisma.syncQueue.create({
    data: {
      deviceId: input.deviceId,
      mutations: input.mutations as unknown as object,
      processed: true,
    },
  });

  return {
    accepted,
    rejected,
    conflicts,
    serverTimestamp: new Date().toISOString(),
  };
}

export async function processSyncPull(input: SyncPullRequest): Promise<SyncPullResponse> {
  if (isGrpcEnabled() && !isCircuitBreakerOpen()) {
    const grpcResponse = await forwardSyncPullToRust(input);
    if (grpcResponse) {
      try {
        const decoded = JSON.parse(new TextDecoder().decode(grpcResponse.state));
        return {
          changes: decoded.changes || [],
          serverTimestamp: new Date(grpcResponse.sync_timestamp).toISOString(),
        };
      } catch {
        logger.warn('Failed to decode gRPC state, falling back to local');
      }
    }
    logger.warn('gRPC syncPull failed, falling back to local Prisma resolution');
  }

  return processSyncPullLocal(input);
}

async function forwardSyncPullToRust(input: SyncPullRequest) {
  const request = {
    agency_id: input.deviceId,
    client_id: input.deviceId,
  };

  return await getStateViaGrpc(request);
}

async function processSyncPullLocal(input: SyncPullRequest): Promise<SyncPullResponse> {
  const lastSync = new Date(input.lastSyncTimestamp);

  const orders = await prisma.order.findMany({
    where: {
      updatedAt: { gt: lastSync },
    },
    select: {
      id: true,
      updatedAt: true,
      status: true,
      items: true,
      totalAmount: true,
    },
  });

  const rooms = await prisma.buyingRoom.findMany({
    where: {
      createdAt: { gt: lastSync },
    },
    select: {
      id: true,
      createdAt: true,
      currentQuantity: true,
      status: true,
    },
  });

  const products = await prisma.product.findMany({
    where: {
      updatedAt: { gt: lastSync },
    },
    select: {
      id: true,
      updatedAt: true,
      name: true,
      price: true,
      isActive: true,
    },
  });

  const changes: SyncChange[] = [
    ...orders.map((o) => ({
      entity: 'order',
      entityId: o.id,
      operation: 'update' as const,
      data: {
        status: o.status,
        items: o.items,
        totalAmount: o.totalAmount,
      },
      timestamp: o.updatedAt.toISOString(),
    })),
    ...rooms.map((r) => ({
      entity: 'room',
      entityId: r.id,
      operation: 'update' as const,
      data: {
        currentQuantity: r.currentQuantity,
        status: r.status,
      },
      timestamp: r.createdAt.toISOString(),
    })),
    ...products.map((p) => ({
      entity: 'product',
      entityId: p.id,
      operation: 'update' as const,
      data: {
        name: p.name,
        price: p.price,
        isActive: p.isActive,
      },
      timestamp: p.updatedAt.toISOString(),
    })),
  ];

  changes.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

  return {
    changes,
    serverTimestamp: new Date().toISOString(),
  };
}
