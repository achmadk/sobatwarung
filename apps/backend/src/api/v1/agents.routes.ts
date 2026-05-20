import { Hono } from 'hono';
import { authMiddleware, type AuthUser } from '@/api/middleware/auth';
import { validateAgentEvent } from '@/agents/validators';
import { relayAgentEvent, storeAgentEventForOffline } from '@/services/agent-relay.service';
import { successResponse, ApiError, ErrorCodes } from '@/api/response';
import { prisma } from '@/db/prisma';

const agentsRouter = new Hono();

agentsRouter.use('/*', authMiddleware as any);

agentsRouter.post('/events', async (c) => {
  const user = (c.get as any)('user') as AuthUser;
  const body = await c.req.json();

  const result = validateAgentEvent(body);
  if (!result.success) {
    throw new ApiError(400, ErrorCodes.VALIDATION_ERROR, 'Invalid agent event data');
  }

  const event = result.data;

  if (user.hubId) {
    event.payload = {
      ...event.payload,
      hubId: user.hubId,
    };
  }

  const hubUsers = await prisma.user.findMany({
    where: { hubId: user.hubId || undefined },
    select: { id: true },
  });

  const onlineUserIds = hubUsers.map((u) => u.id);

  await relayAgentEvent(event as any);

  const offlineUsers = hubUsers.filter((u) => !onlineUserIds.includes(u.id));
  if (offlineUsers.length > 0) {
    await storeAgentEventForOffline(
      event as any,
      offlineUsers.map((u) => u.id)
    );
  }

  return c.json(successResponse({ eventId: event.id }));
});

export default agentsRouter;
