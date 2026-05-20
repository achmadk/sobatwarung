import { PrismaClient } from '@prisma/client';

declare global {
  var __prisma: PrismaClient | undefined;
}

function createPrismaClient(): PrismaClient {
  const client = new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });
  return client;
}

export const prisma = globalThis.__prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== 'production') {
  globalThis.__prisma = prisma;
}

export async function prismaDisconnect(): Promise<void> {
  await prisma.$disconnect();
}
