import { Hono } from 'hono';
import { z } from 'zod';
import { authMiddleware, type AuthUser } from '@/api/middleware/auth';
import {
  createOrder,
  getOrdersByUser,
  getOrderById,
  updateOrderStatus,
  updateOrderStatusBySupplier,
} from '@/services/order.service';
import { successResponse, ApiError, ErrorCodes } from '@/api/response';
import { OrderStatus } from '@prisma/client';
import type { CreateOrderInput } from '@/services/order.service';

const ordersRouter = new Hono();

const createOrderSchema = z.object({
  items: z.array(
    z.object({
      productId: z.string(),
      name: z.string(),
      quantity: z.number().int().positive(),
      price: z.number().positive(),
    })
  ),
  notes: z.string().optional(),
  roomId: z.string().optional(),
});

ordersRouter.use('/*', authMiddleware as any);

ordersRouter.post('/', async (c) => {
  const user = (c.get as any)('user') as AuthUser;
  const body = await c.req.json();

  try {
    const data = createOrderSchema.parse(body) as CreateOrderInput & { buyerId?: string };
    const order = await createOrder({
      buyerId: user.id,
      items: data.items,
      notes: data.notes,
      roomId: data.roomId,
    });

    return c.json(successResponse(order), 201);
  } catch (err) {
    if (err instanceof Error && err.name === 'ZodError') {
      throw new ApiError(400, ErrorCodes.VALIDATION_ERROR, 'Invalid order data');
    }
    throw err;
  }
});

ordersRouter.get('/', async (c) => {
  const user = (c.get as any)('user') as AuthUser;
  const orders = await getOrdersByUser(user.id);
  return c.json(successResponse(orders));
});

ordersRouter.get('/:id', async (c) => {
  const user = (c.get as any)('user') as AuthUser;
  const orderId = c.req.param('id');

  const order = await getOrderById(orderId);

  if (order.buyerId !== user.id) {
    throw new ApiError(403, ErrorCodes.ACCESS_DENIED, 'Cannot view order you do not own');
  }

  return c.json(successResponse(order));
});

ordersRouter.put('/:id/confirm', async (c) => {
  const user = (c.get as any)('user') as AuthUser;
  const orderId = c.req.param('id');

  const order = await updateOrderStatus(orderId, user.id, OrderStatus.CONFIRMED);
  return c.json(successResponse(order));
});

ordersRouter.put('/:id/pay', async (c) => {
  const user = (c.get as any)('user') as AuthUser;
  const orderId = c.req.param('id');

  const order = await updateOrderStatus(orderId, user.id, OrderStatus.PAID);
  return c.json(successResponse(order));
});

ordersRouter.put('/:id/ship', async (c) => {
  const user = (c.get as any)('user') as AuthUser;
  const orderId = c.req.param('id');

  const order = await updateOrderStatusBySupplier(orderId, OrderStatus.SHIPPED, user.id);
  return c.json(successResponse(order));
});

ordersRouter.put('/:id/deliver', async (c) => {
  const user = (c.get as any)('user') as AuthUser;
  const orderId = c.req.param('id');

  const order = await updateOrderStatus(orderId, user.id, OrderStatus.DELIVERED);
  return c.json(successResponse(order));
});

ordersRouter.put('/:id/cancel', async (c) => {
  const user = (c.get as any)('user') as AuthUser;
  const orderId = c.req.param('id');

  const order = await updateOrderStatus(orderId, user.id, OrderStatus.CANCELLED);
  return c.json(successResponse(order));
});

export default ordersRouter;
