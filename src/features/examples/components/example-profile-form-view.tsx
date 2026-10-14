'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, Plus, Trash2 } from 'lucide-react';
import { useFieldArray, useForm } from 'react-hook-form';
import { useTranslations } from 'next-intl';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useExampleProfileForm } from '@/features/examples/hooks';
import { profileFormSchema, type ProfileFormValues } from '@/features/examples/types';

const DEFAULT_VALUES: ProfileFormValues = {
  fullName: '',
  headline: '',
  bio: '',
  emails: [{ label: 'Work', address: '' }],
};

export function ExampleProfileFormView() {
  const t = useTranslations('profileForm');
  const { mutateAsync, isPending } = useExampleProfileForm();

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: DEFAULT_VALUES,
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'emails',
  });

  async function onSubmit(values: ProfileFormValues) {
    try {
      await mutateAsync(values);
      reset(DEFAULT_VALUES);
    } catch {
      // Errors are surfaced through the mutation's error toast.
    }
  }

  return (
    <div className="mx-auto w-full max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">{t('title')}</h1>
        <p className="text-sm text-muted-foreground">{t('description')}</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t('title')}</CardTitle>
          <CardDescription>{t('description')}</CardDescription>
        </CardHeader>

        <CardContent>
          <form className="flex flex-col gap-5" noValidate onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="fullName">
                {t('fullName')} <span className="text-destructive">*</span>
              </Label>
              <Input
                aria-invalid={Boolean(errors.fullName)}
                id="fullName"
                placeholder="Ada Lovelace"
                type="text"
                {...register('fullName')}
              />
              {errors.fullName && <p className="text-sm text-destructive">{errors.fullName.message}</p>}
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="headline">
                {t('headline')} <span className="text-destructive">*</span>
              </Label>
              <Input
                aria-invalid={Boolean(errors.headline)}
                id="headline"
                placeholder="Senior Software Engineer"
                type="text"
                {...register('headline')}
              />
              {errors.headline && <p className="text-sm text-destructive">{errors.headline.message}</p>}
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="bio">{t('bio')}</Label>
              <textarea
                aria-invalid={Boolean(errors.bio)}
                className="min-h-24 w-full min-w-0 rounded-lg border border-input bg-transparent px-2.5 py-2 text-base transition-colors outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-input/50 disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 md:text-sm dark:bg-input/30 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40"
                id="bio"
                placeholder={t('bioPlaceholder')}
                {...register('bio')}
              />
              {errors.bio && <p className="text-sm text-destructive">{errors.bio.message}</p>}
            </div>

            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-medium text-foreground">{t('emails')}</p>
                  <p className="text-xs text-muted-foreground">{t('emailsHelp')}</p>
                </div>
                <Button size="sm" type="button" variant="outline" onClick={() => append({ label: '', address: '' })}>
                  <Plus />
                  {t('addEmail')}
                </Button>
              </div>

              {errors.emails?.root?.message && <p className="text-sm text-destructive">{errors.emails.root.message}</p>}

              <div className="flex flex-col gap-3">
                {fields.map((field, index) => {
                  const emailErrors = errors.emails?.[index];

                  return (
                    <div
                      key={field.id}
                      className="flex flex-col gap-3 rounded-lg border border-border bg-muted/30 p-3 sm:flex-row sm:items-start"
                    >
                      <div className="flex flex-col gap-1.5 sm:w-32">
                        <Label htmlFor={`emails.${index}.label`}>{t('label')}</Label>
                        <Input
                          aria-invalid={Boolean(emailErrors?.label)}
                          id={`emails.${index}.label`}
                          placeholder="Work"
                          type="text"
                          {...register(`emails.${index}.label` as const)}
                        />
                        {emailErrors?.label && <p className="text-xs text-destructive">{emailErrors.label.message}</p>}
                      </div>

                      <div className="flex flex-1 flex-col gap-1.5">
                        <Label htmlFor={`emails.${index}.address`}>{t('email')}</Label>
                        <Input
                          aria-invalid={Boolean(emailErrors?.address)}
                          id={`emails.${index}.address`}
                          placeholder="name@example.com"
                          type="email"
                          {...register(`emails.${index}.address` as const)}
                        />
                        {emailErrors?.address && (
                          <p className="text-xs text-destructive">{emailErrors.address.message}</p>
                        )}
                      </div>

                      <Button
                        aria-label={t('removeEmail', { index: index + 1 })}
                        className="sm:mt-6"
                        disabled={fields.length === 1}
                        size="icon-sm"
                        type="button"
                        variant="ghost"
                        onClick={() => remove(index)}
                      >
                        <Trash2 className="text-destructive" />
                      </Button>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="flex items-center justify-end gap-2">
              <Button disabled={isPending} type="button" variant="ghost" onClick={() => reset(DEFAULT_VALUES)}>
                {t('reset')}
              </Button>
              <Button disabled={isPending} type="submit">
                {isPending ? (
                  <>
                    <Loader2 className="animate-spin" />
                    {t('submitting')}
                  </>
                ) : (
                  t('submit')
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
