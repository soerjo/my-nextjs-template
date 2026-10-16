'use client';

import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';

import { submitProduct } from '@/features/products/services/product-options-service';
import type { ProductFormValues } from '@/features/products/types';

export function useCreateProduct() {
  return useMutation({
    mutationFn: (values: ProductFormValues) => submitProduct(values),
    onSuccess: () => {
      toast.success('Product created successfully!');
    },
    onError: (error: Error) => {
      toast.error('Failed to create product', {
        description: error.message || undefined,
      });
    },
  });
}
