import crypto from "crypto";
import { prisma } from "../db/prisma";
import { SessionPayload } from "./session";

/**
 * Generates a secure random API Key prefixed with lti_live_
 */
export function generateApiKeySecret(): string {
  const randomHex = crypto.randomBytes(24).toString("hex");
  return `lti_live_${randomHex}`;
}

/**
 * Computes SHA-256 hash for secure storage and comparison.
 */
export function hashApiKey(secret: string): string {
  return crypto.createHash("sha256").update(secret.trim()).digest("hex");
}

/**
 * Returns a masked prefix of the key for identification in the UI.
 */
export function getKeyPrefix(secret: string): string {
  const clean = secret.trim();
  return clean.length >= 16 ? `${clean.slice(0, 16)}...` : clean;
}

export interface CreatedApiKey {
  id: string;
  name: string;
  keyPrefix: string;
  secretKey: string;
  createdAt: Date;
}

/**
 * Creates and registers a new API Key for a given client user.
 * Note: `secretKey` is returned only once at creation time.
 */
export async function createApiKeyForUser(params: {
  userId: string;
  name?: string;
  expiresAt?: Date;
}): Promise<CreatedApiKey> {
  const secretKey = generateApiKeySecret();
  const keyHash = hashApiKey(secretKey);
  const keyPrefix = getKeyPrefix(secretKey);

  const apiKey = await prisma.apiKey.create({
    data: {
      userId: params.userId,
      name: params.name || "Default API Key",
      keyHash,
      keyPrefix,
      expiresAt: params.expiresAt,
    },
    select: {
      id: true,
      name: true,
      keyPrefix: true,
      createdAt: true,
    },
  });

  return {
    id: apiKey.id,
    name: apiKey.name,
    keyPrefix: apiKey.keyPrefix,
    secretKey,
    createdAt: apiKey.createdAt,
  };
}

/**
 * Verifies an incoming API Key secret against stored hashes, ensures it is active,
 * non-expired and not revoked, updates `lastUsedAt`, and returns the associated session payload.
 */
export async function verifyAndConsumeApiKey(secret: string): Promise<SessionPayload | null> {
  if (!secret || typeof secret !== "string" || !secret.startsWith("lti_live_")) {
    return null;
  }

  const keyHash = hashApiKey(secret);
  const now = new Date();

  const apiKey = await prisma.apiKey.findUnique({
    where: { keyHash },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          company: true,
          contractNumber: true,
          systemUrl: true,
          status: true,
          role: true,
          deletedAt: true,
        },
      },
    },
  });

  if (!apiKey || apiKey.revokedAt || (apiKey.expiresAt && apiKey.expiresAt < now)) {
    return null;
  }

  if (!apiKey.user || apiKey.user.deletedAt || apiKey.user.status === "INATIVO") {
    return null;
  }

  // Update lastUsedAt asynchronously
  prisma.apiKey
    .update({
      where: { id: apiKey.id },
      data: { lastUsedAt: now },
    })
    .catch((err) => {
      console.error("Failed to update lastUsedAt for API Key:", err);
    });

  return {
    userId: apiKey.user.id,
    name: apiKey.user.name,
    email: apiKey.user.email,
    company: apiKey.user.company,
    contractNumber: apiKey.user.contractNumber,
    systemUrl: apiKey.user.systemUrl,
    status: apiKey.user.status,
    role: apiKey.user.role,
  };
}
