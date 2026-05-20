export interface SyncMutation {
  id: string;
  entity: 'order' | 'product' | 'room' | 'user' | 'roomParticipant';
  operation: 'create' | 'update' | 'delete';
  entityId: string;
  data: Record<string, unknown>;
  timestamp: string;
  deviceId: string;
}

export interface SyncPushRequest {
  deviceId: string;
  lastSyncTimestamp: string;
  mutations: SyncMutation[];
  signature: string;
}

export interface SyncPushResponse {
  accepted: string[];
  rejected: RejectedMutation[];
  conflicts: Conflict[];
  serverTimestamp: string;
}

export interface RejectedMutation {
  mutationId: string;
  reason: string;
}

export interface Conflict {
  mutationId: string;
  entityId: string;
  field: string;
  localValue: unknown;
  remoteValue: unknown;
  resolutionStrategy: 'lwwt' | 'manual';
}

export interface SyncPullRequest {
  deviceId: string;
  lastSyncTimestamp: string;
}

export interface SyncPullResponse {
  changes: SyncChange[];
  serverTimestamp: string;
}

export interface SyncChange {
  entity: string;
  entityId: string;
  operation: 'create' | 'update' | 'delete';
  data: Record<string, unknown>;
  timestamp: string;
}
