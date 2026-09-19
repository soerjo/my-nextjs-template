import { afterEach, describe, expect, it, vi } from "vitest";
import { renderWithProviders, screen, waitFor } from "@/test-utils";
import { AuthProvider, useAuth } from "@/features/auth/providers/auth-provider";
import { TokenManager } from "@/features/auth/services/token-manager";
import { apiClient } from "@/lib";
import type { ApiResponse } from "@/types";

const pushMock = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: pushMock }),
  usePathname: () => "/",
}));

function makeAccessToken(expiresInSeconds: number): string {
  const now = Math.floor(Date.now() / 1000);
  const payload = {
    sub: "user-1",
    iat: now,
    exp: now + expiresInSeconds,
  };
  const encode = (value: unknown) =>
    btoa(JSON.stringify(value)).replace(/=+$/, "");
  return `${encode({ alg: "none", typ: "JWT" })}.${encode(payload)}.signature`;
}

function AuthStateProbe() {
  const { isAuthenticated, isAuthLoading, error } = useAuth();
  return (
    <div>
      <span data-testid="loading">{String(isAuthLoading)}</span>
      <span data-testid="authenticated">{String(isAuthenticated)}</span>
      <span data-testid="error">{error ? error.message : ""}</span>
    </div>
  );
}

describe("AuthProvider verify regression", () => {
  afterEach(() => {
    vi.restoreAllMocks();
    TokenManager.clearTokens();
    pushMock.mockClear();
  });

  it("does not authenticate a user when the verify result omits a true valid flag", async () => {
    TokenManager.setAccessToken(makeAccessToken(3600));

    vi.spyOn(apiClient, "get").mockResolvedValue({
      data: {},
    } as ApiResponse<{ valid: boolean }>);

    renderWithProviders(
      <AuthProvider>
        <AuthStateProbe />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId("loading").textContent).toBe("false");
    });

    expect(screen.getByTestId("authenticated").textContent).toBe("false");
  });
});