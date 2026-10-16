import { ArrowDownToLine, ArrowRightLeft, Wifi } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { BalanceCard } from '@/components/ui';
import type { FinanceBankCard as FinanceBankCardData } from '@/features/finance/types';

export function BankCard({ card }: { card: FinanceBankCardData }) {
  return (
    <BalanceCard
      title={card.bank}
      amount={card.balance}
      accountNumber={card.maskedNumber}
      badge={<Wifi className="size-4 rotate-90 text-surface-inverse-foreground/60" />}
      footer={
        <div className="flex gap-3">
          <Button className="flex-1 bg-lime text-lime-foreground hover:bg-lime/90">
            <ArrowDownToLine data-icon="inline-start" />
            Deposit
          </Button>
          <Button
            variant="outline"
            className="flex-1 border-surface-inverse-foreground/20 bg-transparent text-surface-inverse-foreground hover:bg-surface-inverse-foreground/10 hover:text-surface-inverse-foreground"
          >
            <ArrowRightLeft data-icon="inline-start" />
            Transfer
          </Button>
        </div>
      }
    />
  );
}
