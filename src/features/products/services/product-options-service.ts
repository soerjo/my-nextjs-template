import type { ProductOption } from '@/features/products/types';

const NETWORK_DELAY_MS = 400;

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const COLOUR_OPTIONS: ProductOption[] = [
  { value: 'forest', label: 'Forest Green', color: '#1f5136' },
  { value: 'lime', label: 'Neon Lime', color: '#b6e84a' },
  { value: 'black', label: 'Midnight Black', color: '#111111' },
  { value: 'sand', label: 'Desert Sand', color: '#d8c3a5' },
  { value: 'navy', label: 'Navy Blue', color: '#1e3a8a' },
];

const SIZE_OPTIONS: ProductOption[] = [
  { value: 'xs', label: 'Extra Small (XS)' },
  { value: 's', label: 'Small (S)' },
  { value: 'm', label: 'Medium (M)' },
  { value: 'l', label: 'Large (L)' },
  { value: 'xl', label: 'Extra Large (XL)' },
];

export async function fetchColourOptions(): Promise<ProductOption[]> {
  await delay(NETWORK_DELAY_MS);
  return COLOUR_OPTIONS;
}

export async function fetchSizeOptions(): Promise<ProductOption[]> {
  await delay(NETWORK_DELAY_MS);
  return SIZE_OPTIONS;
}

export async function submitProduct(_values: unknown): Promise<{ id: string }> {
  await delay(600);
  return { id: `PRD-${Date.now().toString(36).toUpperCase()}` };
}
