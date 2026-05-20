export type AgentEventType =
  | "INITIATE_GROUP_BUY_POOL"
  | "STOCK_ALERT"
  | "PRICE_NEGOTIATION"
  | "PROMOTION_DRAFT"
  | "ENCRYPTION_STATUS";

export interface AgentEvent {
  timestamp: string;
  traceId: string;
  from: string;
  to: string;
  action: AgentEventType;
  payload: Record<string, unknown>;
  signature: string;
}
