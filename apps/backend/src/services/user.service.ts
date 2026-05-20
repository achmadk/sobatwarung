import { prisma } from '@/db/prisma';
import { ApiError, ErrorCodes } from '@/api/response';

export interface UpdateDeviceKeyInput {
  userId: string;
  devicePublicKey: string;
}

export async function getUserProfile(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      whatsapp: true,
      role: true,
      hubId: true,
      devicePublicKey: true,
      createdAt: true,
    },
  });

  if (!user) {
    throw new ApiError(404, ErrorCodes.NOT_FOUND, 'User not found');
  }

  return user;
}

export async function updateDeviceKey(input: UpdateDeviceKeyInput) {
  const user = await prisma.user.update({
    where: { id: input.userId },
    data: { devicePublicKey: input.devicePublicKey },
    select: {
      id: true,
      devicePublicKey: true,
    },
  });

  return user;
}
