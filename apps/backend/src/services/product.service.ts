import { prisma } from '@/db/prisma';
import { ApiError, ErrorCodes } from '@/api/response';
import { Prisma } from '@prisma/client';

export interface CreateProductInput {
  name: string;
  category: string;
  price: number;
  unit: string;
  description?: string;
  images?: string[];
  supplierId: string;
}

export interface UpdateProductInput {
  name?: string;
  category?: string;
  price?: number;
  unit?: string;
  description?: string;
  images?: string[];
}

export async function createProduct(input: CreateProductInput) {
  const product = await prisma.product.create({
    data: {
      name: input.name,
      category: input.category,
      price: input.price,
      unit: input.unit,
      description: input.description,
      images: input.images || [],
      supplierId: input.supplierId,
    },
    include: {
      supplier: {
        select: { id: true, name: true, whatsapp: true },
      },
    },
  });

  return product;
}

export async function getProducts(options: {
  category?: string;
  supplierId?: string;
  hubId?: string;
  activeOnly?: boolean;
}) {
  const where: Prisma.ProductWhereInput = {};

  if (options.category) {
    where.category = options.category;
  }

  if (options.supplierId) {
    where.supplierId = options.supplierId;
  }

  if (options.activeOnly !== false) {
    where.isActive = true;
  }

  if (options.hubId) {
    where.supplier = {
      hubId: options.hubId,
    };
  }

  const products = await prisma.product.findMany({
    where,
    include: {
      supplier: {
        select: { id: true, name: true, whatsapp: true },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  return products;
}

export async function getProductById(productId: string) {
  const product = await prisma.product.findUnique({
    where: { id: productId },
    include: {
      supplier: {
        select: { id: true, name: true, whatsapp: true },
      },
    },
  });

  if (!product) {
    throw new ApiError(404, ErrorCodes.NOT_FOUND, 'Product not found');
  }

  return product;
}

export async function updateProduct(productId: string, userId: string, input: UpdateProductInput) {
  const product = await getProductById(productId);

  if (product.supplierId !== userId) {
    throw new ApiError(403, ErrorCodes.ACCESS_DENIED, 'Cannot update product you do not own');
  }

  const updatedProduct = await prisma.product.update({
    where: { id: productId },
    data: {
      name: input.name,
      category: input.category,
      price: input.price,
      unit: input.unit,
      description: input.description,
      images: input.images,
    },
    include: {
      supplier: {
        select: { id: true, name: true, whatsapp: true },
      },
    },
  });

  return updatedProduct;
}

export async function deactivateProduct(productId: string, userId: string) {
  const product = await getProductById(productId);

  if (product.supplierId !== userId) {
    throw new ApiError(403, ErrorCodes.ACCESS_DENIED, 'Cannot delete product you do not own');
  }

  const deactivatedProduct = await prisma.product.update({
    where: { id: productId },
    data: { isActive: false },
  });

  return deactivatedProduct;
}

export async function getProductsByHubForEtalase(hubId: string) {
  const products = await prisma.product.findMany({
    where: {
      supplier: {
        hubId,
      },
      isActive: true,
    },
    select: {
      id: true,
      name: true,
      category: true,
      price: true,
      unit: true,
      images: true,
      description: true,
    },
    orderBy: { createdAt: 'desc' },
  });

  return products;
}
