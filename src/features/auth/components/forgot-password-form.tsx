'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';

import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { forgotPasswordSchema, type ForgotPasswordFormValues } from '@/features/auth/types';
import { useForgotPassword } from '@/features/auth/hooks';
import { AppLink } from '@/components/ui';
import { useIsMounted } from '@/hooks';
import { ROUTES } from '@/constants';

export function ForgotPasswordForm() {
  const { forgotPassword, isLoading, error } = useForgotPassword();
  const mounted = useIsMounted();
  const [isSuccess, setIsSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: '',
    },
  });

  async function onSubmit(data: ForgotPasswordFormValues) {
    try {
      await forgotPassword(data);
      setIsSuccess(true);
    } catch {}
  }

  if (isSuccess) {
    return (
      <Card className="w-full max-w-md">
        <CardHeader className="flex flex-col items-center gap-2 pb-2">
          <svg
            className="text-primary"
            fill="none"
            height="48"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.5"
            viewBox="0 0 24 24"
            width="48"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
            <polyline points="22 4 12 14.01 9 11.01" />
          </svg>
          <h1 className="text-2xl font-bold">Check Your Email</h1>
          <p className="text-center text-sm text-muted-foreground">
            We&apos;ve sent a password reset link to your email address.
          </p>
        </CardHeader>

        <CardContent>
          <p className="text-center text-sm text-muted-foreground">
            <AppLink className="font-medium text-primary" href={ROUTES.login}>
              Back to login
            </AppLink>
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="flex flex-col items-center gap-2 pb-2">
        <svg
          className="text-muted-foreground"
          fill="none"
          height="48"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.5"
          viewBox="0 0 24 24"
          width="48"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect height="11" rx="2" ry="2" width="18" x="3" y="11" />
          <path d="M7 11V7a5 5 0 0 1 10 0v4" />
        </svg>
        <h1 className="text-2xl font-bold">Forgot Password</h1>
        <p className="text-center text-sm text-muted-foreground">Enter your email to receive a password reset link</p>
      </CardHeader>

      <CardContent>
        <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
          {error && (
            <div
              className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive"
              role="alert"
            >
              {error.message || 'Failed to send reset link. Please try again.'}
            </div>
          )}

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="email">
              Email <span className="text-destructive">*</span>
            </Label>
            <Input
              aria-invalid={Boolean(errors.email)}
              id="email"
              placeholder="Enter your email"
              type="email"
              {...register('email')}
            />
            {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
          </div>

          <Button className="w-full" disabled={mounted ? Boolean(isLoading) : false} type="submit">
            {mounted && isLoading ? (
              <>
                <Loader2 className="animate-spin" />
                Sending...
              </>
            ) : (
              'Send Reset Link'
            )}
          </Button>

          <p className="text-center text-sm text-muted-foreground">
            Remember your password?{' '}
            <AppLink className="font-medium text-primary" href={ROUTES.login}>
              Back to login
            </AppLink>
          </p>
        </form>
      </CardContent>
    </Card>
  );
}
