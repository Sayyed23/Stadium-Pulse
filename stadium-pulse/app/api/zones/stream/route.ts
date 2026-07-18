import { encodeSSE, sseHeaders } from "@/lib/realtime";
import { globalBroadcaster } from "@/lib/broadcaster";

export const dynamic = "force-dynamic";

export async function GET() {
  const encoder = new TextEncoder();

  type SSEBroadcastEvent = { type: string; data: unknown };
  let listener: ((event: SSEBroadcastEvent) => void) | undefined;
  let registered = false;
  const cleanup = () => {
    if (!registered || !listener) return;
    registered = false;
    globalBroadcaster.unregister(listener);
  };

  // Create stream using the EventBroadcaster to prevent DB connection pool exhaustion
  const stream = new ReadableStream({
    start(controller) {
      listener = (event: SSEBroadcastEvent) => {
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
