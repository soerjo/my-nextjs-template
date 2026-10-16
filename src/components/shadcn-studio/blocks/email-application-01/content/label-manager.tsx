import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

// Data Imports
import {
  MAIL_LABEL_NAV_ITEMS,
  MAIL_LABEL_STYLES,
} from '@/components/shadcn-studio/blocks/email-application-01/email-application-01';

// Type Imports
import type { EmailLabel } from '@/components/shadcn-studio/blocks/email-application-01/email-application-01';

// Util Imports
import { cn } from '@/utils/index';
import { TagIcon, CheckIcon } from 'lucide-react';

const LabelManager = ({ labels }: { labels: EmailLabel[] }) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" title="Manage labels">
          <TagIcon className="size-4" />
          <span className="sr-only">Manage labels</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className="flex w-40 flex-col gap-1 p-1">
        {MAIL_LABEL_NAV_ITEMS.map((labelItem) => {
          const labelStyle = MAIL_LABEL_STYLES.find((labelStyleItem) => labelStyleItem.id === labelItem.id);
          const isActive = labels.includes(labelItem.id);

          return (
            <Button
              key={labelItem.id}
              type="button"
              variant="ghost"
              size="sm"
              title={labelItem.label}
              className="w-full justify-start gap-2"
            >
              <span className={cn('size-2.5 shrink-0 rounded-full', labelStyle?.color)} />
              <span className="flex-1 text-left">{labelItem.label}</span>
              {isActive && <CheckIcon className="size-4 shrink-0" />}
            </Button>
          );
        })}
      </PopoverContent>
    </Popover>
  );
};

export default LabelManager;
