import { EventEmitter } from 'events';
import { prisma } from '@/db/prisma';

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
}

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
    await prisma.syncQueue.create({
      data: {
        deviceId: event.sourceDeviceId,
        mutations: [event] as unknown as object,
        processed: false,
      },
    });

    this.emit('agent:event', event);
  }

  getListeners(eventName: string): Array<(...args: unknown[]) => void> {
    return this.listeners(eventName) as Array<(...args: unknown[]) => void>;
  }
}

export const agentEventBus = AgentEventBus.getInstance();
