import { getIO, AuthenticatedSocket } from './connection';

export function emitSyncComplete(socket: AuthenticatedSocket, data: {
  accepted: string[];
  rejected: Array<{ mutationId: string; reason: string }>;
  serverTimestamp: string;
}) {
  socket.emit('sync:complete', data);
}

export function handleSyncSubscribe(socket: AuthenticatedSocket, hubId: string) {
  socket.join(`sync:${hubId}`);
}

export function handleSyncUnsubscribe(socket: AuthenticatedSocket, hubId: string) {
  socket.leave(`sync:${hubId}`);
}
