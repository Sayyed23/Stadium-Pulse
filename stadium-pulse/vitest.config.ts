import { defineConfig } from "vitest/config";
import path from "path";

process.env.SESSION_SECRET = "test_session_secret_for_vitest_runs_only";

export default defineConfig({
  test: {
    environment: "jsdom",
    alias: {
      "@": path.resolve(__dirname, "./"),
    },
  },
});
