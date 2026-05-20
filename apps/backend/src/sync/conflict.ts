import type { SyncMutation, Conflict } from './types';

export function resolveScalarConflict(
  mutationId: string,
  entityId: string,
  field: string,
  localValue: unknown,
  remoteValue: unknown,
  localTimestamp: string,
  remoteTimestamp: string
): { winner: 'local' | 'remote'; value: unknown; conflict?: Conflict } {
  const localTime = new Date(localTimestamp).getTime();
  const remoteTime = new Date(remoteTimestamp).getTime();

  if (localTime >= remoteTime) {
    return { winner: 'local', value: localValue };
  } else {
    return { winner: 'remote', value: remoteValue };
  }
}

export function mergeArraysById(
  localItems: Array<{ id: string; [key: string]: unknown }>,
  remoteItems: Array<{ id: string; [key: string]: unknown }>
): Array<{ id: string; [key: string]: unknown }> {
  const merged = new Map<string, { id: string; [key: string]: unknown }>();

  for (const item of remoteItems) {
    merged.set(item.id, item);
  }

  for (const item of localItems) {
    if (!merged.has(item.id)) {
      merged.set(item.id, item);
    }
  }

  return Array.from(merged.values());
}

export function detectSemanticConflict(
  entity: string,
  field: string,
  localValue: unknown,
  remoteValue: unknown
): Conflict | null {
  if (entity === 'room' && field === 'currentQuantity') {
    const localQty = localValue as number;
    const remoteQty = remoteValue as number;

    if (localQty + remoteQty > 100 && Math.abs(localQty - remoteQty) > 50) {
      return {
        mutationId: '',
        entityId: '',
        field,
        localValue,
        remoteValue,
        resolutionStrategy: 'manual',
      };
    }
  }

  return null;
}
