import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { prisma } from '@/db/prisma';
import { getRedis, redisKeyPrefix } from '@/db/redis';
import { env } from '@/config/env';
import { ApiError, ErrorCodes } from '@/api/response';
import { UserRole } from '@prisma/client';

const SALT_ROUNDS = 10;

export interface RegisterInput {
  name: string;
  whatsapp: string;
  password: string;
  role: UserRole;
  devicePublicKey?: string;
}

export interface LoginInput {
  whatsapp: string;
  password: string;
}

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS);
}

async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

function generateTokens(userId: string): TokenPair {
  const accessToken = jwt.sign({ sub: userId }, env.JWT_SECRET, {
    expiresIn: '15m',
  });

  const refreshToken = jwt.sign({ sub: userId, type: 'refresh' }, env.JWT_SECRET, {
    expiresIn: '7d',
  });

  return { accessToken, refreshToken };
}

export async function register(input: RegisterInput): Promise<TokenPair & { userId: string; hubId?: string }> {
  const existingUser = await prisma.user.findUnique({
    where: { whatsapp: input.whatsapp },
  });

  if (existingUser) {
    throw new ApiError(409, ErrorCodes.WHATSAPP_EXISTS, 'WhatsApp number already registered');
  }

  const passwordHash = await hashPassword(input.password);

  let hubId: string | undefined;

  if (input.role === 'AGEN_UTAMA') {
    const user = await prisma.user.create({
      data: {
        name: input.name,
        whatsapp: input.whatsapp,
        passwordHash,
        role: input.role,
        devicePublicKey: input.devicePublicKey || '',
      },
    });

    const hub = await prisma.hub.create({
      data: {
        name: `${input.name}'s Hub`,
        address: '',
        ownerId: user.id,
      },
    });

    await prisma.user.update({
      where: { id: user.id },
      data: { hubId: hub.id },
    });

    hubId = hub.id;

    const tokens = generateTokens(user.id);
    await storeRefreshToken(user.id, tokens.refreshToken);

    return { ...tokens, userId: user.id, hubId };
  }

  const user = await prisma.user.create({
    data: {
      name: input.name,
      whatsapp: input.whatsapp,
      passwordHash,
      role: input.role,
      devicePublicKey: input.devicePublicKey || '',
    },
  });

  const tokens = generateTokens(user.id);
  await storeRefreshToken(user.id, tokens.refreshToken);

  return { ...tokens, userId: user.id };
}

export async function login(input: LoginInput): Promise<TokenPair & { userId: string }> {
  const user = await prisma.user.findUnique({
    where: { whatsapp: input.whatsapp },
  });

  if (!user) {
    throw new ApiError(401, ErrorCodes.INVALID_CREDENTIALS, 'Invalid credentials');
  }

  const isValid = await verifyPassword(input.password, user.passwordHash);

  if (!isValid) {
    throw new ApiError(401, ErrorCodes.INVALID_CREDENTIALS, 'Invalid credentials');
  }

  const tokens = generateTokens(user.id);
  await storeRefreshToken(user.id, tokens.refreshToken);

  return { ...tokens, userId: user.id };
}

export async function refreshTokens(refreshToken: string): Promise<TokenPair> {
  try {
    const decoded = jwt.verify(refreshToken, env.JWT_SECRET) as { sub: string; type: string };

    if (decoded.type !== 'refresh') {
      throw new ApiError(401, ErrorCodes.INVALID_TOKEN, 'Invalid refresh token');
    }

    const redis = getRedis();
    const storedToken = await redis.get(`${redisKeyPrefix.refreshToken}${decoded.sub}`);

    if (storedToken !== refreshToken) {
      throw new ApiError(401, ErrorCodes.INVALID_TOKEN, 'Token has been revoked');
    }

    await invalidateRefreshToken(decoded.sub);

    return generateTokens(decoded.sub);
  } catch (err) {
    if (err instanceof ApiError) {
      throw err;
    }
    if (err instanceof jwt.TokenExpiredError) {
      throw new ApiError(401, ErrorCodes.TOKEN_EXPIRED, 'Refresh token expired');
    }
    throw new ApiError(401, ErrorCodes.INVALID_TOKEN, 'Invalid refresh token');
  }
}

export async function logout(userId: string): Promise<void> {
  await invalidateRefreshToken(userId);
}

async function storeRefreshToken(userId: string, token: string): Promise<void> {
  const redis = getRedis();
  await redis.setex(`${redisKeyPrefix.refreshToken}${userId}`, 604800, token);
}

async function invalidateRefreshToken(userId: string): Promise<void> {
  const redis = getRedis();
  await redis.del(`${redisKeyPrefix.refreshToken}${userId}`);
}
