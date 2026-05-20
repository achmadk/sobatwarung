import { Hono } from 'hono';
import { z } from 'zod';
import { authMiddleware, type AuthUser } from '@/api/middleware/auth';
import { requireRole } from '@/api/middleware/role-guard';
import {
  createRoom,
  getRoomsByHub,
  getRoomById,
  joinRoom,
  checkoutRoom,
  distributeRoom,
} from '@/services/room.service';
import { successResponse, ApiError, ErrorCodes } from '@/api/response';

const roomsRouter = new Hono();

const createRoomSchema = z.object({
  productName: z.string().min(1),
  targetQuantity: z.number().int().positive(),
  priceCeiling: z.number().positive(),
  deadline: z.string().datetime(),
});

const joinRoomSchema = z.object({
  quantity: z.number().int().positive(),
});

roomsRouter.use('/*', authMiddleware as any);

roomsRouter.post('/', requireRole('AGEN_UTAMA') as any, async (c) => {
  const user = (c.get as any)('user') as AuthUser;
  const body = await c.req.json();

  const result = createRoomSchema.safeParse(body);
  if (!result.success) {
    throw new ApiError(400, ErrorCodes.VALIDATION_ERROR, 'Invalid room data');
  }

  if (!user.hubId) {
    throw new ApiError(400, ErrorCodes.ACCESS_DENIED, 'User does not have a hub');
  }

  const room = await createRoom({
    hubId: user.hubId,
    createdById: user.id,
    productName: result.data.productName,
    targetQuantity: result.data.targetQuantity,
    priceCeiling: result.data.priceCeiling,
    deadline: new Date(result.data.deadline),
  });

  return c.json(successResponse(room), 201);
});

roomsRouter.get('/', async (c) => {
  const user = (c.get as any)('user') as AuthUser;

  if (!user.hubId) {
    throw new ApiError(400, ErrorCodes.ACCESS_DENIED, 'User does not have a hub');
  }

  const rooms = await getRoomsByHub(user.hubId);
  return c.json(successResponse(rooms));
});

roomsRouter.get('/:id', async (c) => {
  const roomId = c.req.param('id');
  const room = await getRoomById(roomId);
  return c.json(successResponse(room));
});

roomsRouter.post('/:id/join', requireRole('AGEN_MITRA') as any, async (c) => {
  const user = (c.get as any)('user') as AuthUser;
  const roomId = c.req.param('id');
  const body = await c.req.json();

  const result = joinRoomSchema.safeParse(body);
  if (!result.success) {
    throw new ApiError(400, ErrorCodes.VALIDATION_ERROR, 'Invalid join data');
  }

  const room = await getRoomById(roomId);

  if (room.hubId !== user.hubId) {
    throw new ApiError(403, ErrorCodes.HUB_MISMATCH, 'Room is not in your hub');
  }

  const updatedRoom = await joinRoom({
    roomId,
    userId: user.id,
    quantity: result.data.quantity,
  });

  return c.json(successResponse(updatedRoom));
});

roomsRouter.post('/:id/checkout', requireRole('AGEN_UTAMA') as any, async (c) => {
  const user = (c.get as any)('user') as AuthUser;
  const roomId = c.req.param('id');

  const room = await getRoomById(roomId);

  if (room.hubId !== user.hubId) {
    throw new ApiError(403, ErrorCodes.HUB_MISMATCH, 'Room is not in your hub');
  }

  const result = await checkoutRoom(roomId, user.id);
  return c.json(successResponse(result));
});

roomsRouter.post('/:id/distribute', requireRole('AGEN_UTAMA') as any, async (c) => {
  const user = (c.get as any)('user') as AuthUser;
  const roomId = c.req.param('id');

  const room = await getRoomById(roomId);

  if (room.hubId !== user.hubId) {
    throw new ApiError(403, ErrorCodes.HUB_MISMATCH, 'Room is not in your hub');
  }

  const distributedRoom = await distributeRoom(roomId);
  return c.json(successResponse(distributedRoom));
});

export default roomsRouter;
