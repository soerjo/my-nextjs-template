'use client';

import { useQuery } from '@tanstack/react-query';

import { queryKeys } from '@/lib';
import { fetchFinanceCategoryBreakdown } from '@/features/finance/services';
import type { FinanceCategorySlice } from '@/features/finance/types';

export function useFinanceCategoryBreakdown() {
  return useQuery<FinanceCategorySlice[]>({
    queryKey: queryKeys.finance.breakdown(),
    queryFn: fetchFinanceCategoryBreakdown,
  });
}
