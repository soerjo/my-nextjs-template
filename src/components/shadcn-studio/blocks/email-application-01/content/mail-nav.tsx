import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

// Data Imports
import { MAIL_LABEL_STYLES } from '@/components/shadcn-studio/blocks/email-application-01/email-application-01';

// Type Imports
import type {
  EmailLabel,
  EmailStatus,
  MailNavLabelItemWithCount,
  MailNavStatusItemWithCount,
  MailNavType,
} from '@/components/shadcn-studio/blocks/email-application-01/email-application-01';

// Util Imports
import { cn } from '@/utils/index';
import { InboxIcon, SendIcon, FileIcon, ArchiveXIcon, TrashIcon, ArchiveIcon } from 'lucide-react';

const renderStatusIcon = (status: EmailStatus) => {
  switch (status) {
    case 'inbox':
      return <InboxIcon className="size-4 shrink-0 opacity-70" />;
    case 'sent':
      return <SendIcon className="size-4 shrink-0 opacity-70" />;
    case 'drafts':
      return <FileIcon className="size-4 shrink-0 opacity-70" />;
    case 'spam':
      return <ArchiveXIcon className="size-4 shrink-0 opacity-70" />;
    case 'trash':
      return <TrashIcon className="size-4 shrink-0 opacity-70" />;
    case 'archive':
      return <ArchiveIcon className="size-4 shrink-0 opacity-70" />;
  }
};

const MailNav = ({
  statusNavItems,
  labelNavItems,
  activeStatus,
  activeLabel,
  activeNavType,
  onStatusChange,
  onLabelChange,
}: {
  statusNavItems: MailNavStatusItemWithCount[];
  labelNavItems: MailNavLabelItemWithCount[];
  activeStatus: EmailStatus;
  activeLabel: EmailLabel | null;
  activeNavType: MailNavType;
  onStatusChange: (status: EmailStatus) => void;
  onLabelChange: (label: EmailLabel) => void;
}) => {
  return (
    <div className="flex flex-1 flex-col gap-4 overflow-auto p-3 max-lg:pt-0">
      <div>
        <p className="text-muted-foreground px-2 pb-2.5 text-[11px] font-medium uppercase">Mailboxes</p>
        <nav className="grid gap-1">
          {statusNavItems.map((statusItem) => {
            const isStatusActive = activeNavType === 'status' && activeStatus === statusItem.id;

            return (
              <Tooltip key={statusItem.id}>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    className={cn(
                      'justify-start gap-2.5 px-3',
                      isStatusActive
                        ? 'bg-accent text-accent-foreground hover:bg-accent hover:text-accent-foreground'
                        : 'text-foreground/80 hover:bg-muted/60',
                    )}
                    onClick={() => onStatusChange(statusItem.id)}
                  >
                    {renderStatusIcon(statusItem.id)}
                    {statusItem.label}
                    {statusItem.count > 0 && (
                      <span className="text-muted-foreground ml-auto text-xs tabular-nums">{statusItem.count}</span>
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="right" className="flex items-center gap-2">
                  {statusItem.label}
                  {statusItem.count > 0 && <span className="text-primary-foreground ml-auto">{statusItem.count}</span>}
                </TooltipContent>
              </Tooltip>
            );
          })}
        </nav>
      </div>

      <Separator />

      <div>
        <p className="text-muted-foreground px-2 pb-2.5 text-[11px] font-medium uppercase">Labels</p>
        <nav className="grid gap-1">
          {labelNavItems.map((labelItem) => {
            const labelStyle = MAIL_LABEL_STYLES.find((labelStyleItem) => labelStyleItem.id === labelItem.id);
            const isLabelActive = activeNavType === 'label' && activeLabel === labelItem.id;

            return (
              <Tooltip key={labelItem.id}>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    className={cn(
                      'justify-start gap-2.5 px-3',
                      isLabelActive
                        ? 'bg-accent text-accent-foreground hover:bg-accent hover:text-accent-foreground'
                        : 'text-foreground/80 hover:bg-muted/60',
                    )}
                    onClick={() => onLabelChange(labelItem.id)}
                  >
                    <span className={cn('size-2 shrink-0 rounded-full', labelStyle?.color)} />
                    {labelItem.label}
                    {labelItem.count > 0 && (
                      <span className="text-muted-foreground ml-auto text-xs tabular-nums">{labelItem.count}</span>
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="right" className="flex items-center gap-2">
                  {labelItem.label}
                  {labelItem.count > 0 && <span className="text-primary-foreground ml-auto">{labelItem.count}</span>}
                </TooltipContent>
              </Tooltip>
            );
          })}
        </nav>
      </div>
    </div>
  );
};

export default MailNav;
