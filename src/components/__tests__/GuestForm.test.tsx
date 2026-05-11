import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import GuestForm from "../GuestForm";

// Mock next/navigation
const mockSearchParams = new URLSearchParams();
jest.mock("next/navigation", () => ({
  useSearchParams: () => mockSearchParams,
}));

// Mock fetch
const mockFetch = jest.fn();
global.fetch = mockFetch;

beforeEach(() => {
  mockFetch.mockReset();
  mockSearchParams.delete("id");
});

describe("GuestForm", () => {
  it("shows invalid link message when no bookingId", () => {
    render(<GuestForm />);
    expect(screen.getByText("Невірне посилання")).toBeInTheDocument();
  });

  it("renders form when bookingId is present", () => {
    mockSearchParams.set("id", "test-123");
    render(<GuestForm />);
    expect(screen.getByText("Зберегти побажання")).toBeInTheDocument();
  });

  it("shows success message after successful submission", async () => {
    mockSearchParams.set("id", "test-123");
    mockFetch.mockResolvedValueOnce({
      json: async () => ({ success: true, id: 1 }),
    });

    render(<GuestForm />);
    const user = userEvent.setup();
    await user.click(screen.getByLabelText(/погоджуюся/i));
    await user.click(screen.getByText("Зберегти побажання"));

    await waitFor(() => {
      expect(screen.getByText("Дякуємо!")).toBeInTheDocument();
    });

    expect(mockFetch).toHaveBeenCalledWith(
      "/api/guests",
      expect.objectContaining({
        method: "POST",
      }),
    );
  });

  it("shows alert on server error", async () => {
    mockSearchParams.set("id", "test-123");
    mockFetch.mockResolvedValueOnce({
      json: async () => ({ success: false, error: "Server error" }),
    });
    const alertMock = jest.spyOn(window, "alert").mockImplementation(() => {});

    render(<GuestForm />);
    const user = userEvent.setup();
    await user.click(screen.getByLabelText(/погоджуюся/i));
    await user.click(screen.getByText("Зберегти побажання"));

    await waitFor(() => {
      expect(alertMock).toHaveBeenCalledWith(expect.stringContaining("Server error"));
    });
    alertMock.mockRestore();
  });

  it("shows alert on network error", async () => {
    mockSearchParams.set("id", "test-123");
    mockFetch.mockRejectedValueOnce(new Error("Network error"));
    const alertMock = jest.spyOn(window, "alert").mockImplementation(() => {});

    render(<GuestForm />);
    const user = userEvent.setup();
    await user.click(screen.getByLabelText(/погоджуюся/i));
    await user.click(screen.getByText("Зберегти побажання"));

    await waitFor(() => {
      expect(alertMock).toHaveBeenCalledWith("Помилка мережі. Спробуйте ще раз.");
    });
    alertMock.mockRestore();
  });

  it("hides mealGuests when mealPlan is none", async () => {
    mockSearchParams.set("id", "test-123");
    render(<GuestForm />);
    const user = userEvent.setup();

    const select = screen.getByLabelText("Чи потрібне харчування?");
    await user.selectOptions(select, "none");

    await waitFor(() => {
      expect(screen.queryByLabelText("На скільки осіб?")).not.toBeInTheDocument();
    });
  });
});
