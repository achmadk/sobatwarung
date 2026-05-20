import { getIO, AuthenticatedSocket } from './connection';

export function emitAgentEvent(hubId: string, event: {
  id: string;
  timestamp: string;
  traceId: string;
  sourceAgent: string;
  action: string;
  payload: Record<string, unknown>;
}) {
  const io = getIO();
  io.to(`hub:${hubId}`).emit('agent:event', event);
}

export function emitAgentEventToPartners(hubId: string, event: {
  id: string;
  timestamp: string;
  traceId: string;
  sourceAgent: string;
  action: string;
  payload: Record<string, unknown>;
}) {
  const io = getIO();
  io.to(`hub:${hubId}`).emit('agent:event', {
    ...event,
    targetAudience: 'PARTNER',
  });
}

export function handleAgentSubscribe(socket: AuthenticatedSocket, hubId: string) {
  socket.join(`agents:${hubId}`);
}

export function handleAgentUnsubscribe(socket: AuthenticatedSocket, hubId: string) {
  socket.leave(`agents:${hubId}`);
}
