import { z } from 'zod';

export interface ProductOption {
  value: string;
  label: string;
  color?: string;
}

export const variantRowSchema = z.object({
  key: z.string(),
  colour: z.string(),
  size: z.string(),
  stock: z.string().refine((val) => val === '' || /^\d+$/.test(val), 'Stock must be an integer'),
  price: z.string().refine((val) => val === '' || /^\d+(\.\d+)?$/.test(val), 'Price must be a number'),
  discount: z.string().refine((val) => val === '' || /^\d+(\.\d+)?$/.test(val), 'Discount must be a number'),
});

export type VariantRowValues = z.infer<typeof variantRowSchema>;

export const productFormSchema = z.object({
  title: z.string().min(1, 'Product title is required'),
  sku: z.string().min(1, 'SKU is required'),
  colours: z.array(z.string()).min(1, 'Select at least one colour'),
  sizes: z.array(z.string()).min(1, 'Select at least one size'),
  variants: z.array(variantRowSchema),
  currency: z.enum(['USD', 'EUR', 'IDR', 'GBP']),
  basePrice: z.string().refine((val) => val === '' || /^\d+(\.\d+)?$/.test(val), 'Base price must be a number'),
  promoPrice: z.string().optional(),
  promoType: z.enum(['percentage', 'fixed']),
  promoDateRange: z
    .object({
      from: z.string().optional(),
      to: z.string().optional(),
    })
    .optional(),
});

export type ProductFormValues = z.infer<typeof productFormSchema>;
