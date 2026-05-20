import { prisma } from '@/db/prisma';
import { agentEventBus, type AgentEvent } from '@/agents/event-bus';
import { emitAgentEvent } from '@/ws/agents';

export async function relayAgentEvent(event: AgentEvent): Promise<void> {
  await agentEventBus.publishEvent(event);

  if (event.targetAudience === 'HUB' || event.targetAudience === 'ALL') {
    const hubUsers = await prisma.user.findMany({
      where: { hubId: event.payload['hubId'] as string },
      select: { id: true },
    });

    for (const user of hubUsers) {
      emitAgentEvent(user.id, event);
    }
  }
}

export async function storeAgentEventForOffline(
  event: AgentEvent,
  targetUserIds: string[]
): Promise<void> {
  for (const userId of targetUserIds) {
    await prisma.syncQueue.create({
      data: {
        deviceId: userId,
        mutations: [event] as unknown as object,
        processed: false,
      },
    });
  }
}
