import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, render, screen } from "@/test-utils";

const { loginMock, errorMock } = vi.hoisted(() => ({
  loginMock: vi.fn(),
  errorMock: { current: null as Error | null },
}));

vi.mock("@/features/auth/hooks", () => ({
  useLogin: () => ({ login: loginMock, isLoading: false, error: errorMock.current }),
}));

import { LoginForm } from "@/features/auth/components/login-form";

afterEach(() => {
  cleanup();
});

describe("LoginForm", () => {
  it("shows an alert with the login error message", () => {
    errorMock.current = new Error("Invalid credentials");

    render(<LoginForm />);

    const alert = screen.getByRole("alert");
    expect(alert).toBeTruthy();
    expect(alert.textContent).toBe("Invalid credentials");
  });

  it("shows no alert when there is no error", () => {
    errorMock.current = null;

    render(<LoginForm />);

    expect(screen.queryByRole("alert")).toBeNull();
  });
});