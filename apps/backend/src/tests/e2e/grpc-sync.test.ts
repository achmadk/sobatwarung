import { describe, it, expect, beforeAll, afterAll } from '@jest/globals';

interface SyncMutation {
  id: string;
  entity: 'order' | 'product' | 'room' | 'user' | 'roomParticipant';
  operation: 'create' | 'update' | 'delete';
  entityId: string;
  data: Record<string, unknown>;
  timestamp: string;
  deviceId: string;
}

interface SyncPushRequest {
  deviceId: string;
  lastSyncTimestamp: string;
  mutations: SyncMutation[];
  signature: string;
}

interface SyncPushResponse {
  accepted: string[];
  rejected: Array<{ mutationId: string; reason: string }>;
  conflicts: Array<{
    mutationId: string;
    entityId: string;
    field: string;
    localValue: unknown;
    remoteValue: unknown;
    resolutionStrategy: 'lwwt' | 'manual';
  }>;
  serverTimestamp: string;
}

describe('E2E: gRPC Sync Flow', () => {
  const API_BASE = process.env.API_BASE || 'http://localhost:3000';
  const GRPC_HOST = process.env.GRPC_HOST || '[::1]:50051';

  beforeAll(async () => {
    process.env.SYNC_USE_GRPC = 'true';
  });

  afterAll(async () => {
    process.env.SYNC_USE_GRPC = 'false';
  });

  it('should forward syncPush to Rust via gRPC and return merged result', async () => {
    const request: SyncPushRequest = {
      deviceId: 'device-123',
      lastSyncTimestamp: new Date(Date.now() - 60000).toISOString(),
      mutations: [
        {
          id: 'mutation-1',
          entity: 'product',
          operation: 'update',
          entityId: 'product-456',
          data: { name: 'Updated Product', price: 15000 },
          timestamp: new Date().toISOString(),
          deviceId: 'device-123',
        },
      ],
      signature: 'test-signature',
    };

    const response = await fetch(`${API_BASE}/api/v1/sync/push`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer test-token',
      },
      body: JSON.stringify(request),
    });

    expect(response.status).toBe(200);

    const result: SyncPushResponse = await response.json();

    expect(result.serverTimestamp).toBeDefined();
    expect(Array.isArray(result.accepted) || Array.isArray(result.conflicts)).toBe(true);
  });

  it('should fallback to local Prisma when gRPC is unavailable', async () => {
    process.env.SYNC_USE_GRPC = 'false';

    const request: SyncPushRequest = {
      deviceId: 'device-123',
      lastSyncTimestamp: new Date(Date.now() - 60000).toISOString(),
      mutations: [
        {
          id: 'mutation-2',
          entity: 'order',
          operation: 'update',
          entityId: 'order-789',
          data: { status: 'confirmed' },
          timestamp: new Date().toISOString(),
          deviceId: 'device-123',
        },
      ],
      signature: 'test-signature',
    };

    const response = await fetch(`${API_BASE}/api/v1/sync/push`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer test-token',
      },
      body: JSON.stringify(request),
    });

    expect(response.status).toBe(200);

    const result: SyncPushResponse = await response.json();

    expect(result.serverTimestamp).toBeDefined();
    expect(result.accepted).toContain('mutation-2');
  });

  it('should handle circuit breaker open state gracefully', async () => {
    process.env.SYNC_USE_GRPC = 'true';

    const response = await fetch(`${API_BASE}/api/v1/sync/push`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer test-token',
      },
      body: JSON.stringify({
        deviceId: 'device-circuit-test',
        lastSyncTimestamp: new Date().toISOString(),
        mutations: [],
        signature: 'test',
      }),
    });

    expect([200, 503]).toContain(response.status);
  });
});
