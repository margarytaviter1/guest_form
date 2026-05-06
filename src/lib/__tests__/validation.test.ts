import { preferencesSchema, initialValues } from "../validation";

describe("preferencesSchema", () => {
  it("accepts valid default values with a bookingId", async () => {
    const data = { ...initialValues, bookingId: "abc-123" };
    await expect(preferencesSchema.validate(data)).resolves.toBeDefined();
  });

  it("rejects missing bookingId", async () => {
    const data = { ...initialValues, bookingId: "" };
    await expect(preferencesSchema.validate(data)).rejects.toThrow();
  });

  it("rejects missing arrivalTime", async () => {
    const data = { ...initialValues, bookingId: "x", arrivalTime: "" };
    await expect(preferencesSchema.validate(data)).rejects.toThrow();
  });

  it("rejects invalid mealPlan", async () => {
    const data = { ...initialValues, bookingId: "x", mealPlan: "invalid" };
    await expect(preferencesSchema.validate(data)).rejects.toThrow();
  });

  it("requires mealGuests when mealPlan is not none", async () => {
    const data = {
      ...initialValues,
      bookingId: "x",
      mealPlan: "breakfast",
      mealGuests: undefined,
    };
    await expect(preferencesSchema.validate(data)).rejects.toThrow();
  });

  it("does not require mealGuests when mealPlan is none", async () => {
    const data = {
      ...initialValues,
      bookingId: "x",
      mealPlan: "none",
      mealGuests: undefined,
    };
    await expect(preferencesSchema.validate(data)).resolves.toBeDefined();
  });

  it("rejects mealGuests > 20", async () => {
    const data = { ...initialValues, bookingId: "x", mealGuests: 21 };
    await expect(preferencesSchema.validate(data)).rejects.toThrow();
  });

  it("rejects comments longer than 1000 chars", async () => {
    const data = {
      ...initialValues,
      bookingId: "x",
      comments: "a".repeat(1001),
    };
    await expect(preferencesSchema.validate(data)).rejects.toThrow();
  });

  it("accepts comments up to 1000 chars", async () => {
    const data = {
      ...initialValues,
      bookingId: "x",
      comments: "a".repeat(1000),
    };
    await expect(preferencesSchema.validate(data)).resolves.toBeDefined();
  });

  it("collects all errors with abortEarly: false", async () => {
    const data = { bookingId: "", arrivalTime: "", mealPlan: "bad" };
    try {
      await preferencesSchema.validate(data, { abortEarly: false });
      fail("should have thrown");
    } catch (err: any) {
      expect(err.errors.length).toBeGreaterThanOrEqual(2);
    }
  });
});
