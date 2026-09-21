import { describe, it, expect } from "vitest";
import { hashPassword, verifyPassword } from "@/lib/auth/password";

describe("lib/auth/password", () => {
  it("should generate a valid Argon2id hash", async () => {
    const password = "SecurePassword@2026!";
    const hash = await hashPassword(password);

    expect(hash).toBeDefined();
    expect(typeof hash).toBe("string");
    expect(hash.startsWith("$argon2id$")).toBe(true);
  });

  it("should produce different hashes for the same password due to salting", async () => {
    const password = "TestPassword123";
    const hash1 = await hashPassword(password);
    const hash2 = await hashPassword(password);

    expect(hash1).not.toEqual(hash2);
  });

  it("should verify correct password successfully", async () => {
    const password = "MySecretPassphrase!";
    const hash = await hashPassword(password);

    const isValid = await verifyPassword(password, hash);
    expect(isValid).toBe(true);
  });

  it("should reject incorrect password", async () => {
    const password = "CorrectPassword123";
    const wrongPassword = "WrongPassword456";
    const hash = await hashPassword(password);

    const isValid = await verifyPassword(wrongPassword, hash);
    expect(isValid).toBe(false);
  });

  it("should safely handle malformed or corrupted hashes", async () => {
    const isValid = await verifyPassword("somePassword", "invalid_corrupted_hash_format");
    expect(isValid).toBe(false);
  });
});
