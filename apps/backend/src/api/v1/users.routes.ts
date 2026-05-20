import { Hono } from 'hono';
import { z } from 'zod';
import { authMiddleware, type AuthUser } from '@/api/middleware/auth';
import { getUserProfile, updateDeviceKey } from '@/services/user.service';
import { successResponse, ApiError, ErrorCodes } from '@/api/response';

const usersRouter = new Hono();

const updateDeviceKeySchema = z.object({
  devicePublicKey: z.string().min(1),
});

usersRouter.use('/*', authMiddleware as any);

usersRouter.get('/me', async (c) => {
  const user = (c.get as any)('user') as AuthUser;
  const profile = await getUserProfile(user.id);
  return c.json(successResponse(profile));
});

usersRouter.put('/me/device-key', async (c) => {
  const user = (c.get as any)('user') as AuthUser;
  const body = await c.req.json();

  const result = updateDeviceKeySchema.safeParse(body);
  if (!result.success) {
    throw new ApiError(400, ErrorCodes.VALIDATION_ERROR, 'Invalid device key data');
  }

  const updated = await updateDeviceKey({
    userId: user.id,
    devicePublicKey: result.data.devicePublicKey,
  });

  return c.json(successResponse(updated));
});

export default usersRouter;
