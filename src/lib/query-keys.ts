export const queryKeys = {
  home: {
    all: ['home'] as const,
  },
  auth: {
    all: ['auth'] as const,
    verify: ['auth', 'verify'] as const,
    logout: ['auth', 'logout'] as const,
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
