import * as React from 'react';
import { cn } from '@/utils';
import { Card, CardContent } from '@/components/ui/card';
import { TrendingUp, TrendingDown, type LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string;
  delta?: string;
  deltaType?: 'positive' | 'negative' | 'neutral';
  icon?: LucideIcon;
  className?: string;
}

export function StatCard({ title, value, delta, deltaType = 'positive', icon: Icon, className }: StatCardProps) {
  return (
    <Card className={cn('overflow-hidden', className)}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          {Icon && (
            <div className="rounded-lg bg-muted p-2 text-muted-foreground">
              <Icon className="size-4" />
            </div>
          )}
        </div>
        <div className="mt-3 flex items-baseline justify-between">
          <h3 className="text-2xl font-bold tracking-tight text-foreground">{value}</h3>
          {delta && (
            <div
              className={cn(
                'inline-flex items-center gap-1 text-xs font-semibold',
                deltaType === 'positive' && 'text-primary',
                deltaType === 'negative' && 'text-destructive',
                deltaType === 'neutral' && 'text-muted-foreground',
              )}
            >
              {deltaType === 'positive' && <TrendingUp className="size-3.5" />}
              {deltaType === 'negative' && <TrendingDown className="size-3.5" />}
              <span>{delta}</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
