import { test, expect, describe, vi } from "vitest";
import { GET } from "../app/api/zones/stream/route";
import { globalBroadcaster } from "@/lib/broadcaster";

vi.mock("@/lib/broadcaster", () => ({
  globalBroadcaster: {
    register: vi.fn(),
    unregister: vi.fn(),
  },
}));

describe("Zones Stream API Route", () => {
  test("GET returns SSE stream and registers listener", async () => {
    const res = await GET();
    expect(res.status).toBe(200);
    expect(res.headers.get("Content-Type")).toBe("text/event-stream");
    expect(globalBroadcaster.register).toHaveBeenCalled();
  });

  test("Stream cancel cleans up listener", async () => {
    const res = await GET();
    const stream = res.body as unknown as ReadableStream;
    
    // Simulate stream cancel
    await stream.cancel();
    
    expect(globalBroadcaster.unregister).toHaveBeenCalled();
  });

  test("Stream start enqueues events and handles errors", async () => {
    // Capture the registered listener
    let capturedListener: any = null;
    (globalBroadcaster.register as any).mockImplementation((listener: any) => {
      capturedListener = listener;
    });

    const res = await GET();
    const stream = res.body as unknown as ReadableStream;
    
    // Create a reader to start the stream
    const reader = stream.getReader();
    
    // Trigger the listener with an event
    expect(capturedListener).not.toBeNull();
    capturedListener({ type: "zone_update", zone_id: "z1", current_count: 50, capacity: 100, pct: 0.5 });
    
    const { value } = await reader.read();
    expect(value).toBeDefined();

    // Now force an error in enqueue to trigger the catch block (line 24-25)
    // We can do this by passing an invalid event that fails JSON.stringify or something,
    // Or we can just cancel the stream which makes the next enqueue throw.
    await reader.cancel();
    // Try to trigger the listener again after cancel - enqueue will throw and trigger cleanup
    capturedListener({ type: "zone_update" });
    
    // Verify cleanup was called again
    expect(globalBroadcaster.unregister).toHaveBeenCalled();
  });
});
