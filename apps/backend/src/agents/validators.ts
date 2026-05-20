import { z } from 'zod';

export const agentEventSchema = z.object({
  id: z.string().uuid(),
  timestamp: z.string().datetime(),
  traceId: z.string(),
  sourceDeviceId: z.string(),
  sourceAgent: z.string(),
  targetAudience: z.enum(['HUB', 'PARTNER', 'ALL']),
  action: z.string(),
  payload: z.record(z.unknown()),
  signature: z.string(),
});

export type AgentEventInput = z.infer<typeof agentEventSchema>;

export function validateAgentEvent(data: unknown) {
  return agentEventSchema.safeParse(data);
}
