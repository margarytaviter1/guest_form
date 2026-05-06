/**
 * @jest-environment node
 */
import { POST, GET } from "../route";
import { initialValues } from "@/lib/validation";

// Mock the db pool
jest.mock("@/lib/db", () => ({
  __esModule: true,
  default: {
    query: jest.fn(),
  },
}));

import pool from "@/lib/db";
const mockQuery = pool.query as jest.Mock;

function makeRequest(body: any): any {
  return {
    json: async () => body,
  } as any;
}

beforeEach(() => {
  mockQuery.mockReset();
});

describe("POST /api/guests", () => {
  it("returns 201 on valid data", async () => {
    mockQuery.mockResolvedValueOnce({ rows: [{ id: 42 }] });

    const body = { ...initialValues, bookingId: "abc-123" };
    const res = await POST(makeRequest(body));
    const json = await res.json();

    expect(res.status).toBe(201);
    expect(json.success).toBe(true);
    expect(json.id).toBe(42);
    expect(mockQuery).toHaveBeenCalledTimes(1);
  });

  it("returns 400 on validation error", async () => {
    const body = { bookingId: "", arrivalTime: "" };
    const res = await POST(makeRequest(body));
    const json = await res.json();

    expect(res.status).toBe(400);
    expect(json.success).toBe(false);
    expect(json.errors).toBeDefined();
    expect(mockQuery).not.toHaveBeenCalled();
  });

  it("returns 500 on db error", async () => {
    mockQuery.mockRejectedValueOnce(new Error("DB down"));

    const body = { ...initialValues, bookingId: "abc-123" };
    const consoleSpy = jest.spyOn(console, "error").mockImplementation(() => {});
    const res = await POST(makeRequest(body));
    const json = await res.json();

    expect(res.status).toBe(500);
    expect(json.success).toBe(false);
    consoleSpy.mockRestore();
  });

  it("passes null for mealGuests when mealPlan is none", async () => {
    mockQuery.mockResolvedValueOnce({ rows: [{ id: 1 }] });

    const body = { ...initialValues, bookingId: "x", mealPlan: "none" };
    await POST(makeRequest(body));

    const args = mockQuery.mock.calls[0][1];
    // mealGuests is the 4th parameter (index 3)
    expect(args[3]).toBeNull();
  });
});

describe("GET /api/guests", () => {
  it("returns rows from database", async () => {
    const rows = [{ id: 1, booking_id: "abc" }];
    mockQuery.mockResolvedValueOnce({ rows });

    const res = await GET();
    const json = await res.json();

    expect(json).toEqual(rows);
  });
});
