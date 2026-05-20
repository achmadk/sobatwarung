import { prisma } from '@/db/prisma';
import { ApiError, ErrorCodes } from '@/api/response';
import { Prisma, RoomStatus } from '@prisma/client';

export interface CreateRoomInput {
  hubId: string;
  createdById: string;
  productName: string;
  targetQuantity: number;
  priceCeiling: number;
  deadline: Date;
}

export interface JoinRoomInput {
  roomId: string;
  userId: string;
  quantity: number;
}

export async function createRoom(input: CreateRoomInput) {
  if (input.deadline <= new Date()) {
    throw new ApiError(400, ErrorCodes.INVALID_DEADLINE, 'Deadline must be in the future');
  }

  const room = await prisma.buyingRoom.create({
    data: {
      hubId: input.hubId,
      createdById: input.createdById,
      productName: input.productName,
      targetQuantity: input.targetQuantity,
      priceCeiling: input.priceCeiling,
      deadline: input.deadline,
      status: RoomStatus.OPEN,
    },
    include: {
      creator: {
        select: { id: true, name: true, whatsapp: true },
      },
      participants: {
        include: {
          user: {
            select: { id: true, name: true, whatsapp: true },
          },
        },
      },
    },
  });

  return room;
}

export async function getRoomsByHub(hubId: string) {
  const rooms = await prisma.buyingRoom.findMany({
    where: { hubId },
    include: {
      creator: {
        select: { id: true, name: true, whatsapp: true },
      },
      participants: {
        include: {
          user: {
            select: { id: true, name: true, whatsapp: true },
          },
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  return rooms;
}

export async function getRoomById(roomId: string) {
  const room = await prisma.buyingRoom.findUnique({
    where: { id: roomId },
    include: {
      creator: {
        select: { id: true, name: true, whatsapp: true },
      },
      participants: {
        include: {
          user: {
            select: { id: true, name: true, whatsapp: true, role: true },
          },
        },
      },
    },
  });

  if (!room) {
    throw new ApiError(404, ErrorCodes.NOT_FOUND, 'Room not found');
  }

  return room;
}

export async function joinRoom(input: JoinRoomInput) {
  const room = await getRoomById(input.roomId);

  if (room.status !== RoomStatus.OPEN) {
    throw new ApiError(400, ErrorCodes.ROOM_NOT_JOINABLE, 'Room is not accepting participants');
  }

  const existingParticipant = room.participants.find(
    (p) => p.userId === input.userId
  );

  if (existingParticipant) {
    await prisma.roomParticipant.update({
      where: { id: existingParticipant.id },
      data: { quantity: existingParticipant.quantity + input.quantity },
    });
  } else {
    await prisma.roomParticipant.create({
      data: {
        roomId: input.roomId,
        userId: input.userId,
        quantity: input.quantity,
      },
    });
  }

  const updatedRoom = await prisma.buyingRoom.update({
    where: { id: input.roomId },
    data: {
      currentQuantity: {
        increment: input.quantity,
      },
    },
    include: {
      creator: {
        select: { id: true, name: true, whatsapp: true },
      },
      participants: {
        include: {
          user: {
            select: { id: true, name: true, whatsapp: true },
          },
        },
      },
    },
  });

  if (updatedRoom.currentQuantity >= updatedRoom.targetQuantity) {
    await lockRoom(input.roomId);
  }

  return updatedRoom;
}

export async function lockRoom(roomId: string) {
  const room = await prisma.buyingRoom.update({
    where: { id: roomId },
    data: {
      status: RoomStatus.LOCKED,
      closedAt: new Date(),
    },
    include: {
      creator: {
        select: { id: true, name: true, whatsapp: true },
      },
      participants: {
        include: {
          user: {
            select: { id: true, name: true, whatsapp: true },
          },
        },
      },
    },
  });

  return room;
}

export interface CheckoutResult {
  room: Awaited<ReturnType<typeof getRoomById>>;
  order: Awaited<ReturnType<typeof createOrderFromRoom>>;
  perMemberCost: number;
}

export async function checkoutRoom(roomId: string, buyerId: string): Promise<CheckoutResult> {
  const room = await getRoomById(roomId);

  if (room.status !== RoomStatus.LOCKED) {
    throw new ApiError(400, ErrorCodes.ROOM_NOT_JOINABLE, 'Room must be locked before checkout');
  }

  const perMemberCost = calculatePerMemberCost(room);

  const order = await createOrderFromRoom(room, buyerId, perMemberCost);

  await prisma.buyingRoom.update({
    where: { id: roomId },
    data: { status: RoomStatus.CHECKOUT },
  });

  return { room: await getRoomById(roomId), order, perMemberCost };
}

function calculatePerMemberCost(room: Awaited<ReturnType<typeof getRoomById>>): number {
  const totalCost = Number(room.priceCeiling) * room.currentQuantity;
  const commission = totalCost * 0.02;
  return Math.ceil((totalCost + commission) / room.currentQuantity);
}

async function createOrderFromRoom(
  room: Awaited<ReturnType<typeof getRoomById>>,
  buyerId: string,
  perMemberCost: number
) {
  const items = room.participants.map((p) => ({
    userId: p.userId,
    userName: p.user.name,
    quantity: p.quantity,
    pricePerUnit: perMemberCost,
    subtotal: p.quantity * perMemberCost,
  }));

  const totalAmount = items.reduce((sum, item) => sum + item.subtotal, 0);

  const order = await prisma.order.create({
    data: {
      buyerId,
      roomId: room.id,
      items: items as unknown as Prisma.JsonArray,
      totalAmount,
      status: 'DRAFT',
    },
  });

  return order;
}

export async function distributeRoom(roomId: string) {
  await prisma.buyingRoom.update({
    where: { id: roomId },
    data: { status: RoomStatus.DISTRIBUTED },
  });

  await prisma.order.updateMany({
    where: { roomId },
    data: { status: 'DELIVERED' },
  });

  return getRoomById(roomId);
}

export async function checkAndLockExpiredRooms() {
  const now = new Date();

  const expiredRooms = await prisma.buyingRoom.findMany({
    where: {
      status: RoomStatus.OPEN,
      deadline: { lte: now },
    },
  });

  for (const room of expiredRooms) {
    await lockRoom(room.id);
  }

  return expiredRooms;
}
