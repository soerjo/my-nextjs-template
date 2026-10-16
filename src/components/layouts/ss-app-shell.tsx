'use client';

import * as React from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useTheme } from 'next-themes';
import { useLocale } from 'next-intl';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
  SidebarInset,
} from '@/components/ui/sidebar';
import { AppLink } from '@/components/ui';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Home,
  LayoutDashboard,
  SquareActivity,
  BarChart3,
  Package,
  Mail,
  CalendarClock,
  Upload,
  ClipboardList,
  Settings,
  Calendar,
  Users,
  FileText,
  PhoneCall,
  Briefcase,
  Users2,
  HelpCircle,
  Image as ImageIcon,
  Sun,
  Moon,
  LogOut,
  Bell,
  Search,
} from 'lucide-react';
import { useAuth } from '@/features/auth/hooks';

const OVERVIEW_ITEMS = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, badge: '5' },
  { href: '/dashboard-v2', label: 'Dashboard v2', icon: SquareActivity },
  { href: '/analytics', label: 'Analytics', icon: BarChart3 },
];

const APPS_ITEMS = [
  { href: '/products/new', label: 'Add Product', icon: Package },
  { href: '/email-application', label: 'Email App', icon: Mail },
  { href: '/schedule', label: 'Schedule', icon: CalendarClock },
  { href: '/file-upload', label: 'File Upload', icon: Upload },
  { href: '/form-layout', label: 'Form Layout', icon: ClipboardList },
  { href: '/account-settings', label: 'Account Settings', icon: Settings },
  { href: '/events', label: 'Events', icon: Calendar },
];

const MARKETING_ITEMS = [
  { href: '/about', label: 'About', icon: Users },
  { href: '/blog', label: 'Blog', icon: FileText },
  { href: '/contact', label: 'Contact', icon: PhoneCall },
  { href: '/portfolio', label: 'Portfolio', icon: Briefcase },
  { href: '/team', label: 'Team', icon: Users2 },
  { href: '/faq', label: 'FAQ', icon: HelpCircle },
  { href: '/gallery', label: 'Gallery', icon: ImageIcon },
];

export function SsAppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const locale = useLocale();
  const { logout, isLoading } = useAuth();
  const { resolvedTheme, setTheme } = useTheme();

  const switchLocale = (newLocale: string) => {
    document.cookie = `NEXT_LOCALE=${newLocale}; path=/; max-age=31536000; SameSite=Lax`;
    router.refresh();
  };

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background text-foreground">
        <Sidebar>
          <SidebarContent className="py-2">
            {/* Overview Group */}
            <SidebarGroup>
              <SidebarGroupLabel>Overview</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {OVERVIEW_ITEMS.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href;
                    return (
                      <SidebarMenuItem key={item.href}>
                        <SidebarMenuButton asChild isActive={isActive}>
                          <AppLink href={item.href}>
                            <Icon className="size-4" />
                            <span>{item.label}</span>
                          </AppLink>
                        </SidebarMenuButton>
                        {item.badge && (
                          <SidebarMenuBadge className="bg-primary/10 text-primary rounded-full">
                            {item.badge}
                          </SidebarMenuBadge>
                        )}
                      </SidebarMenuItem>
                    );
                  })}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            {/* Apps Group */}
            <SidebarGroup>
              <SidebarGroupLabel>Apps</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {APPS_ITEMS.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href;
                    return (
                      <SidebarMenuItem key={item.href}>
                        <SidebarMenuButton asChild isActive={isActive}>
                          <AppLink href={item.href}>
                            <Icon className="size-4" />
                            <span>{item.label}</span>
                          </AppLink>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    );
                  })}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            {/* Marketing Group */}
            <SidebarGroup>
              <SidebarGroupLabel>Marketing</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {MARKETING_ITEMS.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href;
                    return (
                      <SidebarMenuItem key={item.href}>
                        <SidebarMenuButton asChild isActive={isActive}>
                          <AppLink href={item.href}>
                            <Icon className="size-4" />
                            <span>{item.label}</span>
                          </AppLink>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    );
                  })}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>

        <SidebarInset className="flex flex-col flex-1 min-w-0">
          {/* Header */}
          <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-background/80 px-6 backdrop-blur-md">
            <div className="flex items-center gap-4">
              <SidebarTrigger className="[&_svg]:size-5!" />
              <Separator orientation="vertical" className="hidden h-4! sm:block" />
              <div className="hidden text-sm font-medium sm:block">
                {pathname === '/' ? 'Home' : pathname.replace('/', '').split('/')[0].toUpperCase()}
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="relative hidden lg:block w-64">
                <Search className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search pages..."
                  className="w-full rounded-full border border-border/60 bg-muted/40 py-1.5 pl-8 pr-4 text-xs focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              <Button
                variant="ghost"
                size="icon-sm"
                className="relative rounded-full text-muted-foreground hover:text-foreground"
              >
                <Bell className="size-4" />
                <span className="absolute top-1.5 right-1.5 size-2 rounded-full bg-lime" />
              </Button>

              <Button
                variant="ghost"
                size="icon-sm"
                onClick={() => switchLocale(locale === 'id' ? 'en' : 'id')}
                className="rounded-full text-muted-foreground hover:text-foreground text-xs font-semibold"
                title="Toggle Language"
              >
                {locale.toUpperCase()}
              </Button>

              <Button
                variant="ghost"
                size="icon-sm"
                onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
                className="rounded-full text-muted-foreground hover:text-foreground"
                aria-label="Toggle Theme"
              >
                <Sun className="size-4 dark:hidden" />
                <Moon className="hidden size-4 dark:block" />
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative size-8 rounded-full p-0">
                    <Avatar size="sm">
                      <AvatarImage src="" alt="User" />
                      <AvatarFallback className="bg-primary text-primary-foreground font-semibold text-xs">
                        MA
                      </AvatarFallback>
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
                      <Settings className="size-4" />
                      <span>Settings</span>
                    </AppLink>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    variant="destructive"
                    disabled={isLoading}
                    onClick={logout}
                    className="cursor-pointer"
                  >
                    <LogOut className="size-4 mr-2" />
                    <span>Logout</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </header>

          {/* Main content */}
          <main className="flex flex-1 flex-col">{children}</main>

          {/* Footer */}
          <footer className="border-t border-border py-4 px-6 text-center text-xs text-muted-foreground">
            © {new Date().getFullYear()} My App. Built with shadcn/ui & Tailwind CSS.
          </footer>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
