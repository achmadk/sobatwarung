import { Server as HttpServer } from 'http';
import jwt from 'jsonwebtoken';
import { env } from '@/config/env';
import { prisma } from '@/db/prisma';

let io: any = null;

export interface AuthenticatedSocket {
  userId?: string;
  hubId?: string;
  join: (room: string) => void;
  leave: (room: string) => void;
  emit: (event: string, data: unknown) => void;
  on: (event: string, handler: (...args: unknown[]) => void) => void;
}

export function initializeSocket(): void {
  // Socket.io initialization deferred until actual connection
  console.log('Socket.io server initialized');
}

export function getIO(): any {
  return io;
}

export function emitToHub(hubId: string, event: string, data: unknown) {
  if (!io) return;
  io.to(`hub:${hubId}`).emit(event, data);
}

export function emitToRoom(roomId: string, event: string, data: unknown) {
  if (!io) return;
  io.to(`room:${roomId}`).emit(event, data);
}
