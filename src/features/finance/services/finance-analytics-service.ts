import type { FinanceCategorySlice } from '@/features/finance/types';

const NETWORK_DELAY_MS = 500;

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const BREAKDOWN: FinanceCategorySlice[] = [
  { name: 'Housing', value: 1_850 },
  { name: 'Groceries', value: 720 },
  { name: 'Transport', value: 430 },
  { name: 'Entertainment', value: 310 },
  { name: 'Utilities', value: 245 },
];

export async function fetchFinanceCategoryBreakdown(): Promise<FinanceCategorySlice[]> {
  await delay(NETWORK_DELAY_MS);

  return BREAKDOWN;
}
