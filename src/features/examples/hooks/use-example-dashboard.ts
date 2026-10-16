'use client';

import { useQuery } from '@tanstack/react-query';

import { fetchExampleDashboard } from '@/features/examples/services';
import { queryKeys } from '@/lib';

export function useExampleDashboard() {
  return useQuery({
    queryKey: queryKeys.examples.dashboard(),
    queryFn: fetchExampleDashboard,
  });
}
