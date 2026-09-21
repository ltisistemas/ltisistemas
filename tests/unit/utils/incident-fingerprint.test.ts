import { describe, it, expect } from "vitest";
import {
  sanitizePayload,
  normalizeErrorMessage,
  generateIncidentFingerprint,
} from "@/lib/utils/incident-fingerprint";

describe("lib/utils/incident-fingerprint", () => {
  describe("sanitizePayload", () => {
    it("should return null for empty or undefined payload", () => {
      expect(sanitizePayload(null)).toBeNull();
      expect(sanitizePayload(undefined)).toBeNull();
      expect(sanitizePayload("")).toBeNull();
    });

    it("should mask sensitive keys in objects and JSON strings", () => {
      const payload = {
        username: "carlos",
        password: "SuperSecretPassword123",
        token: "jwt_token_here",
        credit_card: "4111222233334444",
        nested: {
          apiKey: "lti_live_secret",
          data: "public data",
        },
      };

      const result = sanitizePayload(payload);
      expect(result).not.toBeNull();
      const parsed = JSON.parse(result!);

      expect(parsed.username).toBe("carlos");
      expect(parsed.password).toBe("[REDACTED]");
      expect(parsed.token).toBe("[REDACTED]");
      expect(parsed.credit_card).toBe("[REDACTED]");
      expect(parsed.nested.apiKey).toBe("[REDACTED]");
      expect(parsed.nested.data).toBe("public data");
    });

    it("should handle non-JSON string payloads safely", () => {
      const plainText = "Raw error response from server";
      expect(sanitizePayload(plainText)).toBe("Raw error response from server");
    });
  });

  describe("normalizeErrorMessage", () => {
    it("should strip UUIDs, timestamps, and hex pointers", () => {
      const msg = "Error connecting to db host 0x7fff89ab at 2026-09-21T15:30:00Z for session a1b2c3d4-e5f6-7890-abcd-ef1234567890";
      const normalized = normalizeErrorMessage(msg);

      expect(normalized).not.toContain("0x7fff89ab");
      expect(normalized).not.toContain("a1b2c3d4-e5f6-7890-abcd-ef1234567890");
      expect(normalized).not.toContain("2026-09-21T15:30:00Z");
      expect(normalized).toContain("<hex>");
      expect(normalized).toContain("<uuid>");
      expect(normalized).toContain("<timestamp>");
    });
  });

  describe("generateIncidentFingerprint", () => {
    it("should produce identical fingerprints for identical normalized incidents", () => {
      const fp1 = generateIncidentFingerprint({
        userId: "user_123",
        origin: "BACK",
        screenName: "Pagamentos",
        title: "Timeout ao processar pagamento",
        errorLog: "Timeout on socket 0x123 at 2026-09-21T10:00:00Z (uuid: 11111111-2222-3333-4444-555555555555)",
      });

      const fp2 = generateIncidentFingerprint({
        userId: "user_123",
        origin: "BACK",
        screenName: "Pagamentos",
        title: "Timeout ao processar pagamento",
        errorLog: "Timeout on socket 0x456 at 2026-09-21T10:05:00Z (uuid: 99999999-8888-7777-6666-555555555555)",
      });

      expect(fp1).toEqual(fp2);
      expect(fp1).toHaveLength(64);
    });

    it("should produce different fingerprints for different users, modules or origins", () => {
      const fpA = generateIncidentFingerprint({
        userId: "user_A",
        origin: "FRONT",
        screenName: "Checkout",
        title: "Botão quebrado",
      });

      const fpB = generateIncidentFingerprint({
        userId: "user_B",
        origin: "FRONT",
        screenName: "Checkout",
        title: "Botão quebrado",
      });

      const fpC = generateIncidentFingerprint({
        userId: "user_A",
        origin: "BACK",
        screenName: "Checkout",
        title: "Botão quebrado",
      });

      expect(fpA).not.toEqual(fpB);
      expect(fpA).not.toEqual(fpC);
    });
  });
});
