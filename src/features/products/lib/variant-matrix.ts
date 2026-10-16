import type { VariantRowValues } from '@/features/products/types';

export function buildVariantRows(
  colours: string[],
  sizes: string[],
  previousRows: VariantRowValues[] = [],
): VariantRowValues[] {
  const previousMap = new Map<string, VariantRowValues>();
  for (const row of previousRows) {
    previousMap.set(row.key, row);
  }

  const newRows: VariantRowValues[] = [];

  for (const colour of colours) {
    for (const size of sizes) {
      const key = `${colour}::${size}`;
      const existing = previousMap.get(key);

      if (existing) {
        newRows.push(existing);
      } else {
        newRows.push({
          key,
          colour,
          size,
          stock: '10',
          price: '',
          discount: '',
        });
      }
    }
  }

  return newRows;
}
