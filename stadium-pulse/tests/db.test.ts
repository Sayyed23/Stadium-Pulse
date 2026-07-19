import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

describe("Database client", () => {
  beforeEach(() => {
    vi.resetModules();
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("initializes PrismaClient in development mode", async () => {
    vi.stubEnv("NODE_ENV", "development");
    const { prisma } = await import("../lib/db");
    expect(prisma).toBeDefined();
  });

  it("initializes PrismaClient in production mode", async () => {
    vi.stubEnv("NODE_ENV", "production");
    const { prisma } = await import("../lib/db");
    expect(prisma).toBeDefined();
  });
});
