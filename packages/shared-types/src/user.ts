export type UserRole = "agen-utama" | "agen-mitra" | "reseller" | "pemasok";

export interface User {
  id: string;
  name: string;
  whatsapp: string;
  role: UserRole;
  devicePublicKey: string;
  hubId?: string;
  createdAt: string;
}
