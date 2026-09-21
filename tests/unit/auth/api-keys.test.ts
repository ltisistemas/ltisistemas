import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  generateApiKeySecret,
  hashApiKey,
  getKeyPrefix,
  createApiKeyForUser,
  verifyAndConsumeApiKey,
} from "@/lib/auth/api-keys";
import { prisma } from "@/lib/db/prisma";
import { Role, UserStatus } from "@prisma/client";

describe("lib/auth/api-keys", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  describe("generateApiKeySecret", () => {
    it("should generate a valid secret starting with lti_live_", () => {
      const key1 = generateApiKeySecret();
      const key2 = generateApiKeySecret();

      expect(key1.startsWith("lti_live_")).toBe(true);
      expect(key2.startsWith("lti_live_")).toBe(true);
      expect(key1).not.toEqual(key2);
      expect(key1.length).toBeGreaterThanOrEqual(30);
    });
  });

  describe("hashApiKey", () => {
    it("should deterministically hash the secret with SHA-256", () => {
      const secret = "lti_live_1234567890abcdef";
      const hash1 = hashApiKey(secret);
      const hash2 = hashApiKey(secret);

      expect(hash1).toEqual(hash2);
      expect(hash1).toHaveLength(64); // SHA-256 produces 64 hex characters
    });
  });

  describe("getKeyPrefix", () => {
    it("should extract formatted key prefix", () => {
      const secret = "lti_live_1234567890abcdef";
      const prefix = getKeyPrefix(secret);
      expect(prefix).toBe("lti_live_1234567...");

      expect(getKeyPrefix("short")).toBe("short");
    });
  });

  describe("createApiKeyForUser", () => {
    it("should create and return newly generated API key with secret", async () => {
      const now = new Date();
      vi.spyOn(prisma.apiKey, "create").mockResolvedValue({
        id: "key_123",
        name: "Produção API",
        keyHash: "hashed_value",
        keyPrefix: "lti_live_abc1234...",
        userId: "usr_1",
        lastUsedAt: null,
        expiresAt: null,
        revokedAt: null,
        createdAt: now,
      } as any);

      const res = await createApiKeyForUser({
        userId: "usr_1",
        name: "Produção API",
      });

      expect(res.id).toBe("key_123");
      expect(res.name).toBe("Produção API");
      expect(res.secretKey.startsWith("lti_live_")).toBe(true);
      expect(res.keyPrefix).toBeDefined();
      expect(prisma.apiKey.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            userId: "usr_1",
            name: "Produção API",
          }),
        })
      );
    });
  });

  describe("verifyAndConsumeApiKey", () => {
    it("should return null for empty or invalid format secret", async () => {
      expect(await verifyAndConsumeApiKey("")).toBeNull();
      expect(await verifyAndConsumeApiKey("invalid_prefix_123")).toBeNull();
    });

    it("should return null if key is not found in database", async () => {
      vi.spyOn(prisma.apiKey, "findUnique").mockResolvedValue(null);
      const res = await verifyAndConsumeApiKey("lti_live_unknown_key");
      expect(res).toBeNull();
    });

    it("should return null if key is revoked", async () => {
      vi.spyOn(prisma.apiKey, "findUnique").mockResolvedValue({
        id: "key_revoked",
        revokedAt: new Date(),
        expiresAt: null,
        user: { id: "usr_1" },
      } as any);

      const res = await verifyAndConsumeApiKey("lti_live_revoked_key");
      expect(res).toBeNull();
    });

    it("should return null if key is expired", async () => {
      vi.spyOn(prisma.apiKey, "findUnique").mockResolvedValue({
        id: "key_expired",
        revokedAt: null,
        expiresAt: new Date(Date.now() - 3600 * 1000), // 1 hour ago
        user: { id: "usr_1" },
      } as any);

      const res = await verifyAndConsumeApiKey("lti_live_expired_key");
      expect(res).toBeNull();
    });

    it("should return null if user is deleted or inactive", async () => {
      vi.spyOn(prisma.apiKey, "findUnique").mockResolvedValue({
        id: "key_valid",
        revokedAt: null,
        expiresAt: null,
        user: {
          id: "usr_1",
          status: UserStatus.INATIVO,
          deletedAt: null,
        },
      } as any);

      const res1 = await verifyAndConsumeApiKey("lti_live_inactive_user_key");
      expect(res1).toBeNull();

      vi.spyOn(prisma.apiKey, "findUnique").mockResolvedValue({
        id: "key_valid",
        revokedAt: null,
        expiresAt: null,
        user: {
          id: "usr_1",
          status: UserStatus.ATIVO,
          deletedAt: new Date(),
        },
      } as any);

      const res2 = await verifyAndConsumeApiKey("lti_live_deleted_user_key");
      expect(res2).toBeNull();
    });

    it("should authenticate valid active key, trigger lastUsedAt update and return session payload", async () => {
      vi.spyOn(prisma.apiKey, "findUnique").mockResolvedValue({
        id: "key_active",
        revokedAt: null,
        expiresAt: null,
        user: {
          id: "usr_client_1",
          name: "Cliente Empresa",
          email: "api@empresa.com",
          company: "Empresa S.A.",
          contractNumber: "CTR-999",
          systemUrl: "https://empresa.com",
          status: UserStatus.ATIVO,
          role: Role.CLIENTE,
          deletedAt: null,
        },
      } as any);

      const updateSpy = vi.spyOn(prisma.apiKey, "update").mockResolvedValue({} as any);

      const payload = await verifyAndConsumeApiKey("lti_live_valid_secret_key_123");

      expect(payload).not.toBeNull();
      expect(payload?.userId).toBe("usr_client_1");
      expect(payload?.company).toBe("Empresa S.A.");
      expect(payload?.role).toBe(Role.CLIENTE);
      expect(updateSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: "key_active" },
          data: expect.objectContaining({ lastUsedAt: expect.any(Date) }),
        })
      );
    });
  });
});
