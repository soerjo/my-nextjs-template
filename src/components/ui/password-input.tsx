'use client';

import type { UseFormRegister } from 'react-hook-form';

import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

/* eslint-disable @typescript-eslint/no-explicit-any */
interface PasswordInputProps {
  name: string;
  label: string;
  register: UseFormRegister<any>;
  placeholder?: string;
  error?: string;
  description?: string;
  required?: boolean;
}

export function PasswordInput({
  name,
  label,
  register,
  placeholder = 'Enter password',
  error,
  description,
  required,
}: PasswordInputProps) {
  const [showPassword, setShowPassword] = useState(false);
  const invalid = Boolean(error);

  return (
    <div className="flex w-full flex-col gap-1.5">
      <Label htmlFor={name}>
        {label}
        {required ? <span className="text-destructive">*</span> : null}
      </Label>
      <div className="relative">
        <Input
          aria-invalid={invalid}
          className="pr-11"
          id={name}
          placeholder={placeholder}
          type={showPassword ? 'text' : 'password'}
          {...register(name)}
        />
        <Button
          aria-label={showPassword ? 'Hide password' : 'Show password'}
          className="absolute top-1/2 right-1 -translate-y-1/2 text-muted-foreground"
          size="icon-sm"
          type="button"
          variant="ghost"
          onClick={() => setShowPassword((visible) => !visible)}
        >
          {showPassword ? <EyeOff /> : <Eye />}
        </Button>
      </div>
      {description ? <p className="text-xs text-muted-foreground">{description}</p> : null}
      {error ? <p className="text-sm text-destructive">{error}</p> : null}
    </div>
  );
}
