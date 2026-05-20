import Dexie, { type Table } from "dexie";

export interface CachedProduct {
  id: string;
  name: string;
  category: string;
  price: number;
  unit: string;
  imageUrl?: string;
  supplierId: string;
  hubId: string;
  cachedAt: number;
}

export interface CachedOrder {
  id: string;
  items: { productId: string; name: string; quantity: number; price: number }[];
  totalAmount: number;
  status: string;
  isDirty: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface SyncQueueItem {
  id?: number;
  mutationId: string;
  entity: string;
  operation: string;
  entityId: string;
  data: string;
  timestamp: string;
  status: "pending" | "syncing" | "synced" | "failed";
  error?: string;
}

class SobatWarungDB extends Dexie {
  products!: Table<CachedProduct, string>;
  orders!: Table<CachedOrder, string>;
  syncQueue!: Table<SyncQueueItem, number>;

  constructor() {
    super("SobatWarungDB");
    this.version(1).stores({
      products: "id, category, hubId, cachedAt",
      orders: "id, status, createdAt",
      syncQueue: "++id, mutationId, entity, status",
    });
  }
}

export const db = new SobatWarungDB();
