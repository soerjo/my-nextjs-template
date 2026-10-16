import * as React from 'react';
import { cn } from '@/utils';

interface BalanceCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  amount: string;
  accountNumber?: string;
  badge?: React.ReactNode;
  footer?: React.ReactNode;
}

export function BalanceCard({
  title = 'Total Balance',
  amount,
  accountNumber,
  badge,
  footer,
  className,
  children,
  ...props
}: BalanceCardProps) {
  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-2xl bg-surface-inverse text-surface-inverse-foreground p-6 shadow-xl',
        className,
      )}
      {...props}
    >
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-surface-inverse-foreground/80">{title}</span>
        {badge}
      </div>
      <div className="mt-4">
        <h2 className="text-3xl font-extrabold tracking-tight">{amount}</h2>
        {accountNumber && (
          <p className="mt-1 font-mono text-xs tracking-wider text-surface-inverse-foreground/60">{accountNumber}</p>
        )}
      </div>
      {children && <div className="mt-6">{children}</div>}
      {footer && <div className="mt-6 pt-4 border-t border-surface-inverse-foreground/10">{footer}</div>}
    </div>
  );
}
