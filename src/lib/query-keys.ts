export const queryKeys = {
  home: {
    all: ['home'] as const,
  },
  auth: {
    all: ['auth'] as const,
    verify: ['auth', 'verify'] as const,
    logout: ['auth', 'logout'] as const,
  },
  finance: {
    all: ['finance'] as const,
    dashboard: () => ['finance', 'dashboard'] as const,
    cashflow: (period: 'yearly' | 'monthly') => ['finance', 'cashflow', period] as const,
    breakdown: () => ['finance', 'breakdown'] as const,
    transactions: (params: { month: string; pageIndex: number; pageSize: number }) =>
      ['finance', 'transactions', params] as const,
  },
  examples: {
    all: ['examples'] as const,
    dashboard: () => ['examples', 'dashboard'] as const,
    table: (params: { pageIndex: number; pageSize: number; sorting: unknown }) =>
      ['examples', 'table', params] as const,
    profileForm: () => ['examples', 'profile-form'] as const,
    upload: () => ['examples', 'upload'] as const,
  },
} as const;
