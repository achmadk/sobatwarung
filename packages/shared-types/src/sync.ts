export type SyncOperation = "create" | "update" | "delete";

export interface SyncMutation {
  id: string;
  entity: "order" | "product" | "room" | "user";
  operation: SyncOperation;
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
  rejected: { mutationId: string; reason: string }[];
  conflicts: {
    mutationId: string;
    entityId: string;
    field: string;
    localValue: unknown;
    remoteValue: unknown;
    resolutionStrategy: "lwwt" | "manual";
  }[];
  serverTimestamp: string;
}
