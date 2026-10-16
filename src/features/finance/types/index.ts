export type FinanceDeltaType = 'positive' | 'negative' | 'neutral';

export type FinanceStatId = 'balance' | 'income' | 'expenses' | 'savings';

export interface FinanceStat {
  id: FinanceStatId;
  title: string;
  value: string;
  delta: string;
  deltaType: FinanceDeltaType;
}

export type FinanceWalletCategoryId = 'savings' | 'bills' | 'investments';

export interface FinanceWalletCategory {
  id: FinanceWalletCategoryId;
  label: string;
  amount: string;
}

export interface FinanceWallet {
  name: string;
  balance: string;
  isNew: boolean;
  categories: FinanceWalletCategory[];
}

export interface FinanceQuickSendContact {
  id: string;
  name: string;
  initials: string;
}

export interface FinanceBankCard {
  bank: string;
  maskedNumber: string;
  balance: string;
}

export interface FinanceDashboard {
  userName: string;
  wallet: FinanceWallet;
  stats: FinanceStat[];
  quickSend: FinanceQuickSendContact[];
  bankCard: FinanceBankCard;
}

export type FinanceCashflowPeriod = 'yearly' | 'monthly';

export type FinanceCashflowMetric = 'income' | 'expenses' | 'savings';

export interface FinanceCashflowPoint {
  label: string;
  income: number;
  expenses: number;
  savings: number;
}

export interface FinanceCashflow {
  period: FinanceCashflowPeriod;
  points: FinanceCashflowPoint[];
}

export type FinanceTransactionStatus = 'completed' | 'failed' | 'pending';

export type FinanceTransactionMonth = 'this-month' | 'last-month' | 'all';

export interface FinanceTransaction {
  id: string;
  name: string;
  type: string;
  date: string;
  time: string;
  amount: number;
  note: string;
  status: FinanceTransactionStatus;
}

export interface FinanceTransactionsParams {
  month: FinanceTransactionMonth;
  pageIndex: number;
  pageSize: number;
}

export interface FinanceTransactionsResult {
  rows: FinanceTransaction[];
  rowCount: number;
}

export interface FinanceCategorySlice {
  name: string;
  value: number;
}
