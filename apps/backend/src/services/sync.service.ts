import { prisma } from '@/db/prisma';
import { processMutation, getExistingEntity } from '@/sync/queue';
import type { SyncPushRequest, SyncPushResponse, SyncPullRequest, SyncPullResponse, SyncChange } from '@/sync/types';

export async function processSyncPush(input: SyncPushRequest): Promise<SyncPushResponse> {
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
