'use client';

import * as React from 'react';
import { Wallet, ArrowDownLeft, ArrowUpRight, PiggyBank } from 'lucide-react';

import { BalanceCard } from '@/components/ui/balance-card';
import { StatCard } from '@/components/ui/stat-card';
import { CashflowChart } from '@/features/finance/components/cashflow-chart';
import { FinanceDashboardSkeleton } from '@/features/finance/components/finance-dashboard-skeleton';
import { RecentTransactionsTable } from '@/features/finance/components/recent-transactions-table';
import { SpendingDonutChart } from '@/features/finance/components/spending-donut-chart';
import { useFinanceDashboard } from '@/features/finance/hooks';

const STAT_ICONS = {
  balance: Wallet,
  income: ArrowDownLeft,
  expenses: ArrowUpRight,
  savings: PiggyBank,
};

export function AnalyticsView() {
  const { data, isLoading } = useFinanceDashboard();

  if (isLoading || !data) {
    return <FinanceDashboardSkeleton />;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Analytics &amp; Transactions</h1>
        <p className="text-sm text-muted-foreground">Comprehensive financial insights, cash flow, and activity logs.</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {data.stats.map((stat) => {
          const Icon = STAT_ICONS[stat.id] || Wallet;

          return (
            <StatCard
              key={stat.id}
              title={stat.title}
              value={stat.value}
              delta={stat.delta}
              deltaType={stat.deltaType}
              icon={Icon}
            />
          );
        })}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <CashflowChart />
        </div>
        <div className="space-y-6">
          <BalanceCard
            title="Account Balance"
            amount={data.bankCard.balance}
            accountNumber={data.bankCard.maskedNumber}
          />
          <SpendingDonutChart />
        </div>
      </div>

      <RecentTransactionsTable />
    </div>
  );
}
