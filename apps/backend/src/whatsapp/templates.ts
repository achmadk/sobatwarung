interface OrderTemplateData {
  orderId: string;
  items: Array<{ name: string; quantity: number; price: number }>;
  totalAmount: number;
}

interface RoomTemplateData {
  roomId: string;
  productName: string;
  targetQuantity: number;
  currentQuantity: number;
  status: string;
}

interface StockAlertTemplateData {
  productName: string;
  currentStock: number;
  minStock: number;
}

export function formatOrderConfirmation(data: OrderTemplateData): string {
  const itemsList = data.items
    .map((item) => `- ${item.name} x${item.quantity} = Rp${item.price.toLocaleString()}`)
    .join('\n');

  return `Pesanan berhasil dibuat!

Order ID: ${data.orderId}

${itemsList}

Total: Rp${data.totalAmount.toLocaleString()}

Terima kasih telah berbelanja di SobatWarung!`;
}

export function formatRoomUpdate(data: RoomTemplateData): string {
  const statusMessage = {
    LOCKED: 'Room Pembelian Telah Dikunci',
    CHECKOUT: 'Room Pembelian Dalam Proses Checkout',
    DISTRIBUTED: 'Barang Telah Didistribusikan',
  }[data.status] || `Update Room: ${data.status}`;

  return `${statusMessage}

Produk: ${data.productName}
Target: ${data.targetQuantity}
Tersedia: ${data.currentQuantity}
Room ID: ${data.roomId}`;
}

export function formatStockAlert(data: StockAlertTemplateData): string {
  return `⚠️ Alert Stok Rendah

Produk: ${data.productName}
Stok Saat Ini: ${data.currentStock}
Stok Minimum: ${data.minStock}

Segera lakukan restock!`;
}

export function formatEtalaseLink(agentId: string, productId?: string): string {
  let link = `https://etalase.sobatwarung.com/${agentId}`;
  if (productId) {
    link += `?product=${productId}`;
  }
  return link;
}

export function formatWhatsAppOrderMessage(
  productName: string,
  quantity: number,
  total: number
): string {
  return `Halo, saya ingin memesan:

- ${productName} x ${quantity} = Rp${total.toLocaleString()}

Terima kasih!`;
}
