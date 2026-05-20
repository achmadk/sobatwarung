import { Hono } from 'hono';
import { z } from 'zod';
import { deviceKeyMiddleware } from '@/api/middleware/device-key';
import { processSyncPush, processSyncPull } from '@/services/sync.service';
import { successResponse, ApiError, ErrorCodes } from '@/api/response';
import type { SyncPushRequest, SyncPullRequest } from '@/sync/types';

const syncRouter = new Hono();

const syncPushSchema = z.object({
  deviceId: z.string(),
  lastSyncTimestamp: z.string(),
  mutations: z.array(
    z.object({
      id: z.string(),
      entity: z.enum(['order', 'product', 'room', 'user', 'roomParticipant']),
      operation: z.enum(['create', 'update', 'delete']),
      entityId: z.string(),
      data: z.record(z.unknown()),
      timestamp: z.string(),
      deviceId: z.string(),
    })
  ),
});

const syncPullSchema = z.object({
  deviceId: z.string(),
  lastSyncTimestamp: z.string(),
});

syncRouter.post('/push', deviceKeyMiddleware as any, async (c) => {
  const body = await c.req.json();

  const result = syncPushSchema.safeParse(body);
  if (!result.success) {
    throw new ApiError(400, ErrorCodes.VALIDATION_ERROR, 'Invalid sync push data');
  }

  const response = await processSyncPush(result.data as unknown as SyncPushRequest);
  return c.json(successResponse(response));
});

syncRouter.post('/pull', deviceKeyMiddleware as any, async (c) => {
  const body = await c.req.json();

  const result = syncPullSchema.safeParse(body);
  if (!result.success) {
    throw new ApiError(400, ErrorCodes.VALIDATION_ERROR, 'Invalid sync pull data');
  }

  const response = await processSyncPull(result.data as unknown as SyncPullRequest);
  return c.json(successResponse(response));
});

export default syncRouter;
