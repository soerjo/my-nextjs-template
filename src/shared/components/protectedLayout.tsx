'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import { useAuthenticationStore } from '../store/authentication';

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const { isLogin } = useAuthenticationStore();
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true); // Ensure client-side rendering
    if (isMounted && !isLogin) {
      router.replace('/login');
    }
  }, [isLogin, isMounted]);

  if (!isMounted || !isLogin) return null;

  return <>{children}</>;
}
