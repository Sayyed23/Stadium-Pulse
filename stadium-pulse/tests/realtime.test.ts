import { describe, it, expect, vi, beforeEach } from "vitest";
import { encodeSSE, checkThreshold, isInCooldown, setCooldown, simulateOccupancyChange } from "../lib/realtime";

describe("Realtime Utilities", () => {
  beforeEach(() => {
    // Reset any required state if needed, though cooldown uses a module-level map
  });

  describe("encodeSSE", () => {
    it("should format event correctly with event and data fields", () => {
      const payload = {
        type: "zone_update" as const,
        zone_id: "123",
        zone_name: "Zone 1",
        current_count: 10,
        capacity: 100,
        pct: 0.1
      };
      const result = encodeSSE(payload);
      expect(result).toBe(`event: zone_update\ndata: ${JSON.stringify(payload)}\n\n`);
    });
  });

  describe("checkThreshold", () => {
    it("returns null if neither threshold is crossed", () => {
      const res = checkThreshold("z1", "Zone 1", 50, 100, 0.8, 0.95);
      expect(res).toBeNull();
    });

    it("returns warning if only warning threshold is crossed", () => {
      const res = checkThreshold("z2", "Zone 2", 85, 100, 0.8, 0.95);
      expect(res?.level).toBe("warning");
    });

    it("returns critical if critical threshold is crossed", () => {
      const res = checkThreshold("z3", "Zone 3", 96, 100, 0.8, 0.95);
      expect(res?.level).toBe("critical");
    });

    it("returns null if zone is in cooldown", () => {
      setCooldown("z4"); // Simulate recent alert
      const res = checkThreshold("z4", "Zone 4", 96, 100, 0.8, 0.95);
      expect(res).toBeNull();
    });
  });
  
  describe("simulateOccupancyChange", () => {
    it("returns a number within bounds for pct < 0.5", () => {
      const result = simulateOccupancyChange(40, 100);
      expect(result).toBeGreaterThanOrEqual(0);
      expect(result).toBeLessThanOrEqual(100);
    });
    
    it("returns a number within bounds for pct < 0.8", () => {
      const result = simulateOccupancyChange(60, 100);
      expect(result).toBeGreaterThanOrEqual(0);
      expect(result).toBeLessThanOrEqual(100);
    });

    it("returns a number within bounds for pct < 0.95", () => {
      const result = simulateOccupancyChange(90, 100);
      expect(result).toBeGreaterThanOrEqual(0);
      expect(result).toBeLessThanOrEqual(100);
    });

    it("returns a number within bounds for pct >= 0.95", () => {
      const result = simulateOccupancyChange(98, 100);
      expect(result).toBeGreaterThanOrEqual(0);
      expect(result).toBeLessThanOrEqual(100);
    });
  });
});
