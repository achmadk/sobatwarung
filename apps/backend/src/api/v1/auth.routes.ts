import { Hono } from 'hono';
import { z } from 'zod';
import { register, login, refreshTokens, logout } from '@/services/auth.service';
import { successResponse, ApiError, ErrorCodes } from '@/api/response';
import type { RegisterInput, LoginInput } from '@/services/auth.service';

const authRouter = new Hono();

const registerSchema = z.object({
  name: z.string().min(1),
  whatsapp: z.string().min(1),
  password: z.string().min(6),
  role: z.enum(['AGEN_UTAMA', 'AGEN_MITRA', 'RESELLER', 'PEMASOK']),
  devicePublicKey: z.string().optional(),
});

const loginSchema = z.object({
  whatsapp: z.string().min(1),
  password: z.string().min(1),
});

const refreshSchema = z.object({
  refreshToken: z.string().min(1),
});

authRouter.post('/register', async (c) => {
  const body = await c.req.json();

  try {
    const data = registerSchema.parse(body) as RegisterInput;
    const tokens = await register(data);

    return c.json(successResponse({
      ...tokens,
      userId: tokens.userId,
      hubId: tokens.hubId,
    }));
  } catch (err) {
    if (err instanceof Error && err.name === 'ZodError') {
      throw new ApiError(400, ErrorCodes.VALIDATION_ERROR, 'Invalid registration data');
    }
    throw err;
  }
});

authRouter.post('/login', async (c) => {
  const body = await c.req.json();

  try {
    const data = loginSchema.parse(body) as LoginInput;
    const tokens = await login(data);

    return c.json(successResponse(tokens));
  } catch (err) {
    if (err instanceof Error && err.name === 'ZodError') {
      throw new ApiError(400, ErrorCodes.VALIDATION_ERROR, 'Invalid login data');
    }
    throw err;
  }
});

authRouter.post('/refresh', async (c) => {
  const body = await c.req.json();

  try {
    const data = refreshSchema.parse(body);
    const tokens = await refreshTokens(data.refreshToken);

    return c.json(successResponse(tokens));
  } catch (err) {
    if (err instanceof Error && err.name === 'ZodError') {
      throw new ApiError(400, ErrorCodes.VALIDATION_ERROR, 'Invalid refresh data');
    }
    throw err;
  }
});

authRouter.post('/logout', async (c) => {
  const body = await c.req.json();

  try {
    const data = refreshSchema.parse(body);
    const decoded = JSON.parse(atob(data.refreshToken.split('.')[1])) as { sub: string };
    await logout(decoded.sub);
  } catch {
    // Token may be invalid, but logout should still succeed
  }

  return c.json(successResponse({ message: 'Logged out successfully' }));
});

export default authRouter;
