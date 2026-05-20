import { z } from 'zod';
import { config } from 'dotenv';

config();

const envSchema = z.object({
  DATABASE_URL: z.string().url(),
  REDIS_URL: z.string().url(),
  JWT_SECRET: z.string().min(32),
  JWT_EXPIRY: z.string().default('15m'),
  REFRESH_TOKEN_EXPIRY: z.string().default('7d'),
  WHATSAPP_SESSION_DIR: z.string().default('./whatsapp-sessions'),
  CORS_ORIGIN: z.string().default('*'),
  PORT: z.string().default('3000'),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error('Invalid environment variables:', parsed.error.flatten().fieldErrors);
  process.exit(1);
}

export const env = parsed.data;
