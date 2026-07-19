import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

// Hoist vi.mock before imports
vi.mock("../lib/db", () => {
  return {
    prisma: {
      zone: {
        findMany: vi.fn(),
        update: vi.fn(),
      },
      transportZone: {
        findMany: vi.fn(),
        update: vi.fn(),
      },
      wasteBin: {
        findMany: vi.fn(),
        update: vi.fn(),
      },
      alertLog: {
        create: vi.fn(),
      },
    },
  };
});

vi.mock("../lib/ai/client", () => {
  return {
    generateStructuredOutput: vi.fn(),
  };
});

// Since realtime checkThreshold is used
vi.mock("../lib/realtime", async (importOriginal) => {
  const mod = await importOriginal<typeof import("../lib/realtime")>();
  return {
    ...mod,
    simulateOccupancyChange: vi.fn((currentCount: number, capacity: number) => {
      // Mock simulateOccupancyChange to just return currentCount + 10 for predictability
      return Math.min(currentCount + 10, capacity);
    }),
    checkThreshold: vi.fn((id, name, count, cap, warn, crit) => {
      const pct = count / cap;
      if (pct >= crit) return { level: "critical", message: "critical" };
      if (pct >= warn) return { level: "warning", message: "warning" };
      return null;
    }),
  };
});

import { globalBroadcaster } from "../lib/broadcaster";
import { prisma } from "../lib/db";
import { generateStructuredOutput } from "../lib/ai/client";

describe("Broadcaster", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.clearAllMocks();

    // Default mocks
    (prisma.zone.findMany as any).mockResolvedValue([]);
    (prisma.transportZone.findMany as any).mockResolvedValue([]);
    (prisma.wasteBin.findMany as any).mockResolvedValue([]);
  });

  afterEach(() => {
    vi.clearAllTimers();
    vi.useRealTimers();
    // Force unregister all to stop the interval
    (globalBroadcaster as any).activeListeners = 0;
    (globalBroadcaster as any).stopBroadcasting();
    (globalBroadcaster as any).previousCounts.clear();
  });

  it("should register and unregister listeners, handling start/stop properly", () => {
    const listener = vi.fn();
    globalBroadcaster.register(listener);
    expect((globalBroadcaster as any).activeListeners).toBe(1);
    expect((globalBroadcaster as any).intervalId).not.toBeNull();

    globalBroadcaster.unregister(listener);
    expect((globalBroadcaster as any).activeListeners).toBe(0);
    expect((globalBroadcaster as any).intervalId).toBeNull();
  });

  it("should process standard zones and emit zone_update events", async () => {
    (prisma.zone.findMany as any).mockResolvedValue([
      { id: "z1", name: "Zone 1", currentCount: 50, capacity: 100, warningThreshold: 0.8, criticalThreshold: 0.9 },
      { id: "z2", name: "Overflow", currentCount: 0, capacity: 100, warningThreshold: 0.8, criticalThreshold: 0.9 }
    ]);
    (prisma.zone.update as any).mockResolvedValue({});

    const listener = vi.fn();
    globalBroadcaster.register(listener);
    
    // Fast forward to trigger interval
    await vi.runOnlyPendingTimersAsync();

    // Expect zone z1 to be updated (simulateOccupancyChange returns +10 -> 60)
    // z2 is ignored because currentCount is 0 and name includes 'Overflow'
    expect(prisma.zone.update).toHaveBeenCalledWith({
      where: { id: "z1" },
      data: { currentCount: 60 }
    });

    expect(listener).toHaveBeenCalledWith(expect.objectContaining({
      type: "zone_update",
      zone_id: "z1",
      current_count: 60
    }));

    globalBroadcaster.unregister(listener);
  });

  it("should process thresholds and trigger alerts with LLM report", async () => {
    // Current count 80, capacity 100. New count will be 90 -> 90% (critical threshold reached)
    (prisma.zone.findMany as any).mockResolvedValue([
      { id: "z1", name: "Zone 1", currentCount: 80, capacity: 100, warningThreshold: 0.8, criticalThreshold: 0.9 },
      { id: "z2", name: "Zone 2", currentCount: 10, capacity: 100, warningThreshold: 0.8, criticalThreshold: 0.9 } // overflow zone
    ]);
    (prisma.zone.update as any).mockResolvedValue({});
    (prisma.alertLog.create as any).mockResolvedValue({ id: "alert-123" });
    (generateStructuredOutput as any).mockResolvedValue({
      data: { summary: "AI Summary", recommended_action: "AI Action", severity: "critical" }
    });

    const listener = vi.fn();
    globalBroadcaster.register(listener);
    
    // Pre-populate previousCounts to simulate history
    const now = Date.now();
    (globalBroadcaster as any).previousCounts.set("z1", { counts: [70, 75, 80], lastUpdated: now });

    await vi.runOnlyPendingTimersAsync();

    expect(generateStructuredOutput).toHaveBeenCalled();
    expect(prisma.alertLog.create).toHaveBeenCalledWith(expect.objectContaining({
      data: expect.objectContaining({
        zoneId: "z1",
        generatedSummary: "AI Summary"
      })
    }));

    expect(listener).toHaveBeenCalledWith(expect.objectContaining({
      type: "alert",
      zone_id: "z1",
      alert_id: "alert-123"
    }));

    globalBroadcaster.unregister(listener);
  });

  it("should fallback when LLM report generation fails", async () => {
    (prisma.zone.findMany as any).mockResolvedValue([
      { id: "z1", name: "Zone 1", currentCount: 80, capacity: 100, warningThreshold: 0.8, criticalThreshold: 0.9 }
    ]);
    (prisma.zone.update as any).mockResolvedValue({});
    (prisma.alertLog.create as any).mockResolvedValue({ id: "alert-123" });
    (generateStructuredOutput as any).mockRejectedValue(new Error("LLM Failed"));

    const listener = vi.fn();
    globalBroadcaster.register(listener);
    
    await vi.runOnlyPendingTimersAsync();

    expect(prisma.alertLog.create).toHaveBeenCalledWith(expect.objectContaining({
      data: expect.objectContaining({
        generatedSummary: "Zone 1 is at 90% capacity."
      })
    }));

    globalBroadcaster.unregister(listener);
  });

  it("should handle failures to update zones without crashing", async () => {
    (prisma.zone.findMany as any).mockResolvedValue([
      { id: "z1", name: "Zone 1", currentCount: 50, capacity: 100, warningThreshold: 0.8, criticalThreshold: 0.9 }
    ]);
    (prisma.zone.update as any).mockRejectedValue(new Error("DB Failed"));

    const listener = vi.fn();
    globalBroadcaster.register(listener);
    
    await vi.runOnlyPendingTimersAsync();
    
    // Should not crash, and should not emit zone_update because update failed
    expect(listener).not.toHaveBeenCalledWith(expect.objectContaining({ type: "zone_update" }));

    globalBroadcaster.unregister(listener);
  });

  it("should handle failure in alertLog.create", async () => {
    (prisma.zone.findMany as any).mockResolvedValue([
      { id: "z1", name: "Zone 1", currentCount: 80, capacity: 100, warningThreshold: 0.8, criticalThreshold: 0.9 }
    ]);
    (prisma.zone.update as any).mockResolvedValue({});
    (generateStructuredOutput as any).mockResolvedValue({
      data: { summary: "AI Summary", recommended_action: "AI Action", severity: "critical" }
    });
    (prisma.alertLog.create as any).mockRejectedValue(new Error("DB Alert Failed"));

    const listener = vi.fn();
    globalBroadcaster.register(listener);
    
    await vi.runOnlyPendingTimersAsync();
    
    // Should not crash, but alert is not emitted
    expect(listener).not.toHaveBeenCalledWith(expect.objectContaining({ type: "alert" }));

    globalBroadcaster.unregister(listener);
  });

  it("should process transport zones", async () => {
    (prisma.transportZone.findMany as any).mockResolvedValue([
      { id: "tz1", name: "Parking", type: "parking", currentCount: 50, capacity: 100 }
    ]);
    (prisma.transportZone.update as any).mockResolvedValue({});

    const listener = vi.fn();
    globalBroadcaster.register(listener);
    
    await vi.runOnlyPendingTimersAsync();

    expect(prisma.transportZone.update).toHaveBeenCalledWith({
      where: { id: "tz1" },
      data: { currentCount: 60 }
    });

    expect(listener).toHaveBeenCalledWith(expect.objectContaining({
      type: "transport_update",
      zone_id: "tz1",
      current_count: 60
    }));

    globalBroadcaster.unregister(listener);
  });

  it("should handle failure to update transport zones", async () => {
    (prisma.transportZone.findMany as any).mockResolvedValue([
      { id: "tz1", name: "Parking", type: "parking", currentCount: 50, capacity: 100 }
    ]);
    (prisma.transportZone.update as any).mockRejectedValue(new Error("DB Failed"));

    const listener = vi.fn();
    globalBroadcaster.register(listener);
    
    await vi.runOnlyPendingTimersAsync();
    
    expect(listener).not.toHaveBeenCalledWith(expect.objectContaining({ type: "transport_update" }));

    globalBroadcaster.unregister(listener);
  });

  it("should process waste bins and trigger alerts when full", async () => {
    // Current fill 0.82. + drift of max 0.05 will cross 0.85 sometimes. We'll mock Math.random to make it cross.
    (prisma.wasteBin.findMany as any).mockResolvedValue([
      { id: "wb1", zoneId: "z1", fillPct: 0.82 }
    ]);
    (prisma.wasteBin.update as any).mockResolvedValue({});

    const cryptoSpy = vi.spyOn(globalThis.crypto, "getRandomValues").mockImplementation((arr: any) => {
      arr[0] = 3865470565; // ~0.9 * 4294967295, drift will be 0.045
      return arr;
    });

    const listener = vi.fn();
    globalBroadcaster.register(listener);
    
    await vi.runOnlyPendingTimersAsync();

    expect(prisma.wasteBin.update).toHaveBeenCalled();
    expect(listener).toHaveBeenCalledWith(expect.objectContaining({
      type: "waste_bin_alert",
      bin_id: "wb1"
    }));

    cryptoSpy.mockRestore();
    globalBroadcaster.unregister(listener);
  });

  it("should handle failure to update waste bins", async () => {
    (prisma.wasteBin.findMany as any).mockResolvedValue([
      { id: "wb1", zoneId: "z1", fillPct: 0.82 }
    ]);
    (prisma.wasteBin.update as any).mockRejectedValue(new Error("DB Failed"));
    const cryptoSpy = vi.spyOn(globalThis.crypto, "getRandomValues").mockImplementation((arr: any) => {
      arr[0] = 3865470565;
      return arr;
    });

    const listener = vi.fn();
    globalBroadcaster.register(listener);
    
    await vi.runOnlyPendingTimersAsync();
    
    expect(listener).not.toHaveBeenCalledWith(expect.objectContaining({ type: "waste_bin_alert" }));

    cryptoSpy.mockRestore();
    globalBroadcaster.unregister(listener);
  });

  it("should wrap waste bin fill level to 0.05 if it exceeds 1", async () => {
    (prisma.wasteBin.findMany as any).mockResolvedValue([
      { id: "wb1", zoneId: "z1", fillPct: 0.98 }
    ]);
    (prisma.wasteBin.update as any).mockResolvedValue({});
    const cryptoSpy = vi.spyOn(globalThis.crypto, "getRandomValues").mockImplementation((arr: any) => {
      arr[0] = 3865470565;
      return arr;
    }); // drift 0.045, total 1.025 -> 0.05

    const listener = vi.fn();
    globalBroadcaster.register(listener);
    
    await vi.runOnlyPendingTimersAsync();

    expect(prisma.wasteBin.update).toHaveBeenCalledWith(expect.objectContaining({
      where: { id: "wb1" },
      data: expect.objectContaining({ fillPct: 0.05 })
    }));

    cryptoSpy.mockRestore();
    globalBroadcaster.unregister(listener);
  });

  it("should evict old history counts", async () => {
    const listener = vi.fn();
    globalBroadcaster.register(listener);
    
    const now = Date.now();
    // Add old data
    (globalBroadcaster as any).previousCounts.set("z1", { counts: [10], lastUpdated: now - 70000 }); // Older than 60s
    (globalBroadcaster as any).previousCounts.set("z2", { counts: [20], lastUpdated: now - 10000 }); // Not older than 60s

    await vi.runOnlyPendingTimersAsync();

    expect((globalBroadcaster as any).previousCounts.has("z1")).toBe(false);
    expect((globalBroadcaster as any).previousCounts.has("z2")).toBe(true);

    globalBroadcaster.unregister(listener);
  });
  
  it("should not double run tick if one is already in flight", async () => {
    const listener = vi.fn();
    (globalBroadcaster as any).tickInFlight = true;
    globalBroadcaster.register(listener);
    
    await vi.runOnlyPendingTimersAsync();

    // Since tickInFlight is true, it returns early.
    // The interval shouldn't call tick().
    expect(prisma.zone.findMany).not.toHaveBeenCalled();
    
    globalBroadcaster.unregister(listener);
    (globalBroadcaster as any).tickInFlight = false;
  });

  it("should catch overall errors in tick", async () => {
    // If findMany fails, tick catches it
    (prisma.zone.findMany as any).mockRejectedValue(new Error("Global DB Failed"));
    
    const listener = vi.fn();
    globalBroadcaster.register(listener);
    
    await vi.runOnlyPendingTimersAsync();

    expect(listener).not.toHaveBeenCalled();

    globalBroadcaster.unregister(listener);
  });
});
