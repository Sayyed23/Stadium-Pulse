import { z } from 'zod';

export const AssistantRequestSchema = z.object({
  session_id: z.string().min(1),
  query: z.string().min(1).max(500),
  current_zone_id: z.string().min(1)
});

export const CopilotRequestSchema = z.object({
  reporter_id: z.string().min(1),
  description: z.string().min(1).max(1000)
});

export const IncidentConfirmationSchema = z.object({
  category: z.enum(['medical', 'lost_person', 'security', 'facilities', 'other']),
  zone_id: z.string().min(1),
  priority: z.enum(['low', 'medium', 'high', 'critical']),
  description: z.string().min(1),
  assigned_volunteer_id: z.string().nullable(),
  dispatch_message: z.string().min(1)
});

export const AcknowledgeAlertSchema = z.object({
  alert_id: z.string().uuid(),
  operator_id: z.string().min(1)
});
