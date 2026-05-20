import { describe, it, expect, beforeAll, afterAll } from '@jest/globals';

interface AgentEvent {
  id: string;
  timestamp: string;
  traceId: string;
  sourceDeviceId: string;
  sourceAgent: string;
  targetAudience: 'HUB' | 'PARTNER' | 'ALL';
  action: string;
  payload: Record<string, unknown>;
  signature: string;
  eventType?: string;
}

describe('E2E: Redis Streams Event Flow', () => {
  const API_BASE = process.env.API_BASE || 'http://localhost:3000';
  const REDIS_STREAM_KEY = 'agents';

  beforeAll(async () => {
    process.env.EVENTS_DUAL_WRITE = 'true';
  });

  afterAll(async () => {
    process.env.EVENTS_DUAL_WRITE = 'false';
  });

  it('should publish INITIATE_GROUP_BUY_POOL event to Redis Streams', async () => {
    const event: AgentEvent = {
      id: `event-${Date.now()}`,
      timestamp: new Date().toISOString(),
      traceId: `trace-${Date.now()}`,
      sourceDeviceId: 'device-123',
      sourceAgent: 'StockAgent',
      targetAudience: 'HUB',
      action: 'INITIATE_GROUP_BUY_POOL',
      payload: {
        roomId: 'room-456',
        productId: 'product-789',
        quantity: 100,
        priceCeiling: 50000,
      },
      signature: 'test-signature-valid',
      eventType: 'INITIATE_GROUP_BUY_POOL',
    };

    const response = await fetch(`${API_BASE}/api/v1/agents/events`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer test-token',
      },
      body: JSON.stringify(event),
    });

    expect(response.status).toBe(200);
  });

  it('should consume event from Redis Streams in Rust and verify signature', async () => {
    const event: AgentEvent = {
      id: `event-signed-${Date.now()}`,
      timestamp: new Date().toISOString(),
      traceId: `trace-${Date.now()}`,
      sourceDeviceId: 'device-signed-123',
      sourceAgent: 'StockAgent',
      targetAudience: 'HUB',
      action: 'INITIATE_GROUP_BUY_POOL',
      payload: {
        roomId: 'room-signed-456',
        productId: 'product-signed-789',
        quantity: 50,
      },
      signature: 'valid-signature-hex',
      encryptionFlags: {
        algorithm: 'ed25519',
        publicKey: 'device-public-key-hex',
      },
    };

    const response = await fetch(`${API_BASE}/api/v1/agents/events`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer test-token',
      },
      body: JSON.stringify(event),
    });

    expect(response.status).toBe(200);

    await new Promise((resolve) => setTimeout(resolve, 2000));

    const logs = await fetch(`${API_BASE}/api/v1/admin/logs`).then((r) => r.json());
    expect(logs).toContain('Cryptographic signature verified');
  });

  it('should handle dual-write mode (EventEmitter + Redis Streams)', async () => {
    process.env.EVENTS_DUAL_WRITE = 'true';

    const event: AgentEvent = {
      id: `event-dual-${Date.now()}`,
      timestamp: new Date().toISOString(),
      traceId: `trace-dual-${Date.now()}`,
      sourceDeviceId: 'device-dual-123',
      sourceAgent: 'StockAgent',
      targetAudience: 'HUB',
      action: 'INITIATE_GROUP_BUY_POOL',
      payload: { roomId: 'room-dual' },
      signature: 'dual-write-signature',
    };

    const response = await fetch(`${API_BASE}/api/v1/agents/events`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer test-token',
      },
      body: JSON.stringify(event),
    });

    expect(response.status).toBe(200);

    const redisEvent = await fetch(`${API_BASE}/api/v1/admin/redis/last-event?stream=${REDIS_STREAM_KEY}`).then((r) => r.json());
    expect(redisEvent.eventType).toBe('INITIATE_GROUP_BUY_POOL');
  });

  it('should publish to Redis Streams only when dual-write is disabled', async () => {
    process.env.EVENTS_DUAL_WRITE = 'false';

    const event: AgentEvent = {
      id: `event-streams-only-${Date.now()}`,
      timestamp: new Date().toISOString(),
      traceId: `trace-streams-${Date.now()}`,
      sourceDeviceId: 'device-streams-123',
      sourceAgent: 'StockAgent',
      targetAudience: 'PARTNER',
      action: 'UPDATE_INVENTORY',
      payload: { inventoryId: 'inv-123' },
      signature: 'streams-only-signature',
    };

    const response = await fetch(`${API_BASE}/api/v1/agents/events`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer test-token',
      },
      body: JSON.stringify(event),
    });

    expect(response.status).toBe(200);
  });
});
