import type { MiddlewareHandler } from 'hono';
import type { Context } from 'hono';
import { ApiError, ErrorCodes } from '@/api/response';
import type { AuthUser } from './auth';

type Role = 'AGEN_UTAMA' | 'AGEN_MITRA' | 'RESELLER' | 'PEMASOK';

export function requireRole(...allowedRoles: Role[]): MiddlewareHandler {
  return async (c: Context) => {
    const user = c.get('user') as AuthUser | undefined;

    if (!user) {
      throw new ApiError(401, ErrorCodes.MISSING_AUTH, 'Authentication required');
    }

    if (!allowedRoles.includes(user.role as Role)) {
      throw new ApiError(403, ErrorCodes.ROLE_NOT_ALLOWED, 'Insufficient permissions');
    }
  };
}
