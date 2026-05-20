export type OrderStatus = "draft" | "confirmed" | "paid" | "shipped" | "delivered" | "cancelled";

export interface OrderItem {
  productId: string;
  name: string;
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
  buyerId: string;
  roomId?: string;
  items: OrderItem[];
  totalAmount: number;
  status: OrderStatus;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}
