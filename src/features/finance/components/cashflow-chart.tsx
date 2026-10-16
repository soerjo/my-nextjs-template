'use client';

import * as React from 'react';
import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { SegmentedTabs, Skeleton } from '@/components/ui';
import { useFinanceCashflow } from '@/features/finance/hooks';
import type { FinanceCashflowMetric, FinanceCashflowPeriod, FinanceCashflowPoint } from '@/features/finance/types';

const ACTIVE_BAR_COLOR = 'var(--chart-1)';
const IDLE_BAR_COLOR = 'var(--chart-2)';

const compactCurrency = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  notation: 'compact',
  maximumFractionDigits: 1,
});

const currency = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
});

const METRIC_TABS: { value: FinanceCashflowMetric; label: string }[] = [
  { value: 'income', label: 'Income' },
  { value: 'expenses', label: 'Expenses' },
  { value: 'savings', label: 'Savings' },
];

interface CashflowTooltipProps {
  active?: boolean;
  label?: string | number;
  payload?: { name?: string; value?: number | string; color?: string }[];
}

function CashflowTooltip({ active, label, payload }: CashflowTooltipProps) {
  if (!active || !payload?.length) {
    return null;
  }

  return (
    <div className="rounded-xl bg-foreground px-3 py-2 text-xs text-background shadow-lg">
      <p className="mb-1 font-semibold">{label}</p>
      {payload.map((entry) => (
        <p key={entry.name} className="flex items-center gap-2 capitalize">
          <span aria-hidden="true" className="size-2 rounded-full" style={{ backgroundColor: entry.color }} />
          <span>{entry.name}</span>
          <span className="ml-auto font-semibold">{currency.format(Number(entry.value))}</span>
        </p>
      ))}
    </div>
  );
}

export function CashflowChart() {
  const [metric, setMetric] = React.useState<FinanceCashflowMetric>('income');
  const [period, setPeriod] = React.useState<FinanceCashflowPeriod>('yearly');
  const [hoveredIndex, setHoveredIndex] = React.useState<number | null>(null);

  const { data, isLoading } = useFinanceCashflow(period);
  const points = React.useMemo<FinanceCashflowPoint[]>(() => data?.points ?? [], [data]);
  const activeIndex = hoveredIndex ?? points.length - 1;

  return (
    <Card>
      <CardHeader className="flex flex-row flex-wrap items-center justify-between gap-3">
        <CardTitle>Cash Flow</CardTitle>
        <div className="flex flex-wrap items-center gap-2">
          <SegmentedTabs
            tabs={METRIC_TABS}
            value={metric}
            onValueChange={(value) => setMetric(value as FinanceCashflowMetric)}
          />
          <Select value={period} onValueChange={(value) => setPeriod(value as FinanceCashflowPeriod)}>
            <SelectTrigger className="w-28">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="yearly">Yearly</SelectItem>
              <SelectItem value="monthly">Monthly</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full" onMouseLeave={() => setHoveredIndex(null)}>
          {isLoading ? (
            <Skeleton className="h-full w-full rounded-xl" />
          ) : (
            <ResponsiveContainer height="100%" width="100%">
              <BarChart data={points} margin={{ top: 8, right: 12, bottom: 0, left: 0 }}>
                <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" vertical={false} />
                <XAxis
                  axisLine={false}
                  dataKey="label"
                  tick={{ fill: 'var(--muted-foreground)', fontSize: 12 }}
                  tickLine={false}
                />
                <YAxis
                  axisLine={false}
                  tick={{ fill: 'var(--muted-foreground)', fontSize: 12 }}
                  tickFormatter={(value: number) => compactCurrency.format(value)}
                  tickLine={false}
                  width={56}
                />
                <Tooltip content={<CashflowTooltip />} cursor={{ fill: 'var(--muted)', opacity: 0.4 }} />
                <Bar
                  dataKey={metric}
                  name={metric}
                  radius={[6, 6, 0, 0]}
                  onMouseEnter={(_: unknown, index: number) => setHoveredIndex(index)}
                >
                  {points.map((point, index) => (
                    <Cell key={point.label} fill={index === activeIndex ? ACTIVE_BAR_COLOR : IDLE_BAR_COLOR} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
