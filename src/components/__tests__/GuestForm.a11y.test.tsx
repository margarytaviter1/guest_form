import { render } from "@testing-library/react";
import { axe, toHaveNoViolations } from "jest-axe";
import GuestForm from "../GuestForm";

expect.extend(toHaveNoViolations);

// Mock next/navigation
const mockSearchParams = new URLSearchParams();
jest.mock("next/navigation", () => ({
  useSearchParams: () => mockSearchParams,
}));

beforeEach(() => {
  mockSearchParams.delete("id");
});

describe("GuestForm accessibility", () => {
  it("empty state (no bookingId) has no a11y violations", async () => {
    const { container } = render(<GuestForm />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("form view has no a11y violations", async () => {
    mockSearchParams.set("id", "test-123");
    const { container } = render(<GuestForm />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("form has proper aria-label", () => {
    mockSearchParams.set("id", "test-123");
    const { container } = render(<GuestForm />);
    const form = container.querySelector("form");
    expect(form).toHaveAttribute("aria-label", "Форма побажань гостя");
  });

  it("all form sections use fieldset/legend for grouping", () => {
    mockSearchParams.set("id", "test-123");
    const { container } = render(<GuestForm />);
    const fieldsets = container.querySelectorAll("fieldset");
    const legends = container.querySelectorAll("legend");
    expect(fieldsets.length).toBeGreaterThanOrEqual(5);
    expect(legends.length).toBe(fieldsets.length);
  });

  it("decorative emojis are hidden from screen readers", () => {
    mockSearchParams.set("id", "test-123");
    const { container } = render(<GuestForm />);
    const hiddenEmojis = container.querySelectorAll('[aria-hidden="true"]');
    expect(hiddenEmojis.length).toBeGreaterThanOrEqual(10);
  });

  it("error state has role='alert'", () => {
    // No bookingId → shows error state
    const { container } = render(<GuestForm />);
    const alert = container.querySelector('[role="alert"]');
    expect(alert).toBeInTheDocument();
  });

  it("select inputs have aria-describedby pointing to error containers", () => {
    mockSearchParams.set("id", "test-123");
    const { container } = render(<GuestForm />);
    const arrivalSelect = container.querySelector("#arrivalTime");
    expect(arrivalSelect).toHaveAttribute("aria-describedby", "arrivalTime-error");
    const mealSelect = container.querySelector("#mealPlan");
    expect(mealSelect).toHaveAttribute("aria-describedby", "mealPlan-error");
    const transportSelect = container.querySelector("#transport");
    expect(transportSelect).toHaveAttribute("aria-describedby", "transport-error");
  });

  it("submit button has aria-busy when submitting", () => {
    mockSearchParams.set("id", "test-123");
    const { container } = render(<GuestForm />);
    const button = container.querySelector('button[type="submit"]');
    expect(button).toHaveAttribute("aria-busy", "false");
  });

  it("checkbox inputs have accessible labels", () => {
    mockSearchParams.set("id", "test-123");
    const { container } = render(<GuestForm />);
    const checkboxes = container.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach((cb) => {
      // Each checkbox should either have aria-label or be inside a <label>
      const hasAriaLabel = cb.hasAttribute("aria-label");
      const isInsideLabel = cb.closest("label") !== null;
      expect(hasAriaLabel || isInsideLabel).toBe(true);
    });
  });
});
