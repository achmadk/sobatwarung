import { Hono } from 'hono';
import { z } from 'zod';
import { authMiddleware, type AuthUser } from '@/api/middleware/auth';
import { requireRole } from '@/api/middleware/role-guard';
import {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deactivateProduct,
} from '@/services/product.service';
import { successResponse, ApiError, ErrorCodes } from '@/api/response';
import type { CreateProductInput, UpdateProductInput } from '@/services/product.service';

const productsRouter = new Hono();

const createProductSchema = z.object({
  name: z.string().min(1),
  category: z.string().min(1),
  price: z.number().positive(),
  unit: z.string().min(1),
  description: z.string().optional(),
  images: z.array(z.string()).optional(),
});

const updateProductSchema = createProductSchema.partial();

productsRouter.use('/*', authMiddleware as any);

productsRouter.post('/', requireRole('PEMASOK') as any, async (c) => {
  const user = (c.get as any)('user') as AuthUser;
  const body = await c.req.json();

  try {
    const data = createProductSchema.parse(body) as Omit<CreateProductInput, 'supplierId'>;
    const product = await createProduct({
      ...data,
      supplierId: user.id,
    });

    return c.json(successResponse(product), 201);
  } catch (err) {
    if (err instanceof Error && err.name === 'ZodError') {
      throw new ApiError(400, ErrorCodes.VALIDATION_ERROR, 'Invalid product data');
    }
    throw err;
  }
});

productsRouter.get('/', async (c) => {
  const category = c.req.query('category');
  const supplierId = c.req.query('supplierId');
  const hubId = c.req.query('hubId');
  const activeOnly = c.req.query('activeOnly') !== 'false';

  const products = await getProducts({
    category,
    supplierId,
    hubId,
    activeOnly,
  });

  return c.json(successResponse(products));
});

productsRouter.get('/:id', async (c) => {
  const productId = c.req.param('id');
  const product = await getProductById(productId);
  return c.json(successResponse(product));
});

productsRouter.put('/:id', async (c) => {
  const user = (c.get as any)('user') as AuthUser;
  const productId = c.req.param('id');
  const body = await c.req.json();

  try {
    const data = updateProductSchema.parse(body) as UpdateProductInput;
    const product = await updateProduct(productId, user.id, data);
    return c.json(successResponse(product));
  } catch (err) {
    if (err instanceof Error && err.name === 'ZodError') {
      throw new ApiError(400, ErrorCodes.VALIDATION_ERROR, 'Invalid product data');
    }
    throw err;
  }
});

productsRouter.delete('/:id', async (c) => {
  const user = (c.get as any)('user') as AuthUser;
  const productId = c.req.param('id');

  const product = await deactivateProduct(productId, user.id);
  return c.json(successResponse(product));
});

export default productsRouter;
