'use client';

// React Imports
import { useCallback, useMemo, useState } from 'react';

// Third-party Imports
import { format, formatDistanceToNow, isToday, isYesterday } from 'date-fns';

// Component Imports
import { Button } from '@/components/ui/button';
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/input-group';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable';
import { Separator } from '@/components/ui/separator';
import { Sheet, SheetContent, SheetDescription, SheetTitle } from '@/components/ui/sheet';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import MailNav from '@/components/shadcn-studio/blocks/email-application-01/content/mail-nav';
import MailList from '@/components/shadcn-studio/blocks/email-application-01/content/mail-list';
import MailDisplay from '@/components/shadcn-studio/blocks/email-application-01/content/mail-display';

// Util Imports
import { cn } from '@/utils/index';
import { MailIcon, SearchIcon, ArrowDownUpIcon, MenuIcon, ChevronLeftIcon } from 'lucide-react';

export type ThreadMessage = {
  id: string;
  from: string;
  fromEmail: string;
  body: string;
  date: Date;
  isFromMe?: boolean;
};

export type EmailLabel = 'social' | 'updates' | 'forums' | 'shopping' | 'promotions';

export type EmailStatus = 'inbox' | 'sent' | 'drafts' | 'spam' | 'trash' | 'archive';

export type Email = {
  id: string;
  from: string;
  fromEmail: string;
  to?: string;
  toEmail?: string;
  avatar?: string;
  subject: string;
  preview: string;
  body: string;
  date: Date;
  isRead: boolean;
  isStarred: boolean;
  labels: EmailLabel[];
  status: EmailStatus;
  thread: {
    messages: ThreadMessage[];
  };
};

export type MailFilterTab = 'all' | 'unread';
export type MailNavType = 'status' | 'label';

export type MailNavStatusItem = { id: EmailStatus; label: string };
export type MailNavLabelItem = { id: EmailLabel; label: string };
export type MailNavLabelStyle = MailNavLabelItem & { color: string };
export type MailNavStatusItemWithCount = MailNavStatusItem & { count: number };
export type MailNavLabelItemWithCount = MailNavLabelItem & { count: number };

export const MAIL_CURRENT_USER = {
  name: 'You',
  email: 'you@example.com',
  avatar: undefined as string | undefined,
};

export const MAIL_STATUS_NAV_ITEMS: MailNavStatusItem[] = [
  { id: 'inbox', label: 'Inbox' },
  { id: 'drafts', label: 'Drafts' },
  { id: 'sent', label: 'Sent' },
  { id: 'spam', label: 'Spam' },
  { id: 'trash', label: 'Trash' },
  { id: 'archive', label: 'Archive' },
];

export const MAIL_LABEL_NAV_ITEMS: MailNavLabelItem[] = [
  { id: 'social', label: 'Social' },
  { id: 'updates', label: 'Updates' },
  { id: 'forums', label: 'Forums' },
  { id: 'shopping', label: 'Shopping' },
  { id: 'promotions', label: 'Promotions' },
];

export const MAIL_LABEL_STYLES: MailNavLabelStyle[] = [
  { id: 'social', label: 'Social', color: 'bg-violet-500' },
  { id: 'updates', label: 'Updates', color: 'bg-teal-500' },
  { id: 'forums', label: 'Forums', color: 'bg-orange-500' },
  { id: 'shopping', label: 'Shopping', color: 'bg-lime-500' },
  { id: 'promotions', label: 'Promotions', color: 'bg-pink-500' },
];

export const getInitialsFromName = (name: string) =>
  name
    .split(' ')
    .map((namePart) => namePart[0])
    .join('');

export const formatMailDate = (date: Date) => {
  const diffMs = Date.now() - date.getTime();

  if (diffMs < 60_000) return 'Just now';
  if (isToday(date)) return formatDistanceToNow(date, { addSuffix: true }).replace(/^about /, '');
  if (isYesterday(date)) return 'Yesterday';

  return format(date, 'MMM d');
};

const useMailApp = (initialEmails: Email[]) => {
  // States
  const [emails] = useState<Email[]>(initialEmails);
  const [selectedEmailId, setSelectedEmailId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeStatus, setActiveStatus] = useState<EmailStatus>('inbox');
  const [activeLabel, setActiveLabel] = useState<EmailLabel | null>(null);
  const [activeNavType, setActiveNavType] = useState<MailNavType>('status');
  const [filterTab, setFilterTab] = useState<MailFilterTab>('all');

  const statusCounts = useMemo(() => {
    const counts: Record<EmailStatus, number> = {
      inbox: 0,
      sent: 0,
      drafts: 0,
      spam: 0,
      trash: 0,
      archive: 0,
    };

    for (const email of emails) {
      counts[email.status] += 1;
    }

    return counts;
  }, [emails]);

  const labelCounts = useMemo(() => {
    const counts: Record<EmailLabel, number> = {
      social: 0,
      updates: 0,
      forums: 0,
      shopping: 0,
      promotions: 0,
    };

    for (const email of emails) {
      if (email.status === 'inbox') {
        for (const label of email.labels) {
          counts[label] += 1;
        }
      }
    }

    return counts;
  }, [emails]);

  const filteredEmails = useMemo(() => {
    const normalizedSearchQuery = searchQuery.trim().toLowerCase();

    return emails.filter((email) => {
      if (activeNavType === 'label') {
        if (email.status !== 'inbox' || !activeLabel || !email.labels.includes(activeLabel)) {
          return false;
        }
      } else if (email.status !== activeStatus) {
        return false;
      }

      if (!normalizedSearchQuery) {
        return true;
      }

      return (
        email.subject.toLowerCase().includes(normalizedSearchQuery) ||
        email.from.toLowerCase().includes(normalizedSearchQuery) ||
        email.preview.toLowerCase().includes(normalizedSearchQuery) ||
        email.body.toLowerCase().includes(normalizedSearchQuery)
      );
    });
  }, [activeLabel, activeNavType, activeStatus, emails, searchQuery]);

  const visibleEmails = useMemo(() => {
    if (filterTab === 'unread') {
      return filteredEmails.filter((email) => !email.isRead);
    }

    return filteredEmails;
  }, [filterTab, filteredEmails]);

  const selectedEmail = useMemo(() => {
    if (selectedEmailId) {
      const selectedEmail = emails.find((email) => email.id === selectedEmailId);

      if (selectedEmail && visibleEmails.some((email) => email.id === selectedEmail.id)) {
        return selectedEmail;
      }
    }

    return visibleEmails[0] ?? null;
  }, [emails, selectedEmailId, visibleEmails]);

  const unreadCount = useMemo(() => filteredEmails.filter((email) => !email.isRead).length, [filteredEmails]);

  const handleStatusChange = useCallback((status: EmailStatus) => {
    setActiveNavType('status');
    setActiveStatus(status);
    setActiveLabel(null);
    setSelectedEmailId(null);
  }, []);

  const handleLabelChange = useCallback((label: EmailLabel) => {
    setActiveNavType('label');
    setActiveLabel(label);
    setSelectedEmailId(null);
  }, []);

  const handleEmailSelect = useCallback((email: Email) => {
    setSelectedEmailId(email.id);
  }, []);

  return {
    activeStatus,
    activeLabel,
    activeNavType,
    filterTab,
    searchQuery,
    statusCounts,
    labelCounts,
    visibleEmails,
    selectedEmail,
    unreadCount,
    setFilterTab,
    setSearchQuery,
    handleStatusChange,
    handleLabelChange,
    handleEmailSelect,
  };
};

const EmailApplication01 = ({ mailData }: { mailData: Email[] }) => {
  // States
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [mobileView, setMobileView] = useState<'list' | 'detail'>('list');

  // Hooks
  const {
    activeStatus,
    activeLabel,
    activeNavType,
    filterTab,
    searchQuery,
    statusCounts,
    labelCounts,
    visibleEmails,
    selectedEmail,
    unreadCount,
    setFilterTab,
    setSearchQuery,
    handleStatusChange,
    handleLabelChange,
    handleEmailSelect,
  } = useMailApp(mailData);

  const statusNavItems = useMemo(
    () =>
      MAIL_STATUS_NAV_ITEMS.map((statusItem) => ({
        ...statusItem,
        count: statusCounts[statusItem.id],
      })),
    [statusCounts],
  );

  const labelNavItems = useMemo(
    () =>
      MAIL_LABEL_NAV_ITEMS.map((labelItem) => ({
        ...labelItem,
        count: labelCounts[labelItem.id],
      })),
    [labelCounts],
  );

  const activeViewLabel = useMemo(() => {
    if (activeNavType === 'label' && activeLabel) {
      return MAIL_LABEL_NAV_ITEMS.find((labelItem) => labelItem.id === activeLabel)?.label ?? 'Mail';
    }

    return statusNavItems.find((statusItem) => statusItem.id === activeStatus)?.label ?? 'Mail';
  }, [activeLabel, activeNavType, activeStatus, statusNavItems]);

  const handleEmailSelectWithMobile = (email: Email) => {
    handleEmailSelect(email);
    setMobileView('detail');
  };

  return (
    <section className="p-3 2xl:py-16">
      <div className="mx-auto max-w-7xl 2xl:px-6">
        <div className="flex h-[calc(100dvh-12rem)] min-h-225 flex-col sm:h-[calc(100dvh-11rem)] 2xl:min-h-200">
          {/* Desktop layout */}
          <div className="hidden h-full lg:flex">
            <ResizablePanelGroup
              orientation="horizontal"
              className="border-border bg-background h-full items-stretch overflow-hidden rounded-lg border"
            >
              <ResizablePanel defaultSize="15%" minSize="14%" className="bg-card flex flex-col">
                <div className="p-3">
                  <Button className="w-full">
                    <MailIcon className="mr-2 size-4" />
                    Compose
                  </Button>
                </div>
                <Separator />
                <MailNav
                  statusNavItems={statusNavItems}
                  labelNavItems={labelNavItems}
                  activeStatus={activeStatus}
                  activeLabel={activeLabel}
                  activeNavType={activeNavType}
                  onStatusChange={handleStatusChange}
                  onLabelChange={handleLabelChange}
                />
              </ResizablePanel>
              <ResizableHandle withHandle />
              <ResizablePanel
                defaultSize="30%"
                minSize="24%"
                className="bg-background flex min-h-0 flex-col overflow-hidden!"
              >
                <Tabs
                  value={filterTab}
                  onValueChange={(value) => setFilterTab(value as typeof filterTab)}
                  className="flex min-h-0 flex-1 flex-col gap-3"
                >
                  <div className="flex items-center gap-3 p-3 pb-0">
                    <h1 className="text-xl font-bold">{activeViewLabel}</h1>
                    <TabsList className="bg-muted/60 ml-auto">
                      <TabsTrigger value="all" className="font-normal">
                        All mail
                      </TabsTrigger>
                      <TabsTrigger value="unread" className="font-normal">
                        Unread{unreadCount > 0 ? ` (${unreadCount})` : ''}
                      </TabsTrigger>
                    </TabsList>
                  </div>
                  <Separator />
                  <div className="flex items-center gap-2 px-3">
                    <InputGroup className="relative flex-1">
                      <InputGroupAddon>
                        <SearchIcon className="size-4" />
                        <span className="sr-only">Search</span>
                      </InputGroupAddon>
                      <InputGroupInput
                        type="search"
                        placeholder="Search mail"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="[&::-webkit-search-cancel-button]:appearance-none [&::-webkit-search-decoration]:appearance-none [&::-webkit-search-results-button]:appearance-none [&::-webkit-search-results-decoration]:appearance-none"
                      />
                    </InputGroup>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="icon" className="shrink-0">
                          <ArrowDownUpIcon className="size-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>Default order</DropdownMenuItem>
                        <DropdownMenuItem>Newest first</DropdownMenuItem>
                        <DropdownMenuItem>Oldest first</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  <TabsContent value="all" className="m-0 flex min-h-0 flex-1 flex-col">
                    <MailList
                      emails={visibleEmails}
                      selectedEmailId={selectedEmail?.id ?? null}
                      onEmailSelect={handleEmailSelectWithMobile}
                    />
                  </TabsContent>
                  <TabsContent value="unread" className="m-0 flex min-h-0 flex-1 flex-col">
                    <MailList
                      emails={visibleEmails}
                      selectedEmailId={selectedEmail?.id ?? null}
                      onEmailSelect={handleEmailSelectWithMobile}
                    />
                  </TabsContent>
                </Tabs>
              </ResizablePanel>
              <ResizableHandle withHandle />
              <ResizablePanel defaultSize="55%" minSize="37%" className="bg-background flex min-h-0 flex-col">
                <MailDisplay email={selectedEmail} />
              </ResizablePanel>
            </ResizablePanelGroup>
          </div>
          {/* Mobile layout */}
          <div className="border-border flex h-full flex-col overflow-hidden rounded-lg border lg:hidden">
            {mobileView === 'list' && (
              <div className="flex h-full flex-col">
                <div className="border-border flex items-center gap-2 border-b px-3 py-2">
                  <button
                    type="button"
                    className="hover:bg-muted rounded-md p-1.5"
                    onClick={() => setIsMobileSidebarOpen(true)}
                  >
                    <MenuIcon className="size-5" />
                  </button>
                  <h1 className="flex-1 text-lg font-semibold">{activeViewLabel}</h1>
                  <div className="bg-muted/60 flex gap-1 rounded-md p-1">
                    <button
                      type="button"
                      onClick={() => setFilterTab('all')}
                      className={cn(
                        'rounded-md px-3 py-1 text-sm font-medium transition-colors',
                        filterTab === 'all' ? 'bg-foreground text-background' : 'text-muted-foreground hover:bg-muted',
                      )}
                    >
                      All
                    </button>
                    <button
                      type="button"
                      onClick={() => setFilterTab('unread')}
                      className={cn(
                        'rounded-md px-3 py-1 text-sm font-medium transition-colors',
                        filterTab === 'unread'
                          ? 'bg-foreground text-background'
                          : 'text-muted-foreground hover:bg-muted',
                      )}
                    >
                      Unread {unreadCount > 0 ? `(${unreadCount})` : ''}
                    </button>
                  </div>
                </div>
                <div className="flex gap-2 p-3">
                  <InputGroup className="relative flex-1">
                    <InputGroupAddon>
                      <SearchIcon className="size-4" />
                      <span className="sr-only">Search</span>
                    </InputGroupAddon>
                    <InputGroupInput
                      type="search"
                      placeholder="Search mail"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="[&::-webkit-search-cancel-button]:appearance-none [&::-webkit-search-decoration]:appearance-none [&::-webkit-search-results-button]:appearance-none [&::-webkit-search-results-decoration]:appearance-none"
                    />
                  </InputGroup>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="icon" className="shrink-0">
                        <ArrowDownUpIcon className="size-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>Default order</DropdownMenuItem>
                      <DropdownMenuItem>Newest first</DropdownMenuItem>
                      <DropdownMenuItem>Oldest first</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <MailList
                  emails={visibleEmails}
                  selectedEmailId={selectedEmail?.id ?? null}
                  onEmailSelect={handleEmailSelectWithMobile}
                />
              </div>
            )}
            {mobileView === 'detail' && (
              <div className="relative flex h-full flex-col">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute top-1.5 left-2 p-0 lg:hidden"
                  onClick={() => setMobileView('list')}
                >
                  <ChevronLeftIcon className="size-4" />
                  {activeViewLabel}
                </Button>
                <MailDisplay email={selectedEmail} />
              </div>
            )}
          </div>
        </div>
        <Sheet open={isMobileSidebarOpen} onOpenChange={setIsMobileSidebarOpen}>
          <SheetContent side="left" showCloseButton={false}>
            <SheetTitle className="sr-only">Mailboxes</SheetTitle>
            <SheetDescription className="sr-only">Compose a new email or browse mailboxes and labels.</SheetDescription>
            <div className="border-border border-b p-3">
              <Button className="w-full">
                <MailIcon />
                Compose
              </Button>
            </div>
            <MailNav
              statusNavItems={statusNavItems}
              labelNavItems={labelNavItems}
              activeStatus={activeStatus}
              activeLabel={activeLabel}
              activeNavType={activeNavType}
              onStatusChange={(status) => {
                handleStatusChange(status);
                setIsMobileSidebarOpen(false);
                setMobileView('list');
              }}
              onLabelChange={(label) => {
                handleLabelChange(label);
                setIsMobileSidebarOpen(false);
                setMobileView('list');
              }}
            />
          </SheetContent>
        </Sheet>
      </div>
    </section>
  );
};

export default EmailApplication01;
