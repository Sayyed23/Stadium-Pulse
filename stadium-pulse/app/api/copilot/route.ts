import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { generateStructuredOutput } from "@/lib/ai/client";
import { incidentCopilotPrompt } from "@/lib/ai/prompts";
import { copilotRequestSchema, validateRequest } from "@/lib/validators";
import { getCopilotLimiter, checkRateLimit } from "@/lib/rate-limit";

/**
 * POST /api/copilot
 *
 * Volunteer incident copilot — free-text → structured ticket + dispatch.
 * Human-in-the-loop: returns a draft; nothing is created until confirmed.
 */

interface CopilotLLMResponse {
  draft_incident: {
    category: string;
    zone_id: string | null;
    priority: string;
    description: string;
  };
  suggested_volunteer: {
    id: string;
    name: string;
    language: string;
    zone_assignment: string;
  } | null;
  dispatch_message_localized: string;
  requires_confirmation: boolean;
  needs_followup: boolean;
  followup_question: string | null;
}

export async function POST(request: NextRequest) {
  try {
    // 1. Parse and validate
    const body = await request.json();
    const validation = validateRequest(copilotRequestSchema, body);

    if (!validation.success) {
      return NextResponse.json(
        { error: "Validation failed", details: validation.error },
        { status: 400 }
      );
    }

    const { reporter_id, description, followup_response } = validation.data;

    // 2. Rate limit check
    const limiter = getCopilotLimiter();
    const rateCheck = await checkRateLimit(limiter, reporter_id);
    if (!rateCheck.allowed) {
      return NextResponse.json(
        { error: "Rate limit exceeded", retry_after: rateCheck.retryAfter },
        { status: 429 }
      );
    }

    // 3. Fetch available zones and volunteers for the LLM context
    const zones = await prisma.zone.findMany({
      select: { id: true, name: true },
    });

    const volunteers = await prisma.volunteer.findMany({
      where: { availability: "available", role: "volunteer" },
      select: {
        id: true,
        name: true,
        preferredLanguage: true,
        zoneAssignmentId: true,
        zoneAssignment: { select: { name: true } },
      },
    });

    const availableZones = JSON.stringify(
      zones.map((z) => ({ id: z.id, name: z.name })),
      null,
      2
    );

    const availableVolunteers = JSON.stringify(
      volunteers.map((v) => ({
        id: v.id,
        name: v.name,
        preferred_language: v.preferredLanguage,
        zone_assignment: v.zoneAssignmentId,
        zone_name: v.zoneAssignment.name,
      })),
      null,
      2
    );

    // 4. Build prompt and call LLM
    const systemPrompt = incidentCopilotPrompt(
      availableZones,
      availableVolunteers
    );

    const userPrompt = followup_response
      ? `<user_input>Original report: ${description}\nFollow-up answer: ${followup_response}</user_input>`
      : `<user_input>${description}</user_input>`;

    const { data: llmResponse, meta } =
      await generateStructuredOutput<CopilotLLMResponse>(
        systemPrompt,
        userPrompt
      );

    // 5. Return the draft (nothing created until confirmed)
    return NextResponse.json({
      ...llmResponse,
      requires_confirmation: true,
      meta: {
        model: meta.model,
        latency_ms: meta.latencyMs,
        tokens: meta.tokenCount.total,
      },
    });
  } catch (error) {
    console.error("Copilot API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
