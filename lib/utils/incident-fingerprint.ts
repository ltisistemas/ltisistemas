import crypto from "crypto";

const SENSITIVE_KEYS = new Set([
  "password",
  "senha",
  "pass",
  "token",
  "secret",
  "authorization",
  "auth",
  "apikey",
  "api_key",
  "creditcard",
  "cartao",
  "cvv",
  "accesstoken",
  "refreshtoken",
  "privatekey",
]);

function deepSanitize(obj: any): any {
  if (obj === null || obj === undefined) return obj;

  if (Array.isArray(obj)) {
    return obj.map((item) => deepSanitize(item));
  }

  if (typeof obj === "object") {
    const cleaned: Record<string, any> = {};
    for (const [key, val] of Object.entries(obj)) {
      const normalizedKey = key.toLowerCase().replace(/[^a-z]/g, "");
      if (SENSITIVE_KEYS.has(normalizedKey)) {
        cleaned[key] = "[REDACTED]";
      } else if (typeof val === "object" && val !== null) {
        cleaned[key] = deepSanitize(val);
      } else {
        cleaned[key] = val;
      }
    }
    return cleaned;
  }

  return obj;
}

/**
 * Sanitizes request/response payloads to scrub passwords, tokens and secrets
 * and returns a formatted JSON string (capped at 64KB).
 */
export function sanitizePayload(payload: any): string | null {
  if (payload === null || payload === undefined || payload === "") {
    return null;
  }

  try {
    let parsed = payload;
    if (typeof payload === "string") {
      try {
        parsed = JSON.parse(payload);
      } catch {
        // Not a JSON string - truncate if excessively long
        const truncated = payload.length > 65536 ? payload.slice(0, 65536) + "... [TRUNCATED]" : payload;
        return truncated;
      }
    }

    const sanitized = deepSanitize(parsed);
    const jsonStr = JSON.stringify(sanitized, null, 2);
    if (jsonStr.length > 65536) {
      return jsonStr.slice(0, 65536) + "\n... [PAYLOAD TRUNCATED]";
    }
    return jsonStr;
  } catch {
    return String(payload).slice(0, 65536);
  }
}

/**
 * Normalizes error log messages by stripping dynamic data (UUIDs, timestamps, hex pointers).
 */
export function normalizeErrorMessage(msg: string): string {
  if (!msg) return "";

  // Get first 2 lines of error or title
  const firstLines = msg.split("\n").slice(0, 2).join(" ");

  return firstLines
    .replace(/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/gi, "<UUID>")
    .replace(/\b0x[0-9a-fA-F]+\b/g, "<HEX>")
    .replace(/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d+)?Z?/g, "<TIMESTAMP>")
    .replace(/\d{10,13}/g, "<TIMESTAMP_MS>")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();
}

/**
 * Generates a deterministic SHA-256 fingerprint for grouping recurring incidents.
 */
export function generateIncidentFingerprint(params: {
  userId: string;
  origin: string;
  screenName: string;
  title: string;
  errorLog?: string | null;
}): string {
  const errorBasis = params.errorLog ? params.errorLog : params.title;
  const normalizedError = normalizeErrorMessage(errorBasis);
  const normalizedScreen = (params.screenName || "geral").toLowerCase().trim();
  const normalizedOrigin = (params.origin || "OUTROS").toUpperCase().trim();

  const rawKey = `${params.userId}:${normalizedOrigin}:${normalizedScreen}:${normalizedError}`;
  return crypto.createHash("sha256").update(rawKey).digest("hex");
}
