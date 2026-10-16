import { Sparkles } from 'lucide-react';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export function StarterPlanCard() {
  return (
    <Card className="relative overflow-hidden bg-primary text-primary-foreground">
      <div className="absolute top-0 right-0 -mr-6 -mt-6 size-24 rounded-full bg-lime/20 blur-xl" />
      <CardContent className="p-6">
        <div className="flex items-center gap-2">
          <div className="flex size-8 items-center justify-center rounded-lg bg-lime text-lime-foreground">
            <Sparkles className="size-4" />
          </div>
          <span className="text-xs font-semibold uppercase tracking-wider text-lime">Starter Plan</span>
        </div>
        <h4 className="mt-3 text-lg font-bold">Unlock Advanced Analytics</h4>
        <p className="mt-1 text-xs text-primary-foreground/80">
          Get deeper insights into your cash flow, budgeting goals, and custom savings milestones.
        </p>
        <Button className="mt-5 w-full bg-lime text-lime-foreground hover:bg-lime/90 font-semibold">
          Upgrade to Pro
        </Button>
      </CardContent>
    </Card>
  );
}
