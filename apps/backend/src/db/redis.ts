import Redis from 'ioredis';
import { env } from '@/config/env';

let redis: Redis | null = null;

export function getRedis(): Redis {
  if (!redis) {
    redis = new Redis(env.REDIS_URL, {
      maxRetriesPerRequest: 3,
      retryStrategy(times) {
        const delay = Math.min(times * 50, 2000);
        return delay;
      },
    });

    redis.on('error', (err) => {
      console.error('Redis connection error:', err);
    });

    redis.on('connect', () => {
      console.log('Redis connected');
    });
  }
  return redis;
}

export async function redisDisconnect(): Promise<void> {
  if (redis) {
    await redis.quit();
    redis = null;
  }
}

export const redisKeyPrefix = {
  refreshToken: 'refresh:',
  session: 'session:',
  wsRoom: 'ws:room:',
} as const;
