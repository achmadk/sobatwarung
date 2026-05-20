import { prisma } from '@/db/prisma';
import { resolveScalarConflict, mergeArraysById } from './conflict';
import type { SyncMutation, Conflict, SyncPushResponse } from './types';
import { Prisma } from '@prisma/client';

export async function processMutation(
  mutation: SyncMutation,
  existingEntity: Record<string, unknown> | null
): Promise<{ applied: boolean; conflict?: Conflict }> {
  switch (mutation.entity) {
    case 'room':
      return processRoomMutation(mutation, existingEntity);
    case 'roomParticipant':
      return processRoomParticipantMutation(mutation, existingEntity);
    case 'order':
      return processOrderMutation(mutation, existingEntity);
    case 'product':
      return processProductMutation(mutation, existingEntity);
    default:
      return { applied: false };
  }
}

async function processRoomMutation(
  mutation: SyncMutation,
  existing: Record<string, unknown> | null
): Promise<{ applied: boolean; conflict?: Conflict }> {
  if (mutation.operation === 'update' && existing) {
    const remoteUpdatedAt = (existing.updatedAt as Date)?.toISOString() || '';
    const localTimestamp = mutation.timestamp;

    const result = resolveScalarConflict(
      mutation.id,
      mutation.entityId,
      'currentQuantity',
      mutation.data['currentQuantity'],
      existing['currentQuantity'],
      localTimestamp,
      remoteUpdatedAt
    );

    if (result.winner === 'remote') {
      return {
        applied: false,
        conflict: {
          mutationId: mutation.id,
          entityId: mutation.entityId,
          field: 'currentQuantity',
          localValue: mutation.data['currentQuantity'],
          remoteValue: existing['currentQuantity'],
          resolutionStrategy: 'lwwt',
        },
      };
    }
  }

  await prisma.buyingRoom.update({
    where: { id: mutation.entityId },
    data: {
      currentQuantity: mutation.data['currentQuantity'] as number,
      updatedAt: new Date(mutation.timestamp),
    } as Prisma.BuyingRoomUpdateInput,
  });

  return { applied: true };
}

async function processRoomParticipantMutation(
  mutation: SyncMutation,
  existing: Record<string, unknown> | null
): Promise<{ applied: boolean; conflict?: Conflict }> {
  if (mutation.operation === 'create') {
    try {
      await prisma.roomParticipant.create({
        data: {
          id: mutation.entityId,
          roomId: mutation.data['roomId'] as string,
          userId: mutation.data['userId'] as string,
          quantity: mutation.data['quantity'] as number,
          joinedAt: new Date(mutation.timestamp),
        },
      });
      return { applied: true };
    } catch {
      return { applied: false };
    }
  }

  if (mutation.operation === 'update' && existing) {
    const remoteJoinedAt = (existing['joinedAt'] as Date)?.toISOString() || '';
    const localTimestamp = mutation.timestamp;

    if (new Date(localTimestamp) > new Date(remoteJoinedAt)) {
      await prisma.roomParticipant.update({
        where: { id: mutation.entityId },
        data: {
          quantity: mutation.data['quantity'] as number,
        },
      });
      return { applied: true };
    }
    return { applied: false };
  }

  return { applied: false };
}

async function processOrderMutation(
  mutation: SyncMutation,
  existing: Record<string, unknown> | null
): Promise<{ applied: boolean; conflict?: Conflict }> {
  if (mutation.operation === 'update' && existing) {
    const remoteUpdatedAt = (existing['updatedAt'] as Date)?.toISOString() || '';
    const localTimestamp = mutation.timestamp;

    const result = resolveScalarConflict(
      mutation.id,
      mutation.entityId,
      'status',
      mutation.data['status'],
      existing['status'],
      localTimestamp,
      remoteUpdatedAt
    );

    if (result.winner === 'remote') {
      return {
        applied: false,
        conflict: {
          mutationId: mutation.id,
          entityId: mutation.entityId,
          field: 'status',
          localValue: mutation.data['status'],
          remoteValue: existing['status'],
          resolutionStrategy: 'lwwt',
        },
      };
    }
  }

  try {
    await prisma.order.update({
      where: { id: mutation.entityId },
      data: mutation.data as Prisma.OrderUpdateInput,
    });
    return { applied: true };
  } catch {
    return { applied: false };
  }
}

async function processProductMutation(
  mutation: SyncMutation,
  existing: Record<string, unknown> | null
): Promise<{ applied: boolean; conflict?: Conflict }> {
  try {
    if (mutation.operation === 'create') {
      await prisma.product.create({
        data: {
          id: mutation.entityId,
          ...(mutation.data as Prisma.ProductCreateInput),
        },
      });
    } else if (mutation.operation === 'update' && existing) {
      const remoteUpdatedAt = (existing['updatedAt'] as Date)?.toISOString() || '';
      const localTimestamp = mutation.timestamp;

      if (new Date(localTimestamp) > new Date(remoteUpdatedAt)) {
        await prisma.product.update({
          where: { id: mutation.entityId },
          data: mutation.data as Prisma.ProductUpdateInput,
        });
      }
    } else if (mutation.operation === 'delete') {
      await prisma.product.delete({ where: { id: mutation.entityId } });
    }
    return { applied: true };
  } catch {
    return { applied: false };
  }
}

export async function getExistingEntity(
  entity: string,
  entityId: string
): Promise<Record<string, unknown> | null> {
  try {
    switch (entity) {
      case 'room':
        return await prisma.buyingRoom.findUnique({ where: { id: entityId } });
      case 'roomParticipant':
        return await prisma.roomParticipant.findUnique({ where: { id: entityId } });
      case 'order':
        return await prisma.order.findUnique({ where: { id: entityId } });
      case 'product':
        return await prisma.product.findUnique({ where: { id: entityId } });
      default:
        return null;
    }
  } catch {
    return null;
  }
}
