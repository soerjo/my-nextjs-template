import type { FinanceCashflow, FinanceCashflowPeriod, FinanceCashflowPoint } from '@/features/finance/types';

const NETWORK_DELAY_MS = 500;

const MONTH_LABELS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function createSeededRandom(seed: number): () => number {
  let state = seed;

  return () => {
    state |= 0;
    state = (state + 0x6d2b79f5) | 0;

    let value = Math.imul(state ^ (state >>> 15), 1 | state);
    value = (value + Math.imul(value ^ (value >>> 7), 61 | value)) ^ value;

    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  };
}

function createYearlyPoints(): FinanceCashflowPoint[] {
  const random = createSeededRandom(20240101);

  return MONTH_LABELS.map((label) => {
    const income = Math.round(5_200 + random() * 4_800);
    const expenses = Math.round(2_400 + random() * 2_600);
    const savings = Math.max(400, Math.round(income - expenses - random() * 800));

    return { label, income, expenses, savings };
  });
}

function createMonthlyPoints(): FinanceCashflowPoint[] {
  const random = createSeededRandom(20240215);

  return Array.from({ length: 30 }, (_, index) => {
    const income = Math.round(180 + random() * 420);
    const expenses = Math.round(80 + random() * 260);
    const savings = Math.max(20, Math.round(income - expenses - random() * 60));

    return { label: String(index + 1), income, expenses, savings };
  });
}

export async function fetchFinanceCashflow(period: FinanceCashflowPeriod): Promise<FinanceCashflow> {
  await delay(NETWORK_DELAY_MS);

  return {
    period,
    points: period === 'yearly' ? createYearlyPoints() : createMonthlyPoints(),
  };
}
