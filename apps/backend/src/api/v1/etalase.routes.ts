import { Hono } from 'hono';
import { authMiddleware, type AuthUser } from '@/api/middleware/auth';
import { getProductsByHubForEtalase } from '@/services/product.service';
import { getHubById } from '@/services/hub.service';
import { appConfig } from '@/config/app';
import { successResponse, ApiError, ErrorCodes } from '@/api/response';

const etalaseRouter = new Hono();

etalaseRouter.post('/link', authMiddleware as any, async (c) => {
  const user = (c.get as any)('user') as AuthUser;

  if (!user.hubId) {
    throw new ApiError(400, ErrorCodes.ACCESS_DENIED, 'User does not have a hub');
  }

  const link = `${appConfig.etalaseBaseUrl}/${user.id}`;
  return c.json(successResponse({ link, hubId: user.hubId }));
});

etalaseRouter.get('/:agenId/products', async (c) => {
  const agenId = c.req.param('agenId');

  const hub = await getHubById(agenId).catch(() => null);

  if (!hub) {
    throw new ApiError(404, ErrorCodes.NOT_FOUND, 'Hub not found');
  }

  const products = await getProductsByHubForEtalase(hub.id);
  return c.json(successResponse({
    hub: {
      id: hub.id,
      name: hub.name,
    },
    products,
  }));
});

export default etalaseRouter;
