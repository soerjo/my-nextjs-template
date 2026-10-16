'use client';

import * as React from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useTheme } from 'next-themes';
import { useLocale } from 'next-intl';
import { Search, Bell, Sun, Moon, Menu, User, Settings, LogOut } from 'lucide-react';

import { cn } from '@/utils';
import { AppLink } from '@/components/ui';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAuth } from '@/features/auth/hooks';
import { useIsMounted } from '@/hooks';
import { useAppStore } from '@/stores';

export function DashboardHeader() {
  const locale = useLocale();
  const router = useRouter();
  const { logout, isLoading } = useAuth();
  const { resolvedTheme, setTheme } = useTheme();
  const mounted = useIsMounted();
  const pathname = usePathname();
  const toggleSidebar = useAppStore((state) => state.toggleSidebar);

  const isDark = resolvedTheme === 'dark';

  const switchLocale = (newLocale: string) => {
    document.cookie = `NEXT_LOCALE=${newLocale}; path=/; max-age=31536000; SameSite=Lax`;
    router.refresh();
  };

  const PILL_NAV = [
    { href: '/dashboard', label: 'Dashboard' },
    { href: '/analytics', label: 'Analytics' },
    { href: '/products/new', label: 'Products' },
    { href: '/examples/dashboard', label: 'Examples' },
  ];

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-border bg-background/80 px-6 backdrop-blur-md md:pl-24">
      {/* Left: Mobile Toggle + Pill Nav */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={toggleSidebar}
          className="md:hidden"
          aria-label="Toggle Sidebar"
        >
          <Menu className="size-5" />
        </Button>

        {/* Pill Nav */}
        <nav aria-label="Dashboard Pill Nav" className="hidden items-center gap-1 rounded-full bg-muted/60 p-1 md:flex">
          {PILL_NAV.map((item) => {
            const isActive = pathname === item.href;
            return (
              <AppLink
                key={item.href}
                href={item.href}
                className={cn(
                  'rounded-full px-4 py-1.5 text-xs font-medium transition-all',
                  isActive ? 'bg-background text-foreground shadow-xs' : 'text-muted-foreground hover:text-foreground',
                )}
              >
                {item.label}
              </AppLink>
            );
          })}
        </nav>
      </div>

      {/* Right: Search, Notifications, Theme/Lang, Avatar Dropdown */}
      <div className="flex items-center gap-3">
        {/* Search input */}
        <div className="relative hidden lg:block w-64">
          <Search className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search transactions, products..."
            className="pl-8 bg-muted/40 border-border/60 rounded-full h-9 text-xs"
          />
        </div>

        {/* Bell / Notifications */}
        <Button
          variant="ghost"
          size="icon-sm"
          className="relative rounded-full text-muted-foreground hover:text-foreground"
        >
          <Bell className="size-4" />
          <span className="absolute top-1.5 right-1.5 size-2 rounded-full bg-lime" />
        </Button>

        {/* Language Switcher */}
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={() => switchLocale(locale === 'id' ? 'en' : 'id')}
          className="rounded-full text-muted-foreground hover:text-foreground text-xs font-semibold"
          title="Toggle Language"
        >
          {locale.toUpperCase()}
        </Button>

        {/* Theme Toggle */}
        <Button
          variant="ghost"
          size="icon-sm"
          disabled={!mounted}
          onClick={() => setTheme(isDark ? 'light' : 'dark')}
          className="rounded-full text-muted-foreground hover:text-foreground"
          aria-label="Toggle Theme"
        >
          {mounted && isDark ? <Moon className="size-4" /> : <Sun className="size-4" />}
        </Button>

        {/* Avatar Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative size-8 rounded-full p-0">
              <Avatar size="sm">
                <AvatarImage src="" alt="User" />
                <AvatarFallback className="bg-primary text-primary-foreground font-semibold text-xs">MA</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">My Account</p>
                <p className="text-xs leading-none text-muted-foreground">user@example.com</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <AppLink href="/dashboard" className="flex items-center gap-2 cursor-pointer w-full">
                <User className="size-4" />
                <span>Profile</span>
              </AppLink>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <AppLink href="/dashboard" className="flex items-center gap-2 cursor-pointer w-full">
                <Settings className="size-4" />
                <span>Settings</span>
              </AppLink>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem variant="destructive" disabled={isLoading} onClick={logout} className="cursor-pointer">
              <LogOut className="size-4 mr-2" />
              <span>Logout</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
