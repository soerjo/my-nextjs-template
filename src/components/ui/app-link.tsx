'use client';

import type { ReactNode } from 'react';

import Link from 'next/link';

import { cn } from '@/utils';

type AppLinkProps = {
  href: string;
  children: ReactNode;
  className?: string;
  isExternal?: boolean;
};

export function AppLink({ href, children, className, isExternal = false }: AppLinkProps) {
  if (isExternal) {
    return (
      <a className={cn('transition-colors', className)} href={href} rel="noopener noreferrer" target="_blank">
        {children}
      </a>
    );
  }

  return (
    <Link className={cn('transition-colors', className)} href={href}>
      {children}
    </Link>
  );
}
