'use client';

import { useMutation } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';

import { submitExampleProfile } from '@/features/examples/services';
import type { ProfileFormValues } from '@/features/examples/types';
import { queryKeys } from '@/lib';

export function useExampleProfileForm() {
  const t = useTranslations('profileForm');

  return useMutation({
    mutationKey: queryKeys.examples.profileForm(),
    mutationFn: (values: ProfileFormValues) => submitExampleProfile(values),
    onSuccess: () => {
      toast.success(t('success'));
    },
    onError: (error: Error) => {
      toast.error(t('error'), {
        description: error.message || undefined,
      });
    },
  });
}
