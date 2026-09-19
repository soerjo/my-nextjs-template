import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, render, screen } from "@/test-utils";

const { registerMock, errorMock, pushMock } = vi.hoisted(() => ({
  registerMock: vi.fn(),
  errorMock: { current: null as Error | null },
  pushMock: vi.fn(),
}));

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: pushMock }),
}));

vi.mock("@/features/auth/hooks", () => ({
  useRegister: () => ({
    register: registerMock,
    isLoading: false,
    error: errorMock.current,
  }),
}));

import { RegisterForm } from "@/features/auth/components/register-form";

afterEach(() => {
  cleanup();
});

describe("RegisterForm", () => {
  it("shows an alert with the registration error message", () => {
    errorMock.current = new Error("Email already registered");

    render(<RegisterForm />);

    const alert = screen.getByRole("alert");
    expect(alert).toBeTruthy();
    expect(alert.textContent).toContain("Email already registered");
  });

  it("shows no alert when there is no error", () => {
    errorMock.current = null;

    render(<RegisterForm />);

    expect(screen.queryByRole("alert")).toBeNull();
  });
});