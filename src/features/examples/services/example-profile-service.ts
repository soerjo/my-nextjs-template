import type { ProfileFormResult, ProfileFormValues } from '@/features/examples/types';

const NETWORK_DELAY_MS = 700;

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function submitExampleProfile(values: ProfileFormValues): Promise<ProfileFormResult> {
  await delay(NETWORK_DELAY_MS);

  // Demo failure path: submit a full name containing "fail" to trigger the error toast.
  if (values.fullName.toLowerCase().includes('fail')) {
    throw new Error('The profile service rejected this submission. Please try again.');
  }

  return {
    id: `PRF-${Date.now().toString(36).toUpperCase()}`,
    fullName: values.fullName,
    headline: values.headline,
    bio: values.bio,
    emails: values.emails,
    updatedAt: new Date().toISOString(),
  };
}
