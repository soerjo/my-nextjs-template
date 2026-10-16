'use client';

import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { queryKeys } from '@/lib';
import { fetchFinanceTransactions } from '@/features/finance/services';
import type { FinanceTransactionsParams, FinanceTransactionsResult } from '@/features/finance/types';

export function useFinanceTransactions(params: FinanceTransactionsParams) {
  return useQuery<FinanceTransactionsResult>({
    queryKey: queryKeys.finance.transactions(params),
    queryFn: () => fetchFinanceTransactions(params),
    placeholderData: keepPreviousData,
  });
}
