import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { generateStructuredOutput } from "@/lib/ai/client";
import { navigationAssistantPrompt } from "@/lib/ai/prompts";
import { verifyNavigationResponse } from "@/lib/ai/guardrails";
import { assistantRequestSchema, validateRequest } from "@/lib/validators";
import {
  getAssistantLimiter,
  checkRateLimit,
  getCached,
  setCache,
} from "@/lib/rate-limit";

/**
 * POST /api/assistant
 *
 * Fan navigation RAG endpoint.
 * 1. Validate input (Zod)
 * 2. Rate limit check (Redis)
 * 3. Fetch venue KB facts from Postgres
 * 4. Call LLM with grounding-only system prompt
 * 5. Post-process: entity verification (guardrails)
 * 6. Persist ChatLog
 * 7. Return grounded response
 */

interface AssistantLLMResponse {
  answer: string;
  route: string[];
  estimated_walk_time_min: number;
  grounded_sources: string[];
  needs_followup: boolean;
  followup_question: string | null;
}

export async function POST(request: NextRequest) {
  try {
    // 1. Parse and validate input
    const body = await request.json();
    const validation = validateRequest(assistantRequestSchema, body);

    if (!validation.success) {
      return NextResponse.json(
        { error: "Validation failed", details: validation.error },
        { status: 400 }
      );
    }

    const { session_id, query, current_zone_id } = validation.data;

    // 2. Rate limit check
    const limiter = getAssistantLimiter();
    const rateCheck = await checkRateLimit(limiter, session_id);
    if (!rateCheck.allowed) {
      return NextResponse.json(
        {
          error: "Rate limit exceeded",
          retry_after: rateCheck.retryAfter,
        },
        { status: 429 }
      );
    }

    // 3. Check cache for repeated queries
    const cacheKey = `assistant:${query.toLowerCase().trim().slice(0, 100)}:${current_zone_id || "any"}`;
    const cached = await getCached<AssistantLLMResponse>(cacheKey);
    if (cached) {
      return NextResponse.json({
        ...cached,
        detected_language: "cached",
        cached: true,
      });
    }

    // 4. Fetch venue KB facts from Postgres
    const zones = await prisma.zone.findMany({
      include: {
        amenities: true,
        volunteers: {
          select: { id: true, name: true, availability: true },
        },
      },
    });

    // Build structured facts for the LLM
    const venueFacts = JSON.stringify(
      zones.map((zone) => ({
        zone_id: zone.id,
        zone_name: zone.name,
        capacity: zone.capacity,
        current_occupancy_pct: Math.round((zone.currentCount / zone.capacity) * 100),
        amenities: zone.amenities.map((a) => ({
          amenity_id: a.id,
          name: a.name,
          type: a.type,
          accessibility: a.accessibilityFlags,
          status: a.status,
        })),
        section_metadata: zone.sectionMetadata,
      })),
      null,
      2
    );

    // 5. Call LLM with grounding-only system prompt
    const systemPrompt = navigationAssistantPrompt(venueFacts);
    const userPrompt = `<user_input>${query}</user_input>${
      current_zone_id ? `\nUser's current zone: ${current_zone_id}` : ""
    }`;

    const { data: llmResponse, meta } =
      await generateStructuredOutput<AssistantLLMResponse>(
        systemPrompt,
        userPrompt
      );

    // 6. Post-process: entity verification (guardrails)
    const grounding = await verifyNavigationResponse({
      answer: llmResponse.answer,
      route: llmResponse.route || [],
      grounded_sources: llmResponse.grounded_sources || [],
    });

    // 7. Detect language from the response (simple heuristic)
    const detectedLanguage = detectLanguage(query);

    // 8. Persist ChatLog
    await prisma.chatLog.create({
      data: {
        sessionId: session_id,
        query,
        detectedLanguage,
        response: llmResponse.answer,
        groundedSources: grounding.verifiedSources,
        flaggedHallucination: grounding.hasHallucination,
      },
    });

    // 9. Cache the response for repeated queries (5 min TTL)
    await setCache(cacheKey, llmResponse, 300);

    // 10. Return response
    return NextResponse.json({
      detected_language: detectedLanguage,
      answer: llmResponse.answer,
      route: llmResponse.route || [],
      estimated_walk_time_min: llmResponse.estimated_walk_time_min || 0,
      grounded_sources: grounding.verifiedSources,
      needs_followup: llmResponse.needs_followup || false,
      followup_question: llmResponse.followup_question || null,
      grounding_check: {
        verified: grounding.verifiedSources.length,
        hallucinations: grounding.hallucinations,
      },
      meta: {
        model: meta.model,
        latency_ms: meta.latencyMs,
        tokens: meta.tokenCount.total,
      },
    });
  } catch (error) {
    console.error("Assistant API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * Simple language detection based on Unicode script ranges.
 * In production, use a proper language detection library or the LLM.
 */
function detectLanguage(text: string): string {
  // Devanagari script (Hindi, Marathi)
  if (/[\u0900-\u097F]/.test(text)) {
    // Check for Marathi-specific characters/words
    if (/[\u0960\u0961]/.test(text) || /आहे|कुठे|जवळ/.test(text)) {
      return "mr";
    }
    return "hi";
  }

  // Tamil
  if (/[\u0B80-\u0BFF]/.test(text)) return "ta";

  // Telugu
  if (/[\u0C00-\u0C7F]/.test(text)) return "te";

  // Bengali
  if (/[\u0980-\u09FF]/.test(text)) return "bn";

  return "en";
}
