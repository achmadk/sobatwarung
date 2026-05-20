import { prisma } from '@/db/prisma';
import { ApiError, ErrorCodes } from '@/api/response';
import { OrderStatus, Prisma } from '@prisma/client';

export interface CreateOrderInput {
  buyerId: string;
  items: Array<{
    productId: string;
    name: string;
    quantity: number;
    price: number;
  }>;
  notes?: string;
  roomId?: string;
}

export async function createOrder(input: CreateOrderInput) {
  const totalAmount = input.items.reduce(
    (sum, item) => sum + item.quantity * item.price,
    0
  );

  const order = await prisma.order.create({
    data: {
      buyerId: input.buyerId,
      roomId: input.roomId,
      items: input.items as unknown as Prisma.JsonArray,
      totalAmount,
      notes: input.notes,
      status: OrderStatus.DRAFT,
    },
    include: {
      buyer: {
        select: { id: true, name: true, whatsapp: true },
      },
      room: {
        select: { id: true, productName: true },
      },
    },
  });

  return order;
}

export async function getOrdersByUser(userId: string) {
  const orders = await prisma.order.findMany({
    where: { buyerId: userId },
    include: {
      buyer: {
        select: { id: true, name: true, whatsapp: true },
      },
      room: {
        select: { id: true, productName: true },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  return orders;
}

export async function getOrderById(orderId: string) {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: {
      buyer: {
        select: { id: true, name: true, whatsapp: true, role: true },
      },
      room: {
        select: { id: true, productName: true },
      },
    },
  });

  if (!order) {
    throw new ApiError(404, ErrorCodes.NOT_FOUND, 'Order not found');
  }

  return order;
}

export async function updateOrderStatus(orderId: string, userId: string, newStatus: OrderStatus) {
  const order = await getOrderById(orderId);

  if (order.buyerId !== userId) {
    throw new ApiError(403, ErrorCodes.ACCESS_DENIED, 'Cannot update order you do not own');
  }

  const validTransitions: Record<OrderStatus, OrderStatus[]> = {
    [OrderStatus.DRAFT]: [OrderStatus.CONFIRMED, OrderStatus.CANCELLED],
    [OrderStatus.CONFIRMED]: [OrderStatus.PAID, OrderStatus.CANCELLED],
    [OrderStatus.PAID]: [OrderStatus.SHIPPED],
    [OrderStatus.SHIPPED]: [OrderStatus.DELIVERED],
    [OrderStatus.DELIVERED]: [],
    [OrderStatus.CANCELLED]: [],
  };

  if (!validTransitions[order.status].includes(newStatus)) {
    if (newStatus === OrderStatus.CANCELLED) {
      throw new ApiError(400, ErrorCodes.CANNOT_CANCEL, 'Cannot cancel this order');
    }
    throw new ApiError(400, ErrorCodes.VALIDATION_ERROR, 'Invalid status transition');
  }

  const updatedOrder = await prisma.order.update({
    where: { id: orderId },
    data: { status: newStatus },
    include: {
      buyer: {
        select: { id: true, name: true, whatsapp: true },
      },
      room: {
        select: { id: true, productName: true },
      },
    },
  });

  return updatedOrder;
}

export async function updateOrderStatusBySupplier(orderId: string, newStatus: OrderStatus, userId: string) {
  const order = await getOrderById(orderId);

  if (newStatus === OrderStatus.SHIPPED) {
    const supplier = await prisma.user.findFirst({
      where: {
        id: userId,
        role: 'PEMASOK',
        products: {
          some: {
            id: {
              in: (order.items as Array<{ productId: string }>).map((i) => i.productId),
            },
          },
        },
      },
    });

    if (!supplier) {
      throw new ApiError(403, ErrorCodes.ACCESS_DENIED, 'Only supplier can mark as shipped');
    }
  }

  const updatedOrder = await prisma.order.update({
    where: { id: orderId },
    data: { status: newStatus },
    include: {
      buyer: {
        select: { id: true, name: true, whatsapp: true },
      },
      room: {
        select: { id: true, productName: true },
      },
    },
  });

  return updatedOrder;
}
