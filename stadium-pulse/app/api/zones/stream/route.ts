import { NextResponse } from "next/server";
import { encodeSSE, sseHeaders, type SSEEvent } from "@/lib/realtime";
import { globalBroadcaster } from "@/lib/broadcaster";

export const dynamic = "force-dynamic";

export async function GET() {
  const encoder = new TextEncoder();

  let listener: ((event: SSEEvent) => void) | undefined;
  let registered = false;
  const cleanup = () => {
    if (!registered || !listener) return;
    registered = false;
    globalBroadcaster.unregister(listener);
  };

  // Create stream using the EventBroadcaster to prevent DB connection pool exhaustion
  const stream = new ReadableStream({
    start(controller) {
      listener = (event: SSEEvent) => {
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
      console.info("SSE client disconnected from /api/zones/stream");
    },
  });

  return new NextResponse(stream, { headers: sseHeaders() });
}
