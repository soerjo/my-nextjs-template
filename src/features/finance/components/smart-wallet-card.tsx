import { PiggyBank, ReceiptText, TrendingUp, type LucideIcon } from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { FinanceWallet, FinanceWalletCategoryId } from '@/features/finance/types';

const CATEGORY_ICONS: Record<FinanceWalletCategoryId, LucideIcon> = {
  savings: PiggyBank,
  bills: ReceiptText,
  investments: TrendingUp,
};

export function SmartWalletCard({ wallet }: { wallet: FinanceWallet }) {
  return (
    <Card className="relative overflow-hidden">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>{wallet.name}</span>
          {wallet.isNew && <Badge className="bg-lime text-lime-foreground hover:bg-lime">+ Add New</Badge>}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-xs font-medium text-muted-foreground">Available balance</p>
        <p className="mt-1 text-3xl font-extrabold tracking-tight text-foreground">${wallet.balance}</p>

        <div className="mt-5 grid grid-cols-3 gap-3">
          {wallet.categories.map((category) => {
            const Icon = CATEGORY_ICONS[category.id];

            return (
              <div
                key={category.id}
                className="flex flex-col items-center gap-1.5 rounded-xl bg-muted/50 p-3 text-center ring-1 ring-border/60"
              >
                <div className="flex size-9 items-center justify-center rounded-lg bg-lime/20 text-primary">
                  <Icon className="size-4" />
                </div>
                <span className="text-[11px] font-medium text-muted-foreground">{category.label}</span>
                <span className="text-xs font-semibold text-foreground">${category.amount}</span>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
