// SDK Client — generated from OpenAPI spec
// Matches backend API at apps/backend/

interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
  };
}

interface User {
  id: string;
  name: string;
  whatsapp: string;
  role: "AGEN_UTAMA" | "AGEN_MITRA" | "RESELLER" | "PEMASOK";
  hubId: string | null;
}

interface Order {
  id: string;
  buyerId: string;
  roomId: string | null;
  items: Array<{ productId: string; name: string; quantity: number; price: number }>;
  totalAmount: number;
  status: "DRAFT" | "CONFIRMED" | "PAID" | "SHIPPED" | "DELIVERED" | "CANCELLED";
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}

interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  unit: string;
  description: string | null;
  images: string[];
  supplierId: string;
  isActive: boolean;
}

interface BuyingRoom {
  id: string;
  hubId: string;
  productName: string;
  targetQuantity: number;
  priceCeiling: number;
  currentQuantity: number;
  status: "OPEN" | "LOCKED" | "CHECKOUT" | "DISTRIBUTED";
  deadline: string;
}

class SobatWarungClient {
  private baseUrl: string;
  private token: string | null = null;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  setToken(token: string) {
    this.token = token;
  }

  private async request<T>(path: string, options?: RequestInit): Promise<T> {
    const headers: Record<string, string> = { "Content-Type": "application/json" };
    if (this.token) headers["Authorization"] = `Bearer ${this.token}`;

    const res = await fetch(`${this.baseUrl}${path}`, { ...options, headers });

    const json = await res.json() as ApiResponse<T>;

    if (!res.ok || !json.success) {
      const errorCode = json.error?.code ?? "UNKNOWN_ERROR";
      const message = json.error?.message ?? `HTTP ${res.status}`;
      throw new Error(`${errorCode}: ${message}`);
    }

    return json.data as T;
  }

  // Auth
  async login(data: { whatsapp: string; password: string }) {
    return this.request<{ accessToken: string; refreshToken: string; userId: string }>("/api/v1/auth/login", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async register(data: { name: string; whatsapp: string; password: string; role: string; devicePublicKey?: string }) {
    return this.request<{ accessToken: string; refreshToken: string; userId: string; hubId?: string }>("/api/v1/auth/register", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async refresh(data: { refreshToken: string }) {
    return this.request<{ accessToken: string; refreshToken: string }>("/api/v1/auth/refresh", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async logout(data: { refreshToken: string }) {
    return this.request<{ message: string }>("/api/v1/auth/logout", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  // Users
  async getMe() {
    return this.request<User>("/api/v1/users/me");
  }

  async updateDeviceKey(data: { devicePublicKey: string }) {
    return this.request<{ id: string; devicePublicKey: string }>("/api/v1/users/me/device-key", {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  // Orders
  async getOrders() {
    return this.request<Order[]>("/api/v1/orders");
  }

  async getOrder(id: string) {
    return this.request<Order>(`/api/v1/orders/${id}`);
  }

  async createOrder(data: { items: Array<{ productId: string; name: string; quantity: number; price: number }>; notes?: string; roomId?: string }) {
    return this.request<Order>("/api/v1/orders", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async updateOrderStatus(id: string, status: string) {
    return this.request<Order>(`/api/v1/orders/${id}/${status}`, {
      method: "PUT",
    });
  }

  // Products
  async getProducts(query: string = "") {
    return this.request<Product[]>(`/api/v1/products${query}`);
  }

  async getProduct(id: string) {
    return this.request<Product>(`/api/v1/products/${id}`);
  }

  async createProduct(data: { name: string; category: string; price: number; unit: string; description?: string; images?: string[] }) {
    return this.request<Product>("/api/v1/products", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async updateProduct(id: string, data: Partial<{ name: string; category: string; price: number; unit: string; description?: string; images?: string[] }>) {
    return this.request<Product>(`/api/v1/products/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  async deleteProduct(id: string) {
    return this.request<Product>(`/api/v1/products/${id}`, {
      method: "DELETE",
    });
  }

  // Etalase
  async getEtalaseProducts(agenId: string) {
    return this.request<{ hub: { id: string; name: string }; products: Product[] }>(`/api/v1/etalase/${agenId}/products`);
  }

  async getEtalaseLink() {
    return this.request<{ link: string; hubId: string }>("/api/v1/etalase/link", {
      method: "POST",
    });
  }

  // Rooms
  async getRooms(query: string = "") {
    return this.request<BuyingRoom[]>(`/api/v1/rooms${query}`);
  }

  async createRoom(data: {
    productId: string;
    targetQuantity: number;
    priceCeiling: number;
    deadline: string;
  }) {
    return this.request<BuyingRoom>("/api/v1/rooms", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async getRoom(id: string) {
    return this.request<BuyingRoom>(`/api/v1/rooms/${id}`);
  }

  async joinRoom(id: string, data: { quantity: number }) {
    return this.request<BuyingRoom>(`/api/v1/rooms/${id}/join`, {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async checkoutRoom(id: string) {
    return this.request<{ room: BuyingRoom; order: Order; perMemberCost: number }>(`/api/v1/rooms/${id}/checkout`, {
      method: "POST",
    });
  }

  async distributeRoom(id: string) {
    return this.request<BuyingRoom>(`/api/v1/rooms/${id}/distribute`, {
      method: "POST",
    });
  }

  // Sync
  async syncPush(data: { deviceId: string; lastSyncTimestamp: string; mutations: unknown[]; signature: string }) {
    return this.request<{ accepted: string[]; rejected: unknown[]; conflicts: unknown[]; serverTimestamp: string }>("/api/v1/sync/push", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async syncPull(data: { deviceId: string; lastSyncTimestamp: string }) {
    return this.request<{ changes: unknown[]; serverTimestamp: string }>("/api/v1/sync/pull", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  // Agents
  async emitAgentEvent(data: { id: string; timestamp: string; traceId: string; sourceDeviceId: string; sourceAgent: string; targetAudience: "HUB" | "PARTNER" | "ALL"; action: string; payload: Record<string, unknown>; signature: string }) {
    return this.request<{ eventId: string }>("/api/v1/agents/events", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }
}

export { SobatWarungClient, type User, type Order, type Product, type BuyingRoom, type ApiResponse };
