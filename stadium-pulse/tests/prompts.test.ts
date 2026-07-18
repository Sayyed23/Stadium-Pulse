import { describe, it, expect } from "vitest";
import {
  navigationAssistantPrompt,
  situationReportPrompt,
  situationReportUserPrompt,
  incidentCopilotPrompt,
  languageDetectionPrompt,
} from "../lib/ai/prompts";

describe("AI Prompt Templates", () => {
  it("navigationAssistantPrompt should contain venueFacts", () => {
    const venueFacts = "Gate 1 is wheelchair accessible.";
    const prompt = navigationAssistantPrompt(venueFacts);
    expect(prompt).toContain("You are a stadium navigation assistant");
    expect(prompt).toContain(venueFacts);
  });

  it("situationReportPrompt should return static JSON schema instructions", () => {
    const prompt = situationReportPrompt();
    expect(prompt).toContain("You are a stadium operations analyst");
    expect(prompt).toContain("affected_zones");
  });

  it("situationReportUserPrompt should correctly format zone details", () => {
    const data = {
      zoneId: "zone_a",
      zoneName: "Zone A",
      capacity: 5000,
      currentCount: 4500,
      occupancyPct: 0.9,
      trendPctPerMin: 5.5,
      nearbyOverflowOptions: ["Zone B", "Zone C"],
    };
    const prompt = situationReportUserPrompt(data);
    expect(prompt).toContain('"zone_id": "zone_a"');
    expect(prompt).toContain('"occupancy_pct": 90.0%');
    expect(prompt).toContain('"trend_pct_per_min": +5.5%/min');
    expect(prompt).toContain('"nearby_overflow_options": ["Zone B","Zone C"]');
  });

  it("incidentCopilotPrompt should embed available zones and volunteers", () => {
    const zones = "zone_a, zone_b";
    const volunteers = "vol_1, vol_2";
    const prompt = incidentCopilotPrompt(zones, volunteers);
    expect(prompt).toContain("You are an incident copilot");
    expect(prompt).toContain(zones);
    expect(prompt).toContain(volunteers);
  });

  it("languageDetectionPrompt should return ISO code instruction", () => {
    const prompt = languageDetectionPrompt();
    expect(prompt).toContain('Return ONLY the ISO 639-1 code');
    expect(prompt).toContain('{ "language": "en" }');
  });
});
