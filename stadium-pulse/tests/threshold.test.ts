import { describe, it, expect } from "vitest";
import { checkThreshold } from "../lib/realtime";

describe("Threshold Logic", () => {
  it("should trigger warning alert when passing warning threshold", () => {
    const breach = checkThreshold("z1", "Zone 1", 860, 1000, 0.85, 0.95);
    expect(breach).not.toBeNull();
    expect(breach?.level).toBe("warning");
  });

  it("should trigger critical alert when passing critical threshold", () => {
    const breach = checkThreshold("z3", "Zone 3", 960, 1000, 0.85, 0.95);
    expect(breach).not.toBeNull();
    expect(breach?.level).toBe("critical");
  });

  it("should not trigger if within cooldown period", () => {
    // Call once to set cooldown
    checkThreshold("z2", "Zone 2", 860, 1000, 0.85, 0.95);
    // Call again immediately
    const breach2 = checkThreshold("z2", "Zone 2", 870, 1000, 0.85, 0.95);
    expect(breach2).toBeNull(); // Should be blocked by cooldown
  });
});
