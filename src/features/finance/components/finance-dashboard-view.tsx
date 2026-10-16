'use client';

import { Wallet, ArrowDownLeft, ArrowUpRight, PiggyBank } from 'lucide-react';

import { StatCard } from '@/components/ui';
import { useFinanceDashboard } from '@/features/finance/hooks';
import { SmartWalletCard } from './smart-wallet-card';
import { QuickSend } from './quick-send';
import { BankCard } from './bank-card';
import { QuickActions } from './quick-actions';
import { StarterPlanCard } from './starter-plan-card';
import { CashflowChart } from './cashflow-chart';
import { FinanceDashboardSkeleton } from './finance-dashboard-skeleton';

const STAT_ICONS = {
  balance: Wallet,
  income: ArrowDownLeft,
  expenses: ArrowUpRight,
  savings: PiggyBank,
};

export function FinanceDashboardView() {
  const { data, isLoading, error } = useFinanceDashboard();

  if (isLoading) {
    return <FinanceDashboardSkeleton />;
  }

  if (error || !data) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center">
        <h3 className="text-lg font-semibold text-destructive">Failed to load dashboard</h3>
        <p className="text-sm text-muted-foreground mt-1">Please try refreshing the page.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Greeting Header */}
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          Good morning, {data.userName} 👋
        </h1>
        <p className="text-sm text-muted-foreground">Here is your financial overview and quick actions for today.</p>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left Column (2 cols) */}
        <div className="flex flex-col gap-6 lg:col-span-2">
          {/* Smart Wallet Card */}
          <SmartWalletCard wallet={data.wallet} />

          {/* 4 Stat Cards */}
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

          {/* Cash Flow Chart */}
          <CashflowChart />
        </div>

        {/* Right Column (1 col) */}
        <div className="flex flex-col gap-6">
          <QuickSend contacts={data.quickSend} />
          <BankCard card={data.bankCard} />
          <QuickActions />
          <StarterPlanCard />
        </div>
      </div>
    </div>
  );
}
