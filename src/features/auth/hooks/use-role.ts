"use client";

import { TokenManager } from "@/features/auth/services/token-manager";
import { useAuth } from "@/features/auth/providers/auth-provider";

export type Role = "ADMIN" | "USER" | "SYSTEM";

const ROLES: readonly Role[] = ["ADMIN", "USER", "SYSTEM"] as const;

function parseRole(token: string | null): Role | null {
  if (!token) return null;

  const payload = TokenManager.parseToken(token);
  const candidate = payload?.role;

  if (typeof candidate === "string" && (ROLES as readonly string[]).includes(candidate)) {
    return candidate as Role;
  }

  return null;
}

export function useRole(): { role: Role | null; isLoading: boolean } {
  const { isAuthLoading } = useAuth();

  return {
    role: parseRole(TokenManager.getAccessToken()),
    isLoading: isAuthLoading,
  };
}