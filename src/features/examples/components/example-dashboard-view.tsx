'use client';

import * as React from 'react';
import { format } from 'date-fns';
import { Bar, BarChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

import { Skeleton } from '@/components/ui/skeleton';
import { useExampleDashboard } from '@/features/examples/hooks';
import type { DashboardPoint } from '@/features/examples/types';

const CHART_COLORS = {
  primary: 'var(--chart-1)',
  secondary: 'var(--chart-2)',
} as const;

const currency = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
});

const number = new Intl.NumberFormat('en-US');

function formatDayDate(value: string): string {
  return format(new Date(value), 'MMM d');
}

function formatDayFull(value: string): string {
  return format(new Date(value), 'PPPP');
}

interface DashboardTooltipProps {
  active?: boolean;
  label?: string | number;
  payload?: { name?: string; value?: number | string; color?: string }[];
  valueFormatter: (value: number) => string;
}

function DashboardTooltip({ active, label, payload, valueFormatter }: DashboardTooltipProps) {
  if (!active || !payload?.length) {
    return null;
  }

  return (
    <div className="rounded-md border border-border bg-popover px-3 py-2 text-xs shadow-md">
      <p className="mb-1 font-medium text-popover-foreground">{label ? formatDayFull(String(label)) : ''}</p>
      <ul className="space-y-0.5">
        {payload.map((entry) => (
          <li key={entry.name} className="flex items-center gap-2 text-muted-foreground">
            <span aria-hidden="true" className="size-2 rounded-full" style={{ backgroundColor: entry.color }} />
            <span className="capitalize">{entry.name}</span>
            <span className="font-medium text-popover-foreground">{valueFormatter(Number(entry.value))}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function ChartSkeleton() {
  return (
    <div className="space-y-3">
      <Skeleton className="h-5 w-40" />
      <Skeleton className="h-[280px] w-full" />
    </div>
  );
}

function SummarySkeleton() {
  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {Array.from({ length: 3 }).map((_, index) => (
        <div key={index} className="rounded-md border border-border bg-card p-4">
          <Skeleton className="mb-2 h-4 w-24" />
          <Skeleton className="h-7 w-32" />
        </div>
      ))}
    </div>
  );
}

export function ExampleDashboardView() {
  const { data, isLoading } = useExampleDashboard();
  const points = React.useMemo<DashboardPoint[]>(() => data?.points ?? [], [data]);

  const summary = data?.summary;

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Analytics Dashboard</h1>
          <p className="text-sm text-muted-foreground">
            Line and bar charts powered by Recharts with mock data via React Query.
          </p>
        </div>
        <SummarySkeleton />
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-md border border-border bg-card p-4">
            <ChartSkeleton />
          </div>
          <div className="rounded-md border border-border bg-card p-4">
            <ChartSkeleton />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Analytics Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          Line and bar charts powered by Recharts with mock data via React Query.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-md border border-border bg-card p-4">
          <p className="text-sm text-muted-foreground">Total Revenue</p>
          <p className="mt-1 text-2xl font-semibold text-foreground">{currency.format(summary?.totalRevenue ?? 0)}</p>
        </div>
        <div className="rounded-md border border-border bg-card p-4">
          <p className="text-sm text-muted-foreground">Total Orders</p>
          <p className="mt-1 text-2xl font-semibold text-foreground">{number.format(summary?.totalOrders ?? 0)}</p>
        </div>
        <div className="rounded-md border border-border bg-card p-4">
          <p className="text-sm text-muted-foreground">Avg. Order Value</p>
          <p className="mt-1 text-2xl font-semibold text-foreground">
            {currency.format(summary?.averageOrderValue ?? 0)}
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-md border border-border bg-card p-4">
          <div className="mb-4">
            <h2 className="text-base font-semibold text-foreground">Revenue</h2>
            <p className="text-sm text-muted-foreground">Daily revenue over the last 30 days</p>
          </div>
          <div className="h-[280px] w-full">
            <ResponsiveContainer height="100%" width="100%">
              <LineChart data={points} margin={{ top: 8, right: 12, bottom: 0, left: 0 }}>
                <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" vertical={false} />
                <XAxis
                  axisLine={false}
                  dataKey="date"
                  minTickGap={24}
                  tick={{ fill: 'var(--muted-foreground)', fontSize: 12 }}
                  tickFormatter={formatDayDate}
                  tickLine={false}
                />
                <YAxis
                  axisLine={false}
                  tick={{ fill: 'var(--muted-foreground)', fontSize: 12 }}
                  tickFormatter={(value: number) => currency.format(value)}
                  tickLine={false}
                  width={72}
                />
                <Tooltip content={<DashboardTooltip valueFormatter={(value) => currency.format(value)} />} />
                <Line
                  dataKey="revenue"
                  dot={false}
                  name="Revenue"
                  stroke={CHART_COLORS.primary}
                  strokeWidth={2}
                  type="monotone"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-md border border-border bg-card p-4">
          <div className="mb-4">
            <h2 className="text-base font-semibold text-foreground">Orders</h2>
            <p className="text-sm text-muted-foreground">Daily orders over the last 30 days</p>
          </div>
          <div className="h-[280px] w-full">
            <ResponsiveContainer height="100%" width="100%">
              <BarChart data={points} margin={{ top: 8, right: 12, bottom: 0, left: 0 }}>
                <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" vertical={false} />
                <XAxis
                  axisLine={false}
                  dataKey="date"
                  minTickGap={24}
                  tick={{ fill: 'var(--muted-foreground)', fontSize: 12 }}
                  tickFormatter={formatDayDate}
                  tickLine={false}
                />
                <YAxis
                  axisLine={false}
                  tick={{ fill: 'var(--muted-foreground)', fontSize: 12 }}
                  tickFormatter={(value: number) => number.format(value)}
                  tickLine={false}
                  width={48}
                />
                <Tooltip
                  content={<DashboardTooltip valueFormatter={(value) => number.format(value)} />}
                  cursor={{ fill: 'var(--muted)', opacity: 0.4 }}
                />
                <Bar dataKey="orders" fill={CHART_COLORS.secondary} name="Orders" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
