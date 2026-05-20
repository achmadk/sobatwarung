import { prisma } from '@/db/prisma';

export async function handleIncomingMessage(
  remoteJid: string,
  messageText: string
): Promise<void> {
  const normalizedText = messageText.toLowerCase().trim();

  if (normalizedText.includes('order') || normalizedText.includes('pesan')) {
    console.log(`Potential order message from ${remoteJid}: ${messageText}`);
  }

  if (normalizedText.startsWith('status ')) {
    const orderId = normalizedText.slice(7).trim();
    console.log(`Status query for order ${orderId} from ${remoteJid}`);
  }
}

export async function handleStatusQuery(
  remoteJid: string,
  orderId: string
): Promise<string> {
  try {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      select: {
        id: true,
        status: true,
        items: true,
        totalAmount: true,
      },
    });

    if (!order) {
      return 'Order tidak ditemukan. Pastikan ID order benar.';
    }

    const items = order.items as Array<{ name: string; quantity: number }>;
    const itemsList = items
      .map((item) => `- ${item.name} x${item.quantity}`)
      .join('\n');

    return `Status Order ${order.id}

Status: ${order.status}
Items:
${itemsList}
Total: Rp${Number(order.totalAmount).toLocaleString()}`;
  } catch (error) {
    console.error('Error handling status query:', error);
    return 'Terjadi kesalahan. Silakan coba lagi nanti.';
  }
}
