export const queryKeys = {
  home: {
    all: ["home"] as const,
  },
  auth: {
    verify: ["auth", "verify"] as const,
  },
  users: {
    all: ["users"] as const,
    list: ["users", "list"] as const,
  },
} as const;
