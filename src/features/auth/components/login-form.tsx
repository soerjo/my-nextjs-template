'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';

import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { loginSchema, type LoginFormValues } from '@/features/auth/types';
import { useLogin } from '@/features/auth/hooks';
import { AppLink, PasswordInput } from '@/components/ui';
import { useIsMounted } from '@/hooks';
import { ROUTES } from '@/constants';

export function LoginForm() {
  const { login, isLoading, error } = useLogin();
  const mounted = useIsMounted();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  async function onSubmit(data: LoginFormValues) {
    await login(data);
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
          <circle cx="12" cy="12" r="10" />
          <path d="M2 12h20" />
          <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
        </svg>
        <h1 className="text-2xl font-bold">Sign In</h1>
        <p className="text-sm text-muted-foreground">Enter your credentials to continue</p>
      </CardHeader>

      <CardContent>
        <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
          {error && (
            <div
              className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive"
              role="alert"
            >
              {error.message || 'Login failed. Please try again.'}
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

          <div className="flex flex-col gap-1.5">
            <PasswordInput
              required
              error={errors.password?.message}
              label="Password"
              name="password"
              placeholder="Enter your password"
              register={register}
            />
          </div>

          <div className="flex items-center justify-between">
            <AppLink className="text-xs text-primary" href={ROUTES.forgotPassword}>
              Forgot password?
            </AppLink>
          </div>

          <Button className="w-full" disabled={mounted ? Boolean(isLoading) : false} type="submit">
            {mounted && isLoading ? (
              <>
                <Loader2 className="animate-spin" />
                Signing in...
              </>
            ) : (
              'Sign In'
            )}
          </Button>

          <p className="text-center text-sm text-muted-foreground">
            Don&apos;t have an account?{' '}
            <AppLink className="font-medium text-primary" href={ROUTES.register}>
              Create one
            </AppLink>
          </p>
        </form>
      </CardContent>
    </Card>
  );
}
