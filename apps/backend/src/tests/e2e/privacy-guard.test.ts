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
  encryptionFlags?: Record<string, unknown>;
  eventType?: string;
}

describe('E2E: Privacy-Guard Relay Flow', () => {
  const API_BASE = process.env.API_BASE || 'http://localhost:3000';
  const WS_BASE = process.env.WS_BASE || 'ws://localhost:3000';

  beforeAll(async () => {
    process.env.SYNC_USE_GRPC = 'true';
  });

  afterAll(async () => {
    process.env.SYNC_USE_GRPC = 'false';
  });

  it('should route encrypted HUB event to Rust for validation before WebSocket relay', async () => {
    const event: AgentEvent = {
      id: `privacy-event-${Date.now()}`,
      timestamp: new Date().toISOString(),
      traceId: `trace-privacy-${Date.now()}`,
      sourceDeviceId: 'device-privacy-123',
      sourceAgent: 'PrivacyAgent',
      targetAudience: 'HUB',
      action: 'ENCRYPTED_GROUP_BUY',
      payload: {
        encryptedData: 'sensitive-content-not-visible-in-logs',
        keyId: 'key-123',
      },
      signature: 'valid-privacy-signature',
      encryptionFlags: {
        algorithm: 'chacha20poly1305',
        keyExchange: 'x25519',
        publicKey: 'recipient-public-key',
      },
      eventType: 'ENCRYPTED_GROUP_BUY',
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

    const result = await response.json();
    expect(result.validationPassed).toBe(true);
    expect(result.relayed).toBe(true);
  });

  it('should route encrypted ALL event to Rust for validation before WebSocket relay', async () => {
    const event: AgentEvent = {
      id: `privacy-all-${Date.now()}`,
      timestamp: new Date().toISOString(),
      traceId: `trace-privacy-all-${Date.now()}`,
      sourceDeviceId: 'device-privacy-all-123',
      sourceAgent: 'PrivacyAgent',
      targetAudience: 'ALL',
      action: 'ENCRYPTED_BROADCAST',
      payload: {
        encryptedData: 'broadcast-content',
        recipients: ['device-1', 'device-2', 'device-3'],
      },
      signature: 'valid-all-signature',
      encryptionFlags: {
        algorithm: 'chacha20poly1305',
        targetAudience: 'ALL',
      },
      eventType: 'ENCRYPTED_BROADCAST',
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

    const result = await response.json();
    expect(result.validationPassed).toBe(true);
  });

  it('should not relay event when Rust validation fails', async () => {
    const event: AgentEvent = {
      id: `privacy-fail-${Date.now()}`,
      timestamp: new Date().toISOString(),
      traceId: `trace-privacy-fail-${Date.now()}`,
      sourceDeviceId: 'device-privacy-fail-123',
      sourceAgent: 'PrivacyAgent',
      targetAudience: 'HUB',
      action: 'ENCRYPTED_GROUP_BUY',
      payload: {
        encryptedData: 'tampered-content',
      },
      signature: 'invalid-signature',
      encryptionFlags: {
        algorithm: 'chacha20poly1305',
        keyExchange: 'x25519',
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

    const result = await response.json();
    expect(result.validationPassed).toBe(false);
    expect(result.discarded).toBe(true);
  });

  it('should NOT log plain-text sensitive data in backend', async () => {
    const event: AgentEvent = {
      id: `privacy-logs-${Date.now()}`,
      timestamp: new Date().toISOString(),
      traceId: `trace-privacy-logs-${Date.now()}`,
      sourceDeviceId: 'device-privacy-logs-123',
      sourceAgent: 'PrivacyAgent',
      targetAudience: 'HUB',
      action: 'ENCRYPTED_SENSITIVE',
      payload: {
        ssn: '123-45-6789',
        creditCard: '4111-1111-1111-1111',
        password: 'super-secret-password',
      },
      signature: 'valid-logs-signature',
      encryptionFlags: {
        algorithm: 'chacha20poly1305',
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

    const logsResponse = await fetch(`${API_BASE}/api/v1/admin/logs?level=info`);
    const logs = await logsResponse.text();

    expect(logs).not.toContain('123-45-6789');
    expect(logs).not.toContain('4111-1111-1111-1111');
    expect(logs).not.toContain('super-secret-password');
  });

  it('should bypass Rust validation for non-encrypted events', async () => {
    const event: AgentEvent = {
      id: `plain-event-${Date.now()}`,
      timestamp: new Date().toISOString(),
      traceId: `trace-plain-${Date.now()}`,
      sourceDeviceId: 'device-plain-123',
      sourceAgent: 'StockAgent',
      targetAudience: 'HUB',
      action: 'UPDATE_INVENTORY',
      payload: {
        inventoryId: 'inv-123',
        newQuantity: 100,
      },
      signature: 'plain-signature',
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

    const result = await response.json();
    expect(result.rustValidationSkipped).toBe(true);
    expect(result.relayed).toBe(true);
  });
});
