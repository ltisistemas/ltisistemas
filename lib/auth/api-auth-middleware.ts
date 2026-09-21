import { SessionPayload, verifySessionToken } from "./session";
import { verifyAndConsumeApiKey } from "./api-keys";

/**
 * Unified authentication helper for API routes.
 * Supports:
 * 1. `x-api-key: lti_live_...` header
 * 2. `Authorization: Bearer lti_live_...` (API Key via Authorization header)
 * 3. `Authorization: Bearer <jwt_token>` (JWT session/access token)
 */
export async function authenticateApiRequest(request: Request): Promise<SessionPayload | null> {
  const apiKeyHeader = request.headers.get("x-api-key");
  if (apiKeyHeader) {
    const session = await verifyAndConsumeApiKey(apiKeyHeader);
    if (session) return session;
  }

  const authHeader = request.headers.get("authorization");
  if (authHeader && authHeader.toLowerCase().startsWith("bearer ")) {
    const token = authHeader.slice(7).trim();
    if (!token) return null;

    // Check if bearer token is an API key
    if (token.startsWith("lti_live_")) {
      const session = await verifyAndConsumeApiKey(token);
      if (session) return session;
    } else {
      // Treat as signed JWT session token
      const session = await verifySessionToken(token);
      if (session && (!session.status || session.status === "ATIVO")) {
        return session;
      }
    }
  }

  return null;
}
