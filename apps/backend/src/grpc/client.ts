import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import path from 'path';
import pino from 'pino';

const logger = pino({ name: 'grpc-client' });

const GRPC_HOST = process.env.GRPC_HOST || '[::1]:50051';
const SYNC_USE_GRPC = process.env.SYNC_USE_GRPC === 'true';

const PROTO_PATH = path.resolve(
  __dirname,
  '../../../services/rust-sync-engine/proto/sync.proto'
);

interface CircuitBreakerState {
  failures: number;
  lastFailure: number;
  state: 'closed' | 'open' | 'half-open';
}

const circuitBreaker: CircuitBreakerState = {
  failures: 0,
  lastFailure: 0,
  state: 'closed',
};

const CIRCUIT_BREAKER_THRESHOLD = 5;
const CIRCUIT_BREAKER_RESET_TIMEOUT_MS = 30000;

let client: grpc.Client | null = null;
let clientLoaded = false;

export function isGrpcEnabled(): boolean {
  return SYNC_USE_GRPC;
}

export function isCircuitBreakerOpen(): boolean {
  if (circuitBreaker.state === 'closed') {
    return false;
  }

  if (circuitBreaker.state === 'open') {
    if (Date.now() - circuitBreaker.lastFailure > CIRCUIT_BREAKER_RESET_TIMEOUT_MS) {
      circuitBreaker.state = 'half-open';
      logger.info('Circuit breaker transitioning to half-open state');
      return false;
    }
    return true;
  }

  return false;
}

export function recordFailure(): void {
  circuitBreaker.failures++;
  circuitBreaker.lastFailure = Date.now();

  if (circuitBreaker.failures >= CIRCUIT_BREAKER_THRESHOLD) {
    circuitBreaker.state = 'open';
    logger.warn(`Circuit breaker opened after ${circuitBreaker.failures} failures`);
  }
}

export function recordSuccess(): void {
  circuitBreaker.failures = 0;
  circuitBreaker.state = 'closed';
}

export async function getGrpcClient(): Promise<grpc.Client | null> {
  if (!SYNC_USE_GRPC) {
    return null;
  }

  if (isCircuitBreakerOpen()) {
    logger.warn('Circuit breaker is open, skipping gRPC call');
    return null;
  }

  if (client && clientLoaded) {
    return client;
  }

  try {
    const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
      keepCase: false,
      longs: String,
      enums: String,
      defaults: true,
      oneofs: true,
    });

    const protoDescriptor = grpc.loadPackageDefinition(packageDefinition) as any;
    const syncPackage = protoDescriptor.sync;

    client = new syncPackage.SyncService(
      GRPC_HOST,
      grpc.credentials.createInsecure()
    );

    clientLoaded = true;
    logger.info(`gRPC client connected to ${GRPC_HOST}`);

    return client;
  } catch (error) {
    logger.error({ error }, 'Failed to create gRPC client');
    recordFailure();
    return null;
  }
}

export async function closeGrpcClient(): Promise<void> {
  if (client) {
    client.close();
    client = null;
    clientLoaded = false;
    logger.info('gRPC client closed');
  }
}
