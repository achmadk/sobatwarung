import { prisma } from '@/db/prisma';
import { ApiError, ErrorCodes } from '@/api/response';

export interface CreateHubInput {
  ownerId: string;
  name: string;
  address: string;
  latitude?: number;
  longitude?: number;
}

export async function createHub(input: CreateHubInput) {
  const hub = await prisma.hub.create({
    data: {
      name: input.name,
      address: input.address,
      latitude: input.latitude,
      longitude: input.longitude,
      ownerId: input.ownerId,
    },
  });

  return hub;
}

export async function getHubByOwnerId(ownerId: string) {
  const hub = await prisma.hub.findUnique({
    where: { ownerId },
    include: {
      users: {
        select: {
          id: true,
          name: true,
          whatsapp: true,
          role: true,
        },
      },
    },
  });

  if (!hub) {
    throw new ApiError(404, ErrorCodes.NOT_FOUND, 'Hub not found');
  }

  return hub;
}

export async function getHubById(hubId: string) {
  const hub = await prisma.hub.findUnique({
    where: { id: hubId },
    include: {
      users: {
        select: {
          id: true,
          name: true,
          whatsapp: true,
          role: true,
        },
      },
    },
  });

  if (!hub) {
    throw new ApiError(404, ErrorCodes.NOT_FOUND, 'Hub not found');
  }

  return hub;
}
