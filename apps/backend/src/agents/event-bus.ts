import { EventEmitter } from 'events';
import { prisma } from '@/db/prisma';
import { getRedis } from '@/db/redis';
import {
  requiresPrivacyGuardRouting,
  validateWithRustCryptoHub,
  logValidationFailure,
  logEventSanitized,
} from './privacy-guard';
import pino from 'pino';

const logger = pino({ name: 'event-bus' });

export interface AgentEvent {
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

const EVENTS_DUAL_WRITE = process.env.EVENTS_DUAL_WRITE === 'true';
const REDIS_STREAM_KEY = 'agents';

class AgentEventBus extends EventEmitter {
  private static instance: AgentEventBus;

  private constructor() {
    super();
    this.setMaxListeners(100);
  }

  static getInstance(): AgentEventBus {
    if (!AgentEventBus.instance) {
      AgentEventBus.instance = new AgentEventBus();
    }
    return AgentEventBus.instance;
  }

  async publishEvent(event: AgentEvent): Promise<void> {
    if (requiresPrivacyGuardRouting(event)) {
      logEventSanitized('Privacy-Guard routing required, validating with Rust', event);

      const validation = await validateWithRustCryptoHub(event);

      if (!validation.validated) {
        logValidationFailure(event, validation.reason || 'Validation failed');
        return;
      }

      logEventSanitized('Privacy-Guard validation passed', event);
    }

    await prisma.syncQueue.create({
      data: {
        deviceId: event.sourceDeviceId,
        mutations: [event] as unknown as object,
        processed: false,
      },
    });

    if (EVENTS_DUAL_WRITE) {
      await this.publishToRedisStream(event);
      this.emit('agent:event', event);
    } else {
      await this.publishToRedisStream(event);
    }
  }

  private async publishToRedisStream(event: AgentEvent): Promise<void> {
    try {
      const redis = getRedis();
      const streamPayload: Record<string, string> = {
        eventType: event.eventType || event.action,
        targetAudience: event.targetAudience,
        timestamp: event.timestamp,
        deviceId: event.sourceDeviceId,
        traceId: event.traceId,
        sourceAgent: event.sourceAgent,
        action: event.action,
        payload: JSON.stringify(event.payload),
        signature: event.signature,
      };

      if (event.encryptionFlags) {
        streamPayload.encryptionFlags = JSON.stringify(event.encryptionFlags);
      }

      await redis.xadd(REDIS_STREAM_KEY, '*', ...this.flattenPayload(streamPayload));
      logger.debug({ eventType: streamPayload.eventType }, 'Event published to Redis Stream');
    } catch (error) {
      logger.error({ error }, 'Failed to publish event to Redis Stream');
      throw error;
    }
  }

  private flattenPayload(payload: Record<string, string>): string[] {
    const result: string[] = [];
    for (const [key, value] of Object.entries(payload)) {
      result.push(key, value);
    }
    return result;
  }

  getListeners(eventName: string): Array<(...args: unknown[]) => void> {
    return this.listeners(eventName) as Array<(...args: unknown[]) => void>;
  }
}

export const agentEventBus = AgentEventBus.getInstance();
