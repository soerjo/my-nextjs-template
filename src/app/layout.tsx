import type { Metadata } from 'next';

import { Geist, Geist_Mono } from 'next/font/google';
import { getLocale } from 'next-intl/server';

import { defaultLocale } from '@/i18n/request';
import { Providers } from '@/providers';

import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: process.env.NEXT_PUBLIC_APP_NAME ?? 'My App',
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  let locale: string = defaultLocale;

  try {
    locale = await getLocale();
  } catch {
    // Fallback during static generation or when outside request context
  }

  return (
    <html suppressHydrationWarning className="h-full antialiased" lang={locale}>
      <body className={`${geistSans.variable} ${geistMono.variable} min-h-full flex flex-col`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
