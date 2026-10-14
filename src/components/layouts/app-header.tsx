'use client';

import { Loader2, Menu, Moon, Sun, X, Languages } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { useTheme } from 'next-themes';
import { useTranslations, useLocale } from 'next-intl';

import { AppLink } from '@/components/ui';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/features/auth/hooks';
import { useIsMounted } from '@/hooks';
import { useAppStore } from '@/stores';
import { cn } from '@/utils';

export function AppHeader() {
  const t = useTranslations('navbar');
  const locale = useLocale();
  const router = useRouter();
  const { logout, isLoading } = useAuth();
  const { resolvedTheme, setTheme } = useTheme();
  const mounted = useIsMounted();
  const pathname = usePathname();
  const sidebarOpen = useAppStore((state) => state.sidebarOpen);
  const toggleSidebar = useAppStore((state) => state.toggleSidebar);

  const isDark = resolvedTheme === 'dark';

  const switchLocale = (newLocale: string) => {
    document.cookie = `NEXT_LOCALE=${newLocale}; path=/; max-age=31536000; SameSite=Lax`;
    router.refresh();
  };

  const EXAMPLES_NAV = [
    { href: '/examples/table', label: t('table') },
    { href: '/examples/dashboard', label: t('dashboard') },
    { href: '/examples/profile-form', label: t('profile') },
    { href: '/examples/upload', label: t('upload') },
  ] as const;

  const navLinkClass = (href: string) =>
    cn('text-sm', pathname === href ? 'font-medium text-foreground' : 'text-muted-foreground hover:text-foreground');

  return (
    <header className="border-b border-border">
      <div className="flex items-center justify-between gap-4 px-6 py-4">
        <AppLink className="text-lg font-semibold text-foreground" href="/">
          My App
        </AppLink>

        <nav aria-label="Main" className="hidden items-center gap-4 md:flex">
          <AppLink className={navLinkClass('/')} href="/">
            {t('home')}
          </AppLink>
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-muted-foreground">{t('examples')}</span>
            {EXAMPLES_NAV.map((item) => (
              <AppLink key={item.href} className={navLinkClass(item.href)} href={item.href}>
                {item.label}
              </AppLink>
            ))}
          </div>

          <Button
            aria-label={t('toggleLanguage')}
            size="sm"
            variant="ghost"
            onClick={() => switchLocale(locale === 'id' ? 'en' : 'id')}
          >
            <Languages className="mr-1 size-4" />
            {locale.toUpperCase()}
          </Button>

          <Button
            aria-label={t('toggleTheme')}
            disabled={!mounted}
            size="icon-sm"
            variant="ghost"
            onClick={() => setTheme(isDark ? 'light' : 'dark')}
          >
            {mounted && isDark ? <Moon /> : <Sun />}
          </Button>
          <Button disabled={isLoading} size="sm" variant="ghost" onClick={logout}>
            {isLoading ? <Loader2 className="animate-spin" /> : t('logout')}
          </Button>
        </nav>

        <div className="flex items-center gap-2 md:hidden">
          <Button
            aria-label={t('toggleLanguage')}
            size="icon-sm"
            variant="ghost"
            onClick={() => switchLocale(locale === 'id' ? 'en' : 'id')}
          >
            <Languages className="size-4" />
            <span className="sr-only">{locale.toUpperCase()}</span>
          </Button>
          <Button
            aria-label={t('toggleTheme')}
            disabled={!mounted}
            size="icon-sm"
            variant="ghost"
            onClick={() => setTheme(isDark ? 'light' : 'dark')}
          >
            {mounted && isDark ? <Moon /> : <Sun />}
          </Button>
          <Button
            aria-expanded={sidebarOpen}
            aria-label={t('toggleNavigation')}
            size="icon-sm"
            variant="ghost"
            onClick={toggleSidebar}
          >
            {sidebarOpen ? <X /> : <Menu />}
          </Button>
        </div>
      </div>

      {sidebarOpen && (
        <nav aria-label="Examples" className="border-t border-border px-6 py-3 md:hidden">
          <ul className="flex flex-col gap-3">
            <li>
              <AppLink className={navLinkClass('/')} href="/">
                {t('home')}
              </AppLink>
            </li>
            {EXAMPLES_NAV.map((item) => (
              <li key={item.href}>
                <AppLink className={navLinkClass(item.href)} href={item.href}>
                  {item.label}
                </AppLink>
              </li>
            ))}
            <li>
              <Button disabled={isLoading} size="sm" variant="ghost" onClick={logout}>
                {isLoading ? <Loader2 className="animate-spin" /> : t('logout')}
              </Button>
            </li>
          </ul>
        </nav>
      )}
    </header>
  );
}
