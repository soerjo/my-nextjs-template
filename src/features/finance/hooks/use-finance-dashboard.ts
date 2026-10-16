'use client';

import { useQuery } from '@tanstack/react-query';

import { fetchFinanceDashboard } from '@/features/finance/services';
import { queryKeys } from '@/lib';

export function useFinanceDashboard() {
  return useQuery({
    queryKey: queryKeys.finance.dashboard(),
    queryFn: fetchFinanceDashboard,
  });
}
