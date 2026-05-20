import type { MiddlewareHandler } from 'hono';
import { ApiError, errorResponse } from '@/api/response';

export const errorHandler: MiddlewareHandler = async (c, next) => {
  try {
    await next();
  } catch (err) {
    if (err instanceof ApiError) {
      return c.json(errorResponse(err.code, err.message), err.statusCode as any);
    }

    console.error('Unhandled error:', err);
    return c.json(
      errorResponse('INTERNAL_ERROR', 'An unexpected error occurred'),
      500 as any
    );
  }
};
