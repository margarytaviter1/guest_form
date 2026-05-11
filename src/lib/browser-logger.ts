import pino from "pino";

/**
 * Browser-safe logger for "use client" components.
 * No Node.js transports — avoids hydration mismatches.
 */

const PII_FIELDS = ["bookingId", "comments", "email", "name", "phone", "ip"];

export function sanitize<T>(obj: T): T {
  if (obj === null || obj === undefined) return obj;
  if (typeof obj !== "object") return obj;

  if (Array.isArray(obj)) {
    return obj.map((item) => sanitize(item)) as unknown as T;
  }

  const sanitized: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(obj as Record<string, unknown>)) {
    if (PII_FIELDS.includes(key)) {
      sanitized[key] = "[REDACTED]";
    } else if (typeof value === "object" && value !== null) {
      sanitized[key] = sanitize(value);
    } else {
      sanitized[key] = value;
    }
  }
  return sanitized as T;
}

const logger = pino({
  level: process.env.NODE_ENV === "production" ? "info" : "debug",
  browser: { asObject: true },
});

export default logger;
