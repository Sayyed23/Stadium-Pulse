import { z } from "zod";

/**
 * StadiumPulse AI — Zod Validation Schemas
 *
 * Input validation on every API route. No unvalidated payload reaches Prisma.
 */

// ─── POST /api/assistant ────────────────────────────────────

export const assistantRequestSchema = z.object({
  session_id: z
    .string()
    .min(1, "session_id is required")
    .max(100, "session_id too long"),
  query: z
    .string()
    .min(1, "Query cannot be empty")
    .max(2000, "Query too long (max 2000 chars)"),
  current_zone_id: z.string().optional(),
});

export type AssistantRequest = z.infer<typeof assistantRequestSchema>;

// ─── POST /api/copilot ──────────────────────────────────────

export const copilotRequestSchema = z.object({
  reporter_id: z
    .string()
    .min(1, "reporter_id is required"),
  description: z
    .string()
    .min(1, "Description cannot be empty")
    .max(5000, "Description too long"),
  followup_response: z.string().optional(),
});

export type CopilotRequest = z.infer<typeof copilotRequestSchema>;

// ─── POST /api/alerts/[id]/ack ──────────────────────────────

export const alertAckSchema = z.object({
  acknowledged_by: z
    .string()
    .min(1, "acknowledged_by is required"),
});

export type AlertAckRequest = z.infer<typeof alertAckSchema>;

// ─── POST /api/incidents ────────────────────────────────────

export const createIncidentSchema = z.object({
  category: z.enum(["medical", "lost_person", "security", "facilities", "other"]),
  zone_id: z.string().min(1),
  priority: z.enum(["low", "medium", "high", "critical"]),
  description: z.string().min(1).max(5000),
  created_by: z.string().min(1),
  assigned_volunteer_id: z.string().optional(),
});

export type CreateIncidentRequest = z.infer<typeof createIncidentSchema>;

// ─── PATCH /api/incidents/[id] ──────────────────────────────

export const updateIncidentSchema = z.object({
  status: z.enum(["reported", "dispatched", "resolved"]).optional(),
  assigned_volunteer_id: z.string().optional(),
  resolved_at: z.string().datetime().optional(),
});

export type UpdateIncidentRequest = z.infer<typeof updateIncidentSchema>;

// ─── Shared Helpers ─────────────────────────────────────────

/**
 * Validate request body against a Zod schema.
 * Returns a typed result or throws a structured error.
 */
export function validateRequest<T>(
  schema: z.ZodSchema<T>,
  data: unknown
): { success: true; data: T } | { success: false; error: string } {
  const result = schema.safeParse(data);
  if (!result.success) {
    const errors = result.error.issues
      .map((issue) => `${issue.path.join(".")}: ${issue.message}`)
      .join("; ");
    return { success: false, error: errors };
  }
  return { success: true, data: result.data };
}
