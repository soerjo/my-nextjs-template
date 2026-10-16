import { Plus, Send } from 'lucide-react';

import { AppLink } from '@/components/ui';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import type { FinanceQuickSendContact } from '@/features/finance/types';

interface QuickSendProps {
  contacts: FinanceQuickSendContact[];
}

export function QuickSend({ contacts }: QuickSendProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Quick Send</span>
          <Button variant="ghost" size="icon-sm" className="rounded-full text-muted-foreground">
            <Send className="size-4" />
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap items-center gap-3">
          {contacts.map((contact) => (
            <div key={contact.id} className="flex w-14 flex-col items-center gap-1">
              <Avatar size="lg" className="ring-2 ring-border">
                <AvatarFallback className="bg-primary/10 text-xs font-semibold text-primary">
                  {contact.initials}
                </AvatarFallback>
              </Avatar>
              <span className="w-full truncate text-center text-[11px] text-muted-foreground">
                {contact.name.split(' ')[0]}
              </span>
            </div>
          ))}
          <div className="flex w-14 flex-col items-center gap-1">
            <AppLink
              href="/dashboard"
              className="flex size-10 items-center justify-center rounded-full border border-dashed border-border text-muted-foreground transition-colors hover:border-primary hover:text-primary"
            >
              <Plus className="size-4" />
              <span className="sr-only">Add contact</span>
            </AppLink>
            <span className="w-full truncate text-center text-[11px] text-muted-foreground">Add</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
