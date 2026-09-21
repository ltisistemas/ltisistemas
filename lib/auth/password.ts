import { hash, verify } from "@node-rs/argon2";
import crypto from "crypto";

const PEPPER = process.env.AUTH_PEPPER || "lti-sistemas-ticket-argon2id-pepper-2026-secure-key";

/**
 * Pre-hashes the password with HMAC-SHA256 using the server-side secret pepper
 * to guarantee strict cryptographic resistance and fixed entropy.
 */
function applyPepper(password: string): string {
  return crypto.createHmac("sha256", PEPPER).update(password).digest("hex");
}

/**
 * Hashes a plain text password using Argon2id with server-side pepper.
 */
export async function hashPassword(plainPassword: string): Promise<string> {
  const peppered = applyPepper(plainPassword);
  return await hash(peppered, {
    memoryCost: 65536, // 64 MB
    timeCost: 3, // 3 iterations
    outputLen: 32,
    parallelism: 1,
  });
}

/**
 * Verifies a plain text password against an Argon2id peppered hash.
 */
export async function verifyPassword(plainPassword: string, storedHash: string): Promise<boolean> {
  try {
    const peppered = applyPepper(plainPassword);
    return await verify(storedHash, peppered);
  } catch (error) {
    console.error("Password verification error:", error);
    return false;
  }
}
