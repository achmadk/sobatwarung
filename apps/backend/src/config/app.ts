export const appConfig = {
  apiPrefix: '/api/v1',
  wsPath: '/ws',
  etalaseBaseUrl: 'https://etalase.sobatwarung.com',
  jwt: {
    accessTokenExpiry: '15m',
    refreshTokenExpiry: '7d',
  },
  room: {
    defaultDeadlineHours: 24,
  },
  sync: {
    batchSizeLimit: 100,
  },
  whatsapp: {
    sessionDir: './whatsapp-sessions',
    maxReconnectAttempts: 5,
    reconnectDelayMs: 5000,
  },
} as const;
