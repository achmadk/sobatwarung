import { AgentEvent } from "./event-bus";
import { syncBatchViaGrpc } from "@/grpc/sync-service";
import { isGrpcEnabled, isCircuitBreakerOpen, recordSuccess, recordFailure } from "@/grpc/client";
import pino from "pino";

const logger = pino({ name: "privacy-guard" });

export interface PrivacyGuardResult {
  validated: boolean;
  reason?: string;
}

export function requiresPrivacyGuardRouting(event: AgentEvent): boolean {
  return (
    (event.targetAudience === "HUB" || event.targetAudience === "ALL") &&
    event.encryptionFlags !== undefined &&
    Object.keys(event.encryptionFlags).length > 0
  );
}

export function shouldBypassRustValidation(event: AgentEvent): boolean {
  return event.encryptionFlags === undefined || Object.keys(event.encryptionFlags).length === 0;
}

export async function validateWithRustCryptoHub(event: AgentEvent): Promise<PrivacyGuardResult> {
  if (!isGrpcEnabled()) {
    logger.debug("gRPC disabled, skipping Privacy-Guard validation");
    return { validated: true };
  }

  if (isCircuitBreakerOpen()) {
    logger.warn("Circuit breaker open, skipping Privacy-Guard validation");
    return { validated: true };
  }

  try {
    const grpcResponse = await syncBatchViaGrpc({
      agency_id: event.sourceDeviceId,
      client_id: event.sourceDeviceId,
      batch_id: `privacy-guard-${Date.now()}`,
      mutations: [
        {
          id: event.id,
          entity_type: "privacy_guard",
          entity_id: event.id,
          payload: new TextEncoder().encode(
            JSON.stringify({
              eventType: event.eventType,
              targetAudience: event.targetAudience,
              action: event.action,
              payload: event.payload,
              encryptionFlags: event.encryptionFlags,
            }),
          ),
          vector_clock: {},
          timestamp: new Date(event.timestamp).getTime(),
        },
      ],
    });

    if (grpcResponse) {
      recordSuccess();
      return {
        validated: grpcResponse.conflicts.length === 0,
        reason: grpcResponse.conflicts.length > 0 ? "CRDT merge conflicts detected" : undefined,
      };
    }

    logger.warn("gRPC validation returned null, allowing event through");
    return { validated: true };
  } catch (error) {
    logger.error({ error }, "Privacy-Guard validation failed");
    recordFailure();
    return {
      validated: false,
      reason: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

export function sanitizeEventForLogging(event: AgentEvent): Partial<AgentEvent> {
  return {
    id: event.id,
    timestamp: event.timestamp,
    traceId: event.traceId,
    sourceDeviceId: event.sourceDeviceId,
    sourceAgent: event.sourceAgent,
    targetAudience: event.targetAudience,
    action: event.action,
    eventType: event.eventType,
    encryptionFlags: event.encryptionFlags ? { ...event.encryptionFlags } : undefined,
  };
}

export function logEventSanitized(message: string, event: AgentEvent): void {
  const sanitized = sanitizeEventForLogging(event);
  logger.info({ event: sanitized }, message);
}

export function logValidationFailure(event: AgentEvent, reason: string): void {
  const sanitized = sanitizeEventForLogging(event);
  logger.warn({ event: sanitized, reason }, "Privacy-Guard validation failed, event discarded");
}
