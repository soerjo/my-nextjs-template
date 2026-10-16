'use client';

import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { queryKeys } from '@/lib';
import { fetchExampleTable } from '@/features/examples/services';
import type { TableQueryParams } from '@/features/examples/types';

export function useExampleTable(params: TableQueryParams) {
  return useQuery({
    queryKey: queryKeys.examples.table(params),
    queryFn: () => fetchExampleTable(params),
    placeholderData: keepPreviousData,
  });
}
