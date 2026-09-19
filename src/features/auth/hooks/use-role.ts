"use client";

import { useMemo } from "react";
import { jwtDecode } from "jwt-decode";
import { useAuth } from "@/features/auth/providers/auth-provider";

export type RoleName = "ADMIN" | "USER" | "SYSTEM";

/** @deprecated Use `RoleName` instead. Kept for backwards compatibility. */
export type Role = RoleName;

const ROLES: readonly RoleName[] = ["ADMIN", "USER", "SYSTEM"] as const;

interface DecodedToken {
  role?: unknown;
  [key: string]: unknown;
}

function extractRole(token: string | null): RoleName | null {
  if (!token) return null;

  let payload: DecodedToken;
  try {
    payload = jwtDecode<DecodedToken>(token);
  } catch {
    return null;
  }

  const candidate = payload?.role;

  if (typeof candidate === "string" && (ROLES as readonly string[]).includes(candidate)) {
    return candidate as RoleName;
  }

  return null;
}

export function useRole(): { role: RoleName | null; isLoading: boolean } {
  const { isAuthLoading, accessToken } = useAuth();

  const role = useMemo(() => extractRole(accessToken), [accessToken]);

  return { role, isLoading: isAuthLoading };
}
