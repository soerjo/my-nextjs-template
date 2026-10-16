'use client';

import * as React from 'react';
import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useFinanceCategoryBreakdown } from '@/features/finance/hooks';

const SLICE_COLORS = ['var(--chart-1)', 'var(--chart-2)', 'var(--border)', 'var(--muted-foreground)', 'var(--primary)'];

interface DonutTooltipPayload {
  name?: string;
  value?: number;
  payload?: { fill?: string };
}

function CustomTooltip({ active, payload }: { active?: boolean; payload?: DonutTooltipPayload[] }) {
  if (!active || !payload || !payload.length) {
    return null;
  }

  const item = payload[0];

  return (
    <div className="rounded-xl bg-foreground px-3 py-1.5 text-xs text-background shadow-lg">
      <p className="font-medium">{item.name}</p>
      <p className="font-semibold">
        {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(Number(item.value ?? 0))}
      </p>
    </div>
  );
}

export function SpendingDonutChart() {
  const { data, isLoading } = useFinanceCategoryBreakdown();

  if (isLoading || !data) {
    return (
      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle className="text-base font-semibold">Spending by Category</CardTitle>
        </CardHeader>
        <CardContent className="flex h-72 items-center justify-center">
          <Skeleton className="h-48 w-48 rounded-full" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-border bg-card">
      <CardHeader>
        <CardTitle className="text-base font-semibold">Spending by Category</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={3}
                stroke="none"
              >
                {data.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={SLICE_COLORS[index % SLICE_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend
                verticalAlign="bottom"
                height={36}
                formatter={(value: string) => <span className="text-xs text-muted-foreground">{value}</span>}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
