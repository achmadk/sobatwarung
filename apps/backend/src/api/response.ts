export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
  };
}

export function successResponse<T>(data: T): ApiResponse<T> {
  return {
    success: true,
    data,
  };
}

export function errorResponse(code: string, message: string): ApiResponse {
  return {
    success: false,
    error: {
      code,
      message,
    },
  };
}

export class ApiError extends Error {
  constructor(
    public statusCode: number,
    public code: string,
    message: string
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export const ErrorCodes = {
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  INVALID_CREDENTIALS: 'INVALID_CREDENTIALS',
  TOKEN_EXPIRED: 'TOKEN_EXPIRED',
  INVALID_TOKEN: 'INVALID_TOKEN',
  MISSING_AUTH: 'MISSING_AUTH',
  WHATSAPP_EXISTS: 'WHATSAPP_EXISTS',
  NOT_FOUND: 'NOT_FOUND',
  ACCESS_DENIED: 'ACCESS_DENIED',
  ROLE_NOT_ALLOWED: 'ROLE_NOT_ALLOWED',
  ROOM_NOT_JOINABLE: 'ROOM_NOT_JOINABLE',
  HUB_MISMATCH: 'HUB_MISMATCH',
  CANNOT_CANCEL: 'CANNOT_CANCEL',
  INVALID_DEADLINE: 'INVALID_DEADLINE',
  INVALID_SIGNATURE: 'INVALID_SIGNATURE',
  CONFLICT: 'CONFLICT',
  SERVICE_UNAVAILABLE: 'SERVICE_UNAVAILABLE',
} as const;
