'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';

import { useAuthenticaitionStore } from '../store/authentication';

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const { isLogin } = useAuthenticaitionStore();
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = Cookies.get('token');

    if (!token) {
      router.replace('/login'); // Redirect immediately
    } else {
      setLoading(false); // Allow page to render
    }
  }, [isLogin]);

  if (loading) return null; // Prevent rendering before redirect

  return <>{children}</>;
}
