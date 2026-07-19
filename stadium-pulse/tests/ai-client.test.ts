import { test, expect, describe, vi, beforeEach } from "vitest";
import { generateText, generateStructuredOutput } from "../lib/ai/client";
import { GoogleGenerativeAI } from "@google/generative-ai";

vi.mock("@google/generative-ai", () => {
  const mockGenerateContent = vi.fn().mockResolvedValue({
    response: {
      text: () => '{"mock": "data"}',
      usageMetadata: {
        promptTokenCount: 10,
        candidatesTokenCount: 20,
        totalTokenCount: 30,
      }
    }
  });

  return {
    GoogleGenerativeAI: class {
      getGenerativeModel() {
        return {
          generateContent: mockGenerateContent
        };
      }
    }
  };
});

describe("AI Client", () => {
  beforeEach(() => {
    process.env.GEMINI_API_KEY = "fake_key";
  });

  test("generateText returns expected structure", async () => {
    const res = await generateText("system", "user");
    expect(res.text).toBe('{"mock": "data"}');
    expect(res.tokenCount.total).toBe(30);
  });

  test("generateStructuredOutput returns parsed JSON", async () => {
    const res = await generateStructuredOutput("system", "user");
    expect(res.data).toEqual({ mock: "data" });
    expect(res.meta.tokenCount.total).toBe(30);
  });

  test("throws if API key is missing", async () => {
    const oldKey = process.env.GEMINI_API_KEY;
    delete process.env.GEMINI_API_KEY;
    vi.resetModules(); // Reset singleton

    const { generateText } = await import("../lib/ai/client");
    await expect(generateText("system", "user")).rejects.toThrow("GEMINI_API_KEY is not set.");
    
    process.env.GEMINI_API_KEY = oldKey;
  });
});
