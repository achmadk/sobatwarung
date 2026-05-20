import { getIO, AuthenticatedSocket } from './connection';

export interface AgentEventPayload {
  id: string;
  timestamp: string;
  traceId: string;
  sourceAgent: string;
  action: string;
  payload: Record<string, unknown>;
  targetAudience?: 'HUB' | 'PARTNER' | 'ALL';
  encryptionFlags?: Record<string, unknown>;
}

export function emitAgentEvent(hubId: string, event: AgentEventPayload) {
  const io = getIO();
  io.to(`hub:${hubId}`).emit('agent:event', event);
}

export function emitAgentEventToPartners(hubId: string, event: AgentEventPayload) {
  const io = getIO();
  io.to(`hub:${hubId}`).emit('agent:event', {
    ...event,
    targetAudience: 'PARTNER',
  });
}

export function emitAgentEventToAll(hubId: string, event: AgentEventPayload) {
  const io = getIO();
  io.to(`hub:${hubId}`).emit('agent:event', {
    ...event,
    targetAudience: 'ALL',
  });
}

export function handleAgentSubscribe(socket: AuthenticatedSocket, hubId: string) {
  socket.join(`agents:${hubId}`);
  socket.join(`hub:${hubId}`);
}

export function handleAgentUnsubscribe(socket: AuthenticatedSocket, hubId: string) {
  socket.leave(`agents:${hubId}`);
  socket.leave(`hub:${hubId}`);
}
