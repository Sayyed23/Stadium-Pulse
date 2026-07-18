import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { generateStructuredOutput } from "@/lib/ai/client";
import { situationReportPrompt, situationReportUserPrompt } from "@/lib/ai/prompts";
import {
  encodeSSE,
  sseHeaders,
  simulateOccupancyChange,
  checkThreshold,
  type ZoneUpdate,
  type AlertEvent,
} from "@/lib/realtime";

/**
 * GET /api/zones/stream  (SSE)
 *
 * Single SSE endpoint consumed by BOTH:
 * - (ops)/dashboard → heatmap + situation feed
 * - (fan)/transport → shuttle/parking nudge cards
 *
 * Emits zone_update events every few seconds and alert events on threshold crossings.
 */

import { globalBroadcaster } from "@/lib/broadcaster";
export const dynamic = "force-dynamic";

export async function GET() {
  const encoder = new TextEncoder();

  let listener: ((event: any) => void) | undefined;
  let registered = false;
  const cleanup = () => {
    if (!registered || !listener) return;
    registered = false;
    globalBroadcaster.unregister(listener);
  };

  // Create stream using the EventBroadcaster to prevent DB connection pool exhaustion
  const stream = new ReadableStream({
    start(controller) {
      listener = (event: any) => {
        try {
          controller.enqueue(encoder.encode(encodeSSE(event)));
        } catch {
          cleanup();
        }
      };

      // Register connection to the global single background loop
      globalBroadcaster.register(listener);
      registered = true;
    },

    cancel() {
      // Cleanup listener when client disconnects
      cleanup();
      console.log("SSE client disconnected from /api/zones/stream");
    },
  });

  return new NextResponse(stream, { headers: sseHeaders() });
}
