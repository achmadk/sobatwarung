export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  unit: string;
  description?: string;
  images: string[];
  supplierId: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}
