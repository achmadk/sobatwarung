import { prisma } from '@/db/prisma';
import { sendWhatsAppMessage, initializeWhatsApp } from '@/whatsapp/client';
import {
  formatOrderConfirmation,
  formatRoomUpdate,
  formatStockAlert,
  formatEtalaseLink,
} from '@/whatsapp/templates';

export async function notifyOrderCreated(orderId: string): Promise<void> {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: {
      buyer: { select: { whatsapp: true } },
    },
  });

  if (!order) return;

  const message = formatOrderConfirmation({
    orderId: order.id,
    items: order.items as Array<{ name: string; quantity: number; price: number }>,
    totalAmount: Number(order.totalAmount),
  });

  await sendWhatsAppMessage(order.buyer.whatsapp, message);
}

export async function notifyRoomUpdate(
  roomId: string,
  participantUserIds: string[]
): Promise<void> {
  const room = await prisma.buyingRoom.findUnique({
    where: { id: roomId },
    include: {
      participants: {
        include: { user: { select: { whatsapp: true } } },
      },
    },
  });

  if (!room) return;

  const message = formatRoomUpdate({
    roomId: room.id,
    productName: room.productName,
    targetQuantity: room.targetQuantity,
    currentQuantity: room.currentQuantity,
    status: room.status,
  });

  for (const participant of room.participants) {
    await sendWhatsAppMessage(participant.user.whatsapp, message);
  }
}

export async function notifyStockAlert(
  agenUtamWhatsApp: string,
  productName: string,
  currentStock: number,
  minStock: number
): Promise<void> {
  const message = formatStockAlert({
    productName,
    currentStock,
    minStock,
  });

  await sendWhatsAppMessage(agenUtamWhatsApp, message);
}

export function generateEtalaseLink(agentId: string, productId?: string): string {
  return formatEtalaseLink(agentId, productId);
}

export async function initializeWhatsAppService(): Promise<void> {
  await initializeWhatsApp();
}
