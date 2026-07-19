import {
  GoogleGenerativeAI,
  GenerateContentResult,
  type GenerationConfig,
} from "@google/generative-ai";

// ─── Types ──────────────────────────────────────────────────

export interface LLMResponse {
  text: string;
  tokenCount: {
    prompt: number;
    completion: number;
    total: number;
  };
  latencyMs: number;
  model: string;
}

export interface LLMOptions {
  /** Override the default model tier */
  model?: "flash" | "pro";
  /** Temperature (0–2). Lower = more deterministic. */
  temperature?: number;
  /** Max output tokens */
  maxOutputTokens?: number;
  /** JSON mode: instruct model to return valid JSON */
  jsonMode?: boolean;
}

// ─── Model Config ───────────────────────────────────────────

const MODEL_MAP = {
  flash: "gemini-2.5-flash-preview-05-20",
  pro: "gemini-2.5-pro-preview-06-05",
} as const;

const DEFAULT_MODEL: keyof typeof MODEL_MAP = "flash";

// ─── Singleton Client ───────────────────────────────────────

let genAI: GoogleGenerativeAI | null = null;

function getClient(): GoogleGenerativeAI {
  if (!genAI) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error(
        "GEMINI_API_KEY is not set. Add it to your .env.local file."
      );
    }
    genAI = new GoogleGenerativeAI(apiKey);
  }
  return genAI;
}

// ─── Core Generation Function ───────────────────────────────

/**
 * Provider-agnostic text generation.
 * Uses Gemini Flash by default; escalates to Pro for complex reasoning.
 */
export async function generateText(
  systemPrompt: string,
  userPrompt: string,
  options: LLMOptions = {}
): Promise<LLMResponse> {
  const client = getClient();
  const tier = options.model ?? DEFAULT_MODEL;
  const modelName = MODEL_MAP[tier];

  const generationConfig: GenerationConfig = {
    temperature: options.temperature ?? 0.3,
    maxOutputTokens: options.maxOutputTokens ?? 2048,
  };

  if (options.jsonMode) {
    generationConfig.responseMimeType = "application/json";
  }

  const model = client.getGenerativeModel({
    model: modelName,
    systemInstruction: systemPrompt,
    generationConfig,
  });

  const startTime = Date.now();

  const result: GenerateContentResult = await model.generateContent(userPrompt);

  const latencyMs = Date.now() - startTime;
  const response = result.response;
  const text = response.text();

  // Token counting from usage metadata
  const usage = response.usageMetadata;
  const tokenCount = {
    prompt: usage?.promptTokenCount ?? 0,
    completion: usage?.candidatesTokenCount ?? 0,
    total: usage?.totalTokenCount ?? 0,
  };

  // Structured logging for observability
  console.info(
    JSON.stringify({
      event: "llm_call",
      model: modelName,
      tier,
      latencyMs,
      tokenCount,
      timestamp: new Date().toISOString(),
    })
  );

  return { text, tokenCount, latencyMs, model: modelName };
}

/**
 * Generate structured JSON output from the LLM.
 * Parses the response text as JSON and returns the typed result.
 */
export async function generateStructuredOutput<T>(
  systemPrompt: string,
  userPrompt: string,
  options: LLMOptions = {}
): Promise<{ data: T; meta: Omit<LLMResponse, "text"> }> {
  const response = await generateText(systemPrompt, userPrompt, {
    ...options,
    jsonMode: true,
    temperature: options.temperature ?? 0.1, // Lower temp for structured output
  });

  const data = JSON.parse(response.text) as T;

  return {
    data,
    meta: {
      tokenCount: response.tokenCount,
      latencyMs: response.latencyMs,
      model: response.model,
    },
  };
}
