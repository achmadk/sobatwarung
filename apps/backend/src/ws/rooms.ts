import { getIO } from './connection';

export function emitRoomUpdated(hubId: string, roomId: string, data: {
  id: string;
  currentQuantity: number;
  status: string;
  participantCount: number;
}) {
  const io = getIO();
  io.to(`hub:${hubId}`).emit('room:updated', {
    roomId,
    ...data,
  });
}

export function emitRoomJoined(hubId: string, roomId: string, data: {
  userId: string;
  userName: string;
  quantity: number;
  currentQuantity: number;
}) {
  const io = getIO();
  io.to(`hub:${hubId}`).emit('room:joined', {
    roomId,
    ...data,
  });
}

export function subscribeToRoom(socket: any, roomId: string) {
  socket.join(`room:${roomId}`);
}

export function unsubscribeFromRoom(socket: any, roomId: string) {
  socket.leave(`room:${roomId}`);
}
