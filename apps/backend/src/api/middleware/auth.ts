import type { MiddlewareHandler } from 'hono';
import type { Context } from 'hono';
import jwt from 'jsonwebtoken';
import { prisma } from '@/db/prisma';
import { ApiError, ErrorCodes } from '@/api/response';
import { env } from '@/config/env';

export interface AuthUser {
  id: string;
  whatsapp: string;
  role: string;
  hubId: string | null;
}

export type AuthVariables = {
  user: AuthUser;
};

export const authMiddleware: MiddlewareHandler = async (c: Context) => {
  const authHeader = c.req.header('Authorization');

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new ApiError(401, ErrorCodes.MISSING_AUTH, 'Missing or invalid Authorization header');
  }

  const token = authHeader.slice(7);

  try {
    const decoded = jwt.verify(token, env.JWT_SECRET) as { sub: string };

    const user = await prisma.user.findUnique({
      where: { id: decoded.sub },
      select: { id: true, whatsapp: true, role: true, hubId: true },
    });

    if (!user) {
      throw new ApiError(401, ErrorCodes.INVALID_TOKEN, 'User not found');
    }

    c.set('user', user as AuthUser);
  } catch (err) {
    if (err instanceof jwt.TokenExpiredError) {
      throw new ApiError(401, ErrorCodes.TOKEN_EXPIRED, 'Token has expired');
    }
    if (err instanceof jwt.JsonWebTokenError) {
      throw new ApiError(401, ErrorCodes.INVALID_TOKEN, 'Invalid token');
    }
    if (err instanceof ApiError) {
      throw err;
    }
    throw new ApiError(401, ErrorCodes.INVALID_TOKEN, 'Authentication failed');
  }
};
