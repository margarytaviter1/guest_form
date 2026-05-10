import { sanitize } from "../logger";
import browserLogger from "../browser-logger";

// Use browser logger for instance tests (no pino-pretty transport, works in jsdom)

describe("sanitize", () => {
  it("redacts PII fields from a flat object", () => {
    const input = {
      bookingId: "abc-123",
      arrivalTime: "14:00",
      comments: "Need quiet room",
      mealPlan: "breakfast",
    };
    const result = sanitize(input);
    expect(result.bookingId).toBe("[REDACTED]");
    expect(result.comments).toBe("[REDACTED]");
    expect(result.arrivalTime).toBe("14:00");
    expect(result.mealPlan).toBe("breakfast");
  });

  it("redacts PII fields in nested objects", () => {
    const input = { guest: { name: "John", email: "john@test.com", age: 30 } };
    const result = sanitize(input);
    expect(result.guest.name).toBe("[REDACTED]");
    expect(result.guest.email).toBe("[REDACTED]");
    expect(result.guest.age).toBe(30);
  });

  it("handles arrays", () => {
    const input = [{ bookingId: "x" }, { bookingId: "y" }];
    const result = sanitize(input);
    expect(result[0].bookingId).toBe("[REDACTED]");
    expect(result[1].bookingId).toBe("[REDACTED]");
  });

  it("returns primitives and nulls unchanged", () => {
    expect(sanitize(null)).toBeNull();
    expect(sanitize(undefined)).toBeUndefined();
    expect(sanitize("hello")).toBe("hello");
    expect(sanitize(42)).toBe(42);
  });

  it("does not mutate the original object", () => {
    const input = { bookingId: "abc-123", mealPlan: "breakfast" };
    sanitize(input);
    expect(input.bookingId).toBe("abc-123");
  });

  it("redacts all defined PII fields", () => {
    const input = {
      email: "user@example.com",
      name: "Jane Doe",
      phone: "+380991234567",
      ip: "192.168.1.1",
      bookingId: "abc",
      comments: "secret",
      safeField: "visible",
    };
    const result = sanitize(input);
    expect(result.email).toBe("[REDACTED]");
    expect(result.name).toBe("[REDACTED]");
    expect(result.phone).toBe("[REDACTED]");
    expect(result.ip).toBe("[REDACTED]");
    expect(result.safeField).toBe("visible");
  });
});

describe("logger instance", () => {
  it("exposes all standard log levels", () => {
    expect(typeof browserLogger.trace).toBe("function");
    expect(typeof browserLogger.debug).toBe("function");
    expect(typeof browserLogger.info).toBe("function");
    expect(typeof browserLogger.warn).toBe("function");
    expect(typeof browserLogger.error).toBe("function");
    expect(typeof browserLogger.fatal).toBe("function");
  });

  it("can log structured data without throwing", () => {
    expect(() => browserLogger.info({ key: "value" }, "test message")).not.toThrow();
    expect(() => browserLogger.warn({ code: 400 }, "warning message")).not.toThrow();
  });

  it("handles exception logging with Error objects", () => {
    const error = new Error("Something broke");
    expect(() => browserLogger.error({ err: error }, "Caught exception")).not.toThrow();
  });

  it("handles exception logging with nested error details", () => {
    const error = new TypeError("Cannot read property 'x' of undefined");
    expect(() =>
      browserLogger.error(
        { err: error, method: "POST", path: "/api/guests", durationMs: 42 },
        "Request failed with exception",
      ),
    ).not.toThrow();
  });

  it("sanitizes PII before logging without affecting original", () => {
    const data = { bookingId: "secret-id", mealPlan: "breakfast" };
    const sanitized = sanitize(data);
    // Logger receives sanitized data — PII is redacted
    expect(() => browserLogger.info({ formData: sanitized }, "form submitted")).not.toThrow();
    // Original unchanged
    expect(data.bookingId).toBe("secret-id");
  });
});
