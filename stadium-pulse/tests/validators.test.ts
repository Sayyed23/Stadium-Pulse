import { describe, it, expect } from "vitest";
import {
  assistantRequestSchema,
  copilotRequestSchema,
  alertAckSchema,
  createIncidentSchema,
  updateIncidentSchema,
  validateRequest
} from "../lib/validators";

describe("Validators Test Suite", () => {
  describe("validateRequest", () => {
    it("returns success: true and parsed data on valid input", () => {
      const result = validateRequest(alertAckSchema, { acknowledged_by: "user_1" });
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.acknowledged_by).toBe("user_1");
      }
    });

    it("returns success: false and error message on invalid input", () => {
      const result = validateRequest(alertAckSchema, {});
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toContain("acknowledged_by");
      }
    });
  });

  describe("assistantRequestSchema", () => {
    it("validates correct payload", () => {
      const valid = assistantRequestSchema.safeParse({ session_id: "sess_1", query: "Where is the bathroom?" });
      expect(valid.success).toBe(true);
    });
    
    it("fails when session_id is missing or empty", () => {
      const invalid = assistantRequestSchema.safeParse({ session_id: "", query: "Where is the bathroom?" });
      expect(invalid.success).toBe(false);
    });

    it("fails when query is too long", () => {
      const invalid = assistantRequestSchema.safeParse({ session_id: "sess_1", query: "a".repeat(2001) });
      expect(invalid.success).toBe(false);
    });
  });

  describe("copilotRequestSchema", () => {
    it("validates correct payload", () => {
      const valid = copilotRequestSchema.safeParse({ reporter_id: "rep_1", description: "Spill at gate 1" });
      expect(valid.success).toBe(true);
    });

    it("fails when description is empty", () => {
      const invalid = copilotRequestSchema.safeParse({ reporter_id: "rep_1", description: "" });
      expect(invalid.success).toBe(false);
    });
  });

  describe("createIncidentSchema", () => {
    it("validates correct payload", () => {
      const valid = createIncidentSchema.safeParse({
        category: "medical",
        zone_id: "zone_1",
        priority: "high",
        description: "Medical issue",
        created_by: "user_1"
      });
      expect(valid.success).toBe(true);
    });

    it("fails on invalid category enum", () => {
      const invalid = createIncidentSchema.safeParse({
        category: "invalid_category",
        zone_id: "zone_1",
        priority: "high",
        description: "Medical issue",
        created_by: "user_1"
      });
      expect(invalid.success).toBe(false);
    });
  });

  describe("updateIncidentSchema", () => {
    it("validates correct payload", () => {
      const valid = updateIncidentSchema.safeParse({ status: "dispatched" });
      expect(valid.success).toBe(true);
    });
  });
});
