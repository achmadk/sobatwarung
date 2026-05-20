import type { MiddlewareHandler } from 'hono';
import type { Context } from 'hono';
import nacl from 'tweetnacl';
import { ApiError, ErrorCodes } from '@/api/response';
import { prisma } from '@/db/prisma';

export const deviceKeyMiddleware: MiddlewareHandler = async (c: Context): Promise<void> => {
  const signature = c.req.header('X-Device-Signature');
  const deviceId = c.req.header('X-Device-Id');

  if (!signature || !deviceId) {
    throw new ApiError(401, ErrorCodes.INVALID_SIGNATURE, 'Missing device signature headers');
  }

  const body = await c.req.text();
  const bodyBytes = new TextEncoder().encode(body);
  const signatureBytes = Buffer.from(signature, 'base64');

  const user = await prisma.user.findFirst({
    where: { id: deviceId },
    select: { devicePublicKey: true },
  });

  if (!user || !user.devicePublicKey) {
    throw new ApiError(401, ErrorCodes.INVALID_SIGNATURE, 'Device not registered');
  }

  const publicKeyBytes = Buffer.from(user.devicePublicKey, 'base64');

  const isValid = nacl.sign.detached.verify(bodyBytes, signatureBytes, publicKeyBytes);

  if (!isValid) {
    throw new ApiError(401, ErrorCodes.INVALID_SIGNATURE, 'Invalid device signature');
  }
};
