import { ThemeProvider } from 'next-themes';
import { AbstractIntlMessages, NextIntlClientProvider } from 'next-intl';
import { getLocale, getMessages } from 'next-intl/server';

import { TooltipProvider } from '@/components/ui/tooltip';
import { AuthProvider } from '@/features/auth/providers/auth-provider';
import { AppStoreProvider } from '@/stores';
import defaultMessages from '@/i18n/messages/id.json';

import { QueryProvider } from './query-provider';
import { ToasterProvider } from './toaster-provider';

export async function Providers({ children }: { children: React.ReactNode }) {
  let locale = 'id';
  let messages: AbstractIntlMessages = defaultMessages;

  try {
    locale = await getLocale();
    messages = await getMessages();
  } catch {
    // Fallback during static generation or when outside request context
  }

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <ThemeProvider disableTransitionOnChange enableSystem attribute="class" defaultTheme="system">
        <AppStoreProvider>
          <QueryProvider>
            <AuthProvider>
              <TooltipProvider>{children}</TooltipProvider>
            </AuthProvider>
          </QueryProvider>
          <ToasterProvider />
        </AppStoreProvider>
      </ThemeProvider>
    </NextIntlClientProvider>
  );
}
