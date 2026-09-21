import { describe, it, expect, vi, beforeEach } from "vitest";
import { authenticateApiRequest } from "@/lib/auth/api-auth-middleware";
import * as apiKeysModule from "@/lib/auth/api-keys";
import * as sessionModule from "@/lib/auth/session";
import { Role } from "@prisma/client";

describe("lib/auth/api-auth-middleware", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  const sampleSession: sessionModule.SessionPayload = {
    userId: "usr_100",
    name: "API Client",
    email: "client@api.com",
    company: "Client Corp",
    role: Role.CLIENTE,
    status: "ATIVO",
  };

  it("should return null when no auth headers are provided", async () => {
    const req = new Request("http://localhost:3000/api/v1/incidents");
    const result = await authenticateApiRequest(req);
    expect(result).toBeNull();
  });

  it("should authenticate using x-api-key header", async () => {
    vi.spyOn(apiKeysModule, "verifyAndConsumeApiKey").mockResolvedValue(sampleSession);

    const req = new Request("http://localhost:3000/api/v1/incidents", {
      headers: { "x-api-key": "lti_live_secret_123" },
    });

    const result = await authenticateApiRequest(req);
    expect(result).toEqual(sampleSession);
    expect(apiKeysModule.verifyAndConsumeApiKey).toHaveBeenCalledWith("lti_live_secret_123");
  });

  it("should authenticate using Authorization: Bearer with API Key", async () => {
    vi.spyOn(apiKeysModule, "verifyAndConsumeApiKey").mockResolvedValue(sampleSession);

    const req = new Request("http://localhost:3000/api/v1/incidents", {
      headers: { authorization: "Bearer lti_live_secret_abc" },
    });

    const result = await authenticateApiRequest(req);
    expect(result).toEqual(sampleSession);
    expect(apiKeysModule.verifyAndConsumeApiKey).toHaveBeenCalledWith("lti_live_secret_abc");
  });

  it("should authenticate using Authorization: Bearer with valid JWT token", async () => {
    vi.spyOn(sessionModule, "verifySessionToken").mockResolvedValue(sampleSession);

    const req = new Request("http://localhost:3000/api/v1/incidents", {
      headers: { authorization: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." },
    });

    const result = await authenticateApiRequest(req);
    expect(result).toEqual(sampleSession);
    expect(sessionModule.verifySessionToken).toHaveBeenCalled();
  });

  it("should return null if JWT token is invalid or user is inactive", async () => {
    vi.spyOn(sessionModule, "verifySessionToken").mockResolvedValue({
      ...sampleSession,
      status: "INATIVO" as any,
    });

    const req = new Request("http://localhost:3000/api/v1/incidents", {
      headers: { authorization: "Bearer invalid_token" },
    });

    const result = await authenticateApiRequest(req);
    expect(result).toBeNull();
  });
});
