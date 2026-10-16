import { describe, expect, it } from 'vitest';
import { buildVariantRows } from './variant-matrix';
import type { VariantRowValues } from '@/features/products/types';

describe('buildVariantRows', () => {
  it('generates cartesian product of colours and sizes', () => {
    const colours = ['red', 'blue'];
    const sizes = ['S', 'M'];

    const rows = buildVariantRows(colours, sizes);

    expect(rows).toHaveLength(4);
    expect(rows[0]).toEqual({
      key: 'red::S',
      colour: 'red',
      size: 'S',
      stock: '10',
      price: '',
      discount: '',
    });
    expect(rows[3]).toEqual({
      key: 'blue::M',
      colour: 'blue',
      size: 'M',
      stock: '10',
      price: '',
      discount: '',
    });
  });

  it('preserves previous row overrides when sizes/colours change', () => {
    const previous: VariantRowValues[] = [
      { key: 'red::S', colour: 'red', size: 'S', stock: '25', price: '99', discount: '5' },
    ];

    const rows = buildVariantRows(['red'], ['S', 'M'], previous);

    expect(rows).toHaveLength(2);
    expect(rows[0]).toEqual({
      key: 'red::S',
      colour: 'red',
      size: 'S',
      stock: '25',
      price: '99',
      discount: '5',
    });
    expect(rows[1].key).toBe('red::M');
    expect(rows[1].stock).toBe('10');
  });

  it('drops rows when a colour or size is removed', () => {
    const previous: VariantRowValues[] = [
      { key: 'red::S', colour: 'red', size: 'S', stock: '10', price: '', discount: '' },
      { key: 'blue::S', colour: 'blue', size: 'S', stock: '10', price: '', discount: '' },
    ];

    const rows = buildVariantRows(['red'], ['S'], previous);

    expect(rows).toHaveLength(1);
    expect(rows[0].key).toBe('red::S');
  });
});
