import * as grpc from '@grpc/grpc-js';
import { getGrpcClient, recordFailure, recordSuccess, isGrpcEnabled, isCircuitBreakerOpen } from './client';
import pino from 'pino';

const logger = pino({ name: 'sync-grpc-client' });

export interface GrpcMutation {
  id: string;
  entity_type: string;
  entity_id: string;
  payload: Uint8Array;
  vector_clock: Record<string, number>;
  timestamp: number;
}

export interface GrpcSyncBatchRequest {
  agency_id: string;
  client_id: string;
  batch_id: string;
  mutations: GrpcMutation[];
}

export interface GrpcConflict {
  entity_id: string;
  entity_type: string;
  server_timestamp: number;
  client_timestamp: number;
  resolution: string;
}

export interface GrpcSyncBatchResponse {
  batch_id: string;
  merged_state: Uint8Array;
  conflicts: GrpcConflict[];
  sync_timestamp: number;
}

export interface GrpcGetStateRequest {
  agency_id: string;
  client_id: string;
}

export interface GrpcGetStateResponse {
  state: Uint8Array;
  sync_timestamp: number;
}

export async function syncBatchViaGrpc(request: GrpcSyncBatchRequest): Promise<GrpcSyncBatchResponse | null> {
  if (!isGrpcEnabled()) {
    logger.debug('gRPC sync disabled');
    return null;
  }

  if (isCircuitBreakerOpen()) {
    logger.warn('Circuit breaker open, skipping gRPC sync');
    return null;
  }

  const client = await getGrpcClient();
  if (!client) {
    logger.warn('gRPC client not available');
    return null;
  }

  return new Promise((resolve) => {
    client!.makeUnaryRequest(
      '/sync.SyncService/SyncBatch',
      (req: GrpcSyncBatchRequest) => Buffer.from(JSON.stringify(req)),
      (buf: Buffer) => {
        try {
          const parsed = JSON.parse(buf.toString());
          return Buffer.from(JSON.stringify(parsed));
        } catch {
          return buf;
        }
      },
      request,
      {},
      (error: grpc.ServiceError | null, response: any) => {
        if (error) {
          logger.error({ error: error.message }, 'gRPC SyncBatch failed');
          recordFailure();
          resolve(null);
        } else {
          recordSuccess();
          try {
            const resp = typeof response === 'string' ? JSON.parse(response) : response;
            resolve({
              batch_id: resp.batch_id,
              merged_state: new Uint8Array(resp.merged_state),
              conflicts: resp.conflicts || [],
              sync_timestamp: resp.sync_timestamp,
            });
          } catch {
            resolve(null);
          }
        }
      }
    );
  });
}

export async function getStateViaGrpc(request: GrpcGetStateRequest): Promise<GrpcGetStateResponse | null> {
  if (!isGrpcEnabled()) {
    return null;
  }

  if (isCircuitBreakerOpen()) {
    logger.warn('Circuit breaker open, skipping gRPC getState');
    return null;
  }

  const client = await getGrpcClient();
  if (!client) {
    return null;
  }

  return new Promise((resolve) => {
    client!.makeUnaryRequest(
      '/sync.SyncService/GetState',
      (req: GrpcGetStateRequest) => Buffer.from(JSON.stringify(req)),
      (buf: Buffer) => {
        try {
          const parsed = JSON.parse(buf.toString());
          return Buffer.from(JSON.stringify(parsed));
        } catch {
          return buf;
        }
      },
      request,
      {},
      (error: grpc.ServiceError | null, response: any) => {
        if (error) {
          logger.error({ error: error.message }, 'gRPC GetState failed');
          recordFailure();
          resolve(null);
        } else {
          recordSuccess();
          try {
            const resp = typeof response === 'string' ? JSON.parse(response) : response;
            resolve({
              state: new Uint8Array(resp.state),
              sync_timestamp: resp.sync_timestamp,
            });
          } catch {
            resolve(null);
          }
        }
      }
    );
  });
}
