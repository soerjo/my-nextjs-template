import { Send, Receipt, WalletCards, QrCode, type LucideIcon } from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface QuickAction {
  id: string;
  label: string;
  icon: LucideIcon;
}

const QUICK_ACTIONS: QuickAction[] = [
  { id: 'send', label: 'Send Money', icon: Send },
  { id: 'bills', label: 'Pay Bills', icon: Receipt },
  { id: 'topup', label: 'Top Up', icon: WalletCards },
  { id: 'scan', label: 'Scan QR', icon: QrCode },
];

export function QuickActions() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Action</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-4 gap-3 max-sm:grid-cols-2">
          {QUICK_ACTIONS.map((action) => {
            const Icon = action.icon;

            return (
              <button
                key={action.id}
                type="button"
                className="flex flex-col items-center gap-2 rounded-xl bg-muted/50 p-3 text-muted-foreground ring-1 ring-border/60 transition-colors hover:bg-lime/20 hover:text-primary hover:ring-primary/30"
              >
                <div className="flex size-9 items-center justify-center rounded-lg bg-background">
                  <Icon className="size-4" />
                </div>
                <span className="text-[11px] font-medium">{action.label}</span>
              </button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
