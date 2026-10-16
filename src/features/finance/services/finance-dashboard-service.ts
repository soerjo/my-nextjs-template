import type { FinanceDashboard } from '@/features/finance/types';

const NETWORK_DELAY_MS = 500;

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function fetchFinanceDashboard(): Promise<FinanceDashboard> {
  await delay(NETWORK_DELAY_MS);

  return {
    userName: 'Jordan',
    wallet: {
      name: 'Smart Wallet',
      balance: '12,480.75',
      isNew: true,
      categories: [
        { id: 'savings', label: 'Savings', amount: '5,200.00' },
        { id: 'bills', label: 'Bills', amount: '1,840.00' },
        { id: 'investments', label: 'Investments', amount: '3,150.00' },
      ],
    },
    stats: [
      { id: 'balance', title: 'Total Balance', value: '$12,480.75', delta: '+4.5%', deltaType: 'positive' },
      { id: 'income', title: 'Income', value: '$8,320.00', delta: '+12.4%', deltaType: 'positive' },
      { id: 'expenses', title: 'Expenses', value: '$3,675.40', delta: '-3.1%', deltaType: 'negative' },
      { id: 'savings', title: 'Savings', value: '$5,200.00', delta: '+8.2%', deltaType: 'positive' },
    ],
    quickSend: [
      { id: 'qs-1', name: 'Arlene McCoy', initials: 'AM' },
      { id: 'qs-2', name: 'Devon Lane', initials: 'DL' },
      { id: 'qs-3', name: 'Courtney Henry', initials: 'CH' },
      { id: 'qs-4', name: 'Darlene Robertson', initials: 'DR' },
      { id: 'qs-5', name: 'Jacob Jones', initials: 'JJ' },
    ],
    bankCard: {
      bank: 'Horizon Bank',
      maskedNumber: '•••• •••• •••• 4382',
      balance: '$8,920.10',
    },
  };
}
