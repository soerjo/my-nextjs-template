'use client';

import type { ApiResponse } from '@/types';

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import { ROUTES, API_ROUTES } from '@/constants';
import { apiClient, queryKeys } from '@/lib';
import { TokenManager } from '@/features/auth/services/token-manager';

interface AuthContextValue {
  isAuthenticated: boolean;
  isLoading: boolean;
  isAuthLoading: boolean;
  logout: () => Promise<void>;
  error: Error | null;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const queryClient = useQueryClient();

  const [isRefreshingInitial, setIsRefreshingInitial] = useState(() => {
    if (typeof window === 'undefined') return false;
    const hasToken = !!TokenManager.getAccessToken();
    const isValid = TokenManager.isAccessTokenValid();
    return hasToken && !isValid;
  });

  const clearSession = useCallback(() => {
    TokenManager.clearTokens();
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const hasToken = !!TokenManager.getAccessToken();
    const isValid = TokenManager.isAccessTokenValid();
    if (hasToken && !isValid) {
      apiClient
        .refreshSession()
        .then((token) => {
          if (token) {
            TokenManager.setAccessToken(token);
            queryClient.invalidateQueries({ queryKey: queryKeys.auth.verify });
          } else {
            clearSession();
          }
        })
        .catch(() => {
          clearSession();
        })
        .finally(() => {
          setIsRefreshingInitial(false);
        });
    }
  }, [clearSession, queryClient]);

  const verifyTokenQuery = useQuery<ApiResponse<{ valid: boolean }>>({
    queryKey: queryKeys.auth.verify,
    queryFn: () => apiClient.get(API_ROUTES.verifyToken),
    retry: false,
    enabled: typeof window !== 'undefined' && TokenManager.isAccessTokenValid() && !isRefreshingInitial,
    staleTime: 1000 * 60 * 5,
  });

  const logoutMutation = useMutation({
    mutationFn: async () => {
      try {
        await apiClient.post<void>(API_ROUTES.logout);
      } catch {
        // Best-effort logout
      }
    },
    onSettled: () => {
      clearSession();
      if (typeof window !== 'undefined') {
        window.location.replace(ROUTES.login);
      } else {
        router.push(ROUTES.login);
      }
    },
  });

  const logout = useCallback(async () => {
    await logoutMutation.mutateAsync();
  }, [logoutMutation]);

  const hasToken = !!TokenManager.getAccessToken();
  const isValid = TokenManager.isAccessTokenValid();
  const isVerified = verifyTokenQuery.data?.data?.valid !== false;
  const isAuthenticated = hasToken && isValid && (verifyTokenQuery.data ? isVerified : true);

  const isAuthLoading = useMemo(() => {
    if (typeof window === 'undefined') return true;
    if (isRefreshingInitial) return true;
    return verifyTokenQuery.isLoading;
  }, [isRefreshingInitial, verifyTokenQuery.isLoading]);

  const isLoading = useMemo(() => {
    return isAuthLoading || logoutMutation.isPending;
  }, [isAuthLoading, logoutMutation.isPending]);

  const error = useMemo(() => {
    if (verifyTokenQuery.error) return verifyTokenQuery.error;
    if (logoutMutation.error) return logoutMutation.error;

    return null;
  }, [verifyTokenQuery.error, logoutMutation.error]);

  useEffect(() => {
    if (
      !isAuthLoading &&
      !isAuthenticated &&
      pathname !== ROUTES.login &&
      pathname !== ROUTES.register &&
      pathname !== ROUTES.forgotPassword &&
      pathname !== ROUTES.resetPassword &&
      pathname !== '/verify-email' &&
      pathname !== '/2fa'
    ) {
      if (typeof window !== 'undefined') {
        window.location.replace(ROUTES.login);
      } else {
        router.push(ROUTES.login);
      }
    }
  }, [isAuthenticated, isAuthLoading, pathname, router]);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleUnauthorized = () => {
      clearSession();
      window.location.replace(ROUTES.login);
    };

    window.addEventListener('auth:unauthorized', handleUnauthorized as EventListener);
    return () => {
      window.removeEventListener('auth:unauthorized', handleUnauthorized as EventListener);
    };
  }, [clearSession]);

  const value = useMemo<AuthContextValue>(
    () => ({
      isAuthenticated,
      isLoading,
      isAuthLoading,
      logout,
      error,
    }),
    [isAuthenticated, isLoading, isAuthLoading, logout, error],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
}
