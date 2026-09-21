import { describe, it, expect, beforeEach } from "vitest";
import {
  signSession,
  verifySessionToken,
  createSession,
  getSession,
  deleteSession,
  requireSession,
  SessionPayload,
} from "@/lib/auth/session";
import { Role } from "@prisma/client";

describe("lib/auth/session", () => {
  const samplePayload: SessionPayload = {
    userId: "usr_123456",
    name: "Luiz Felipe",
    email: "suporte@ltisistemas.com",
    company: "LTI Sistemas",
    contractNumber: "CTR-01",
    systemUrl: "https://app.ltisistemas.com",
    status: "ATIVO",
    role: Role.SUPORTE,
  };

  it("should sign and verify session JWT token", async () => {
    const token = await signSession(samplePayload);
    expect(token).toBeDefined();
    expect(typeof token).toBe("string");

    const decoded = await verifySessionToken(token);
    expect(decoded).not.toBeNull();
    expect(decoded?.userId).toBe(samplePayload.userId);
    expect(decoded?.email).toBe(samplePayload.email);
    expect(decoded?.role).toBe(Role.SUPORTE);
    expect(decoded?.company).toBe("LTI Sistemas");
    expect(decoded?.contractNumber).toBe("CTR-01");
    expect(decoded?.systemUrl).toBe("https://app.ltisistemas.com");
    expect(decoded?.status).toBe("ATIVO");
  });

  it("should return null when verifying invalid or tampered token", async () => {
    const invalid = await verifySessionToken("invalid.jwt.token.string");
    expect(invalid).toBeNull();
  });

  it("should create, read and delete session cookies", async () => {
    await createSession(samplePayload);

    const activeSession = await getSession();
    expect(activeSession).not.toBeNull();
    expect(activeSession?.email).toBe(samplePayload.email);

    await deleteSession();

    const clearedSession = await getSession();
    expect(clearedSession).toBeNull();
  });

  it("should enforce requireSession for authenticated users", async () => {
    await createSession(samplePayload);

    const session = await requireSession();
    expect(session.userId).toBe(samplePayload.userId);

    const supportSession = await requireSession([Role.SUPORTE]);
    expect(supportSession.role).toBe(Role.SUPORTE);
  });

  it("should throw FORBIDDEN when user does not have required role", async () => {
    const clientPayload: SessionPayload = {
      ...samplePayload,
      role: Role.CLIENTE,
    };
    await createSession(clientPayload);

    await expect(requireSession([Role.SUPORTE])).rejects.toThrow("FORBIDDEN");
  });

  it("should throw UNAUTHORIZED when no session exists", async () => {
    await deleteSession();
    await expect(requireSession()).rejects.toThrow("UNAUTHORIZED");
  });
});
