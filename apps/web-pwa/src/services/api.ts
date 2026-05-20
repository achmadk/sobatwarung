import { SobatWarungClient } from "@sobatwarung/sdk";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "/api/v1";

export const apiClient = new SobatWarungClient(API_BASE_URL);

export function setAuthToken(token: string) {
  apiClient.setToken(token);
}

export async function login(whatsapp: string, password: string) {
  return apiClient.login({ whatsapp, password });
}

export async function register(data: {
  name: string;
  whatsapp: string;
  password: string;
  role: "AGEN_UTAMA" | "AGEN_MITRA" | "RESELLER" | "PEMASOK";
  devicePublicKey?: string;
}) {
  return apiClient.register(data);
}

export async function refreshAccessToken(refreshToken: string) {
  return apiClient.refresh({ refreshToken });
}

export async function getCurrentUser() {
  return apiClient.getMe();
}

export async function getOrders() {
  return apiClient.getOrders();
}

export async function getOrder(id: string) {
  return apiClient.getOrder(id);
}

export async function createOrder(data: {
  items: Array<{ productId: string; name: string; quantity: number; price: number }>;
  notes?: string;
  roomId?: string;
}) {
  return apiClient.createOrder(data);
}

export async function updateOrderStatus(id: string, status: string) {
  return apiClient.updateOrderStatus(id, status);
}

export async function getProducts(params?: { category?: string; supplierId?: string; hubId?: string }) {
  const searchParams = new URLSearchParams();
  if (params?.category) searchParams.set("category", params.category);
  if (params?.supplierId) searchParams.set("supplierId", params.supplierId);
  if (params?.hubId) searchParams.set("hubId", params.hubId);
  const query = searchParams.toString();
  return apiClient.getProducts(query ? `?${query}` : "");
}

export async function getProduct(id: string) {
  return apiClient.getProduct(id);
}

export async function createProduct(data: {
  name: string;
  category: string;
  price: number;
  unit: string;
  description?: string;
  images?: string[];
}) {
  return apiClient.createProduct(data);
}

export async function updateProduct(id: string, data: Partial<{
  name: string;
  category: string;
  price: number;
  unit: string;
  description?: string;
  images?: string[];
}>) {
  return apiClient.updateProduct(id, data);
}

export async function deleteProduct(id: string) {
  return apiClient.deleteProduct(id);
}

export async function getEtalaseProducts(agenId: string) {
  return apiClient.getEtalaseProducts(agenId);
}

export async function getRooms(hubId?: string) {
  const query = hubId ? `?hubId=${hubId}` : "";
  return apiClient.getRooms(query);
}

export async function getRoom(id: string) {
  return apiClient.getRoom(id);
}

export async function joinRoom(id: string, quantity: number) {
  return apiClient.joinRoom(id, { quantity });
}

export async function checkoutRoom(id: string) {
  return apiClient.checkoutRoom(id);
}

export async function distributeRoom(id: string) {
  return apiClient.distributeRoom(id);
}

export async function logout(data: { refreshToken: string }) {
  return apiClient.logout(data);
}

export async function syncPush(data: { deviceId: string; lastSyncTimestamp: string; mutations: unknown[]; signature: string }) {
  return apiClient.syncPush(data);
}
