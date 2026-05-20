import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { env } from '@/config/env';
import { errorHandler } from '@/api/middleware/error-handler';
import { successResponse } from '@/api/response';
import { appConfig } from '@/config/app';

import authRouter from '@/api/v1/auth.routes';
import usersRouter from '@/api/v1/users.routes';
import roomsRouter from '@/api/v1/rooms.routes';
import ordersRouter from '@/api/v1/orders.routes';
import productsRouter from '@/api/v1/products.routes';
import etalaseRouter from '@/api/v1/etalase.routes';
import syncRouter from '@/api/v1/sync.routes';
import agentsRouter from '@/api/v1/agents.routes';

import { initializeSocket } from '@/ws/connection';
import { prisma, prismaDisconnect } from '@/db/prisma';
import { redisDisconnect } from '@/db/redis';
import { initializeWhatsAppService } from '@/services/whatsapp.service';
import { checkAndLockExpiredRooms } from '@/services/room.service';

const app = new Hono();

app.use('*', cors({ origin: env.CORS_ORIGIN }));
app.use('*', errorHandler);

app.get('/health', (c) => {
  return c.json(
    successResponse({
      status: 'ok',
      timestamp: new Date().toISOString(),
      version: '0.1.0',
    })
  );
});

const API_PREFIX = appConfig.apiPrefix;

app.route(`${API_PREFIX}/auth`, authRouter);
app.route(`${API_PREFIX}/users`, usersRouter);
app.route(`${API_PREFIX}/rooms`, roomsRouter);
app.route(`${API_PREFIX}/orders`, ordersRouter);
app.route(`${API_PREFIX}/products`, productsRouter);
app.route(`${API_PREFIX}/etalase`, etalaseRouter);
app.route(`${API_PREFIX}/sync`, syncRouter);
app.route(`${API_PREFIX}/agents`, agentsRouter);

async function start() {
  try {
    await prisma.$connect();
    console.log('Database connected');

    await initializeWhatsAppService();

    initializeSocket();

    setInterval(async () => {
      try {
        await checkAndLockExpiredRooms();
      } catch (error) {
        console.error('Error checking expired rooms:', error);
      }
    }, 60000);

    console.log(`Server running on port ${env.PORT}`);
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

async function shutdown() {
  console.log('Shutting down...');

  try {
    await prismaDisconnect();
    await redisDisconnect();
    process.exit(0);
  } catch (error) {
    console.error('Error during shutdown:', error);
    process.exit(1);
  }
}

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);

start();

export default app;
