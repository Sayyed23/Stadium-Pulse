import { defineConfig } from "vitest/config";
import path from "path";

process.env.SESSION_SECRET = "test_session_secret_for_vitest_runs_only";
process.env.GOOGLE_API_KEY = "[GCP_API_KEY]";
process.env.GOOGLE_CLOUD_CREDENTIALS = "{}";
process.env.GOOGLE_MAPS_EMBED_API_KEY = "[GCP_API_KEY]";
process.env.UPSTASH_REDIS_REST_URL = "https://fake.upstash.io";
process.env.UPSTASH_REDIS_REST_TOKEN = "fake_token";
process.env.DATABASE_URL = "postgresql://fake:fake@localhost:5432/fake";
process.env.N8N_WEBHOOK_URL = "https://fake.webhook.com/webhook";

export default defineConfig({
  test: {
    environment: "jsdom",
    alias: {
      "@": path.resolve(__dirname, "./"),
    },
    coverage: {
      provider: 'v8',
      include: ["lib/**", "app/api/**"],
      reporter: ['text', 'json', 'html'],
      thresholds: {
        lines: 40,
        functions: 40,
        branches: 30,
        statements: 40
      }
    }
  },
});
