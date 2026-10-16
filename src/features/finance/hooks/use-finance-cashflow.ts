'use client';

import { useQuery } from '@tanstack/react-query';

import { fetchFinanceCashflow } from '@/features/finance/services';
import { queryKeys } from '@/lib';
import type { FinanceCashflowPeriod } from '@/features/finance/types';

export function useFinanceCashflow(period: FinanceCashflowPeriod) {
  return useQuery({
    queryKey: queryKeys.finance.cashflow(period),
    queryFn: () => fetchFinanceCashflow(period),
  });
}
