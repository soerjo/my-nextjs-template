import type {
  FinanceTransaction,
  FinanceTransactionMonth,
  FinanceTransactionsParams,
  FinanceTransactionsResult,
} from '@/features/finance/types';

const TOTAL_RECORDS = 64;
const NETWORK_DELAY_MS = 450;
const DAY_IN_MS = 24 * 60 * 60 * 1000;

const VENDORS = [
  'Stripe Payout',
  'Spotify',
  'Amazon',
  'Salary · Acme Inc',
  'Uber',
  'Netflix',
  'Grocery Mart',
  'City Electric',
  'Transfer to Savings',
  'Freelance Client',
  'Coffee Bean',
  'FitLife Gym',
] as const;

const TYPES = ['Income', 'Expense', 'Transfer', 'Payment'] as const;

const NOTES = [
  'Monthly subscription',
  'Online order',
  'Monthly payroll',
  'Ride fare',
  'Utility bill',
  'Savings goal',
  'Invoice #2043',
  'Weekly groceries',
] as const;

const STATUSES: FinanceTransaction['status'][] = ['completed', 'completed', 'completed', 'pending', 'failed'];

interface RandomSource {
  (): number;
}

function createSeededRandom(seed: number): RandomSource {
  let state = seed;

  return () => {
    state |= 0;
    state = (state + 0x6d2b79f5) | 0;

    let value = Math.imul(state ^ (state >>> 15), 1 | state);
    value = (value + Math.imul(value ^ (value >>> 7), 61 | value)) ^ value;

    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  };
}

function pick<T>(items: readonly T[], random: RandomSource): T {
  return items[Math.floor(random() * items.length)];
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function createMockTransactions(count: number): FinanceTransaction[] {
  const random = createSeededRandom(20240918);
  const now = new Date();

  return Array.from({ length: count }, (_, index) => {
    const type = pick(TYPES, random);
    const dayOffset = Math.floor(random() * 80);
    const date = new Date(now.getTime() - dayOffset * DAY_IN_MS);

    date.setHours(Math.floor(random() * 23), Math.floor(random() * 59), 0, 0);

    const magnitude = Math.round((20 + random() * 1_480) * 100) / 100;
    const isIncome = type === 'Income';
    const amount = isIncome ? magnitude : -magnitude;

    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');

    return {
      id: `TRX-${(index + 1).toString().padStart(4, '0')}`,
      name: pick(VENDORS, random),
      type,
      date: date.toISOString(),
      time: `${hours}:${minutes}`,
      amount,
      note: pick(NOTES, random),
      status: pick(STATUSES, random),
    };
  }).sort((a, b) => b.date.localeCompare(a.date));
}

const ALL_TRANSACTIONS = createMockTransactions(TOTAL_RECORDS);

function matchesMonth(transaction: FinanceTransaction, month: FinanceTransactionMonth): boolean {
  if (month === 'all') {
    return true;
  }

  const date = new Date(transaction.date);
  const now = new Date();

  if (month === 'this-month') {
    return date.getFullYear() === now.getFullYear() && date.getMonth() === now.getMonth();
  }

  const previousMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);

  return date.getFullYear() === previousMonth.getFullYear() && date.getMonth() === previousMonth.getMonth();
}

export async function fetchFinanceTransactions(params: FinanceTransactionsParams): Promise<FinanceTransactionsResult> {
  const { month, pageIndex, pageSize } = params;

  await delay(NETWORK_DELAY_MS);

  const filtered = ALL_TRANSACTIONS.filter((transaction) => matchesMonth(transaction, month));
  const start = pageIndex * pageSize;

  return {
    rows: filtered.slice(start, start + pageSize),
    rowCount: filtered.length,
  };
}
