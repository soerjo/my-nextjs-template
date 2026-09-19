import { describe, expect, it, vi } from "vitest";
import { renderHook } from "@testing-library/react";

import { useRole, type RoleName } from "@/features/auth/hooks/use-role";

const authState = vi.hoisted(() => ({
  accessToken: null as string | null,
  isAuthLoading: false,
}));

vi.mock("@/features/auth/providers/auth-provider", () => ({
  useAuth: () => ({ ...authState }),
}));

function makeToken(payload: object): string {
  const encode = (value: unknown) =>
    btoa(JSON.stringify(value)).replace(/=+$/, "");
  return `${encode({ alg: "HS256", typ: "JWT" })}.${encode(payload)}.signature`;
}

function renderUseRole() {
  return renderHook(() => useRole());
}

describe("useRole", () => {
  it("extracts a valid role from the access token", () => {
    authState.accessToken = makeToken({ sub: "user-1", role: "ADMIN" });
    authState.isAuthLoading = false;

    const { result } = renderUseRole();

    expect(result.current.role).toBe<RoleName>("ADMIN");
    expect(result.current.isLoading).toBe(false);
  });

  it("returns null when the token has no role", () => {
    authState.accessToken = makeToken({ sub: "user-1" });
    authState.isAuthLoading = false;

    const { result } = renderUseRole();

    expect(result.current.role).toBeNull();
  });

  it("returns null for an unknown role value", () => {
    authState.accessToken = makeToken({ sub: "user-1", role: "GUEST" });
    authState.isAuthLoading = false;

    const { result } = renderUseRole();

    expect(result.current.role).toBeNull();
  });

  it.each(["ADMIN", "USER", "SYSTEM"] as const)("supports role %s", (role) => {
    authState.accessToken = makeToken({ role });
    authState.isAuthLoading = false;

    const { result } = renderUseRole();

    expect(result.current.role).toBe(role);
  });

  it("returns null when there is no token", () => {
    authState.accessToken = null;
    authState.isAuthLoading = false;

    const { result } = renderUseRole();

    expect(result.current.role).toBeNull();
    expect(result.current.isLoading).toBe(false);
  });

  it("returns null for a malformed token", () => {
    authState.accessToken = "not-a-jwt";
    authState.isAuthLoading = false;

    const { result } = renderUseRole();

    expect(result.current.role).toBeNull();
  });

  it("exposes the auth loading state", () => {
    authState.accessToken = null;
    authState.isAuthLoading = true;

    const { result } = renderUseRole();

    expect(result.current.isLoading).toBe(true);
    expect(result.current.role).toBeNull();
  });
});
