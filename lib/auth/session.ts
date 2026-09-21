import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { Role, UserStatus } from "@prisma/client";

export interface SessionPayload {
  userId: string;
  name: string;
  email: string;
  company: string;
  contractNumber?: string | null;
  systemUrl?: string | null;
  status?: UserStatus;
  role: Role;
}

const COOKIE_NAME = "lti_session";

function getSecretKey() {
  const secret =
    process.env.AUTH_SECRET ||
    "lti-sistemas-secure-jwt-session-secret-key-2026-very-safe";
  return new Uint8Array(Buffer.from(secret, "utf-8"));
}

/**
 * Signs a session payload into a JWT string.
 */
export async function signSession(payload: SessionPayload): Promise<string> {
  return await new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(getSecretKey());
}

/**
 * Verifies a JWT session string and returns the payload if valid.
 */
export async function verifySessionToken(token: string): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, getSecretKey());
    return {
      userId: payload.userId as string,
      name: payload.name as string,
      email: payload.email as string,
      company: payload.company as string,
      contractNumber: payload.contractNumber as string | null | undefined,
      systemUrl: payload.systemUrl as string | null | undefined,
      status: (payload.status as UserStatus) || "ATIVO",
      role: payload.role as Role,
    };
  } catch (error) {
    return null;
  }
}

/**
 * Creates and stores the session cookie in HTTP-only mode.
 */
export async function createSession(payload: SessionPayload): Promise<void> {
  const token = await signSession(payload);
  const cookieStore = await cookies();

  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });
}

/**
 * Retrieves and validates the current session from incoming cookies.
 */
export async function getSession(): Promise<SessionPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;

  if (!token) return null;
  return await verifySessionToken(token);
}

/**
 * Deletes the session cookie on logout.
 */
export async function deleteSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
}

/**
 * Server-side guard helper that ensures an active session exists and optionally matches roles.
 */
export async function requireSession(allowedRoles?: Role[]): Promise<SessionPayload> {
  const session = await getSession();
  if (!session) {
    throw new Error("UNAUTHORIZED");
  }
  if (allowedRoles && !allowedRoles.includes(session.role)) {
    throw new Error("FORBIDDEN");
  }
  return session;
}
