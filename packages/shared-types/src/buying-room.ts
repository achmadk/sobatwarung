export type RoomStatus = "OPEN" | "LOCKED" | "CHECKOUT" | "DISTRIBUTED";

export interface RoomParticipant {
  userId: string;
  userName: string;
  quantity: number;
  joinedAt: string;
}

export interface BuyingRoom {
  id: string;
  hubId: string;
  createdBy: string;
  productName: string;
  targetQuantity: number;
  priceCeiling: number;
  currentQuantity: number;
  status: RoomStatus;
  deadline: string;
  participants: RoomParticipant[];
  createdAt: string;
}
