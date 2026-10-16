'use client';

import * as React from 'react';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, BarChart3, Package, FileText, Settings, HelpCircle, LogOut } from 'lucide-react';

import { cn } from '@/utils';
import { AppLink } from '@/components/ui';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { useAuth } from '@/features/auth/hooks';
import { useAppStore } from '@/stores';

const NAV_ITEMS = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/analytics', label: 'Analytics', icon: BarChart3 },
  { href: '/products/new', label: 'New Product', icon: Package },
  { href: '/examples/table', label: 'Examples', icon: FileText },
];

export function AppSidebar() {
  const pathname = usePathname();
  const { logout, isLoading } = useAuth();
  const sidebarOpen = useAppStore((state) => state.sidebarOpen);
  const setSidebarOpen = useAppStore((state) => state.setSidebarOpen);

  const sidebarContent = (isMobile = false) => (
    <div className="flex h-full flex-col justify-between py-4">
      <div className="flex flex-col items-center gap-6">
        {/* Avatar top */}
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <AppLink
                href="/dashboard"
                className="rounded-full ring-2 ring-primary/20 transition-all hover:ring-primary"
              >
                <Avatar size={isMobile ? 'default' : 'sm'}>
                  <AvatarImage src="" alt="User" />
                  <AvatarFallback className="bg-primary text-primary-foreground font-bold">MA</AvatarFallback>
                </Avatar>
              </AppLink>
            </TooltipTrigger>
            {!isMobile && <TooltipContent side="right">My Account</TooltipContent>}
          </Tooltip>
        </TooltipProvider>

        {/* Main Nav Rail */}
        <nav className="flex flex-col items-center gap-2">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
            const linkContent = (
              <AppLink
                key={item.href}
                href={item.href}
                className={cn(
                  'flex size-10 items-center justify-center rounded-xl transition-all',
                  isActive
                    ? 'bg-lime text-lime-foreground shadow-sm font-semibold'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                )}
              >
                <Icon className="size-5" />
                <span className={cn(isMobile ? 'ml-3 text-sm font-medium' : 'sr-only')}>{item.label}</span>
              </AppLink>
            );

            if (isMobile) {
              return (
                <div
                  key={item.href}
                  className="w-full"
                  onClick={() => setSidebarOpen(false)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      setSidebarOpen(false);
                    }
                  }}
                  role="button"
                  tabIndex={0}
                >
                  {linkContent}
                </div>
              );
            }

            return (
              <TooltipProvider key={item.href}>
                <Tooltip>
                  <TooltipTrigger asChild>{linkContent}</TooltipTrigger>
                  <TooltipContent side="right">{item.label}</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            );
          })}
        </nav>
      </div>

      {/* Bottom Rail Actions */}
      <div className="flex flex-col items-center gap-3">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <AppLink
                href="/dashboard"
                className="flex size-10 items-center justify-center rounded-xl text-muted-foreground hover:bg-muted hover:text-foreground transition-all"
              >
                <Settings className="size-5" />
                {isMobile && <span className="ml-3 text-sm font-medium">Settings</span>}
              </AppLink>
            </TooltipTrigger>
            {!isMobile && <TooltipContent side="right">Settings</TooltipContent>}
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <AppLink
                href="/dashboard"
                className="flex size-10 items-center justify-center rounded-xl text-muted-foreground hover:bg-muted hover:text-foreground transition-all"
              >
                <HelpCircle className="size-5" />
                {isMobile && <span className="ml-3 text-sm font-medium">Help & Support</span>}
              </AppLink>
            </TooltipTrigger>
            {!isMobile && <TooltipContent side="right">Help</TooltipContent>}
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                disabled={isLoading}
                onClick={logout}
                className={cn(
                  'size-10 rounded-xl text-muted-foreground hover:bg-destructive/10 hover:text-destructive',
                  isMobile && 'w-full justify-start px-3 h-10',
                )}
              >
                <LogOut className="size-5" />
                {isMobile && <span className="ml-3 text-sm font-medium">Logout</span>}
              </Button>
            </TooltipTrigger>
            {!isMobile && <TooltipContent side="right">Logout</TooltipContent>}
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Icon Rail Sidebar */}
      <aside className="hidden md:flex fixed inset-y-0 left-0 z-30 w-16 flex-col items-center border-r border-border bg-background">
        {sidebarContent(false)}
      </aside>

      {/* Mobile Sidebar Sheet */}
      <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <SheetContent side="left" className="w-64 p-4">
          <SheetHeader className="px-2">
            <SheetTitle className="text-left font-bold">My App Dashboard</SheetTitle>
          </SheetHeader>
          <div className="mt-4 px-2">{sidebarContent(true)}</div>
        </SheetContent>
      </Sheet>
    </>
  );
}
