'use client';

import { useQuery } from '@tanstack/react-query';

import { fetchColourOptions, fetchSizeOptions } from '@/features/products/services/product-options-service';

export function useProductOptions() {
  const coloursQuery = useQuery({
    queryKey: ['products', 'colours'],
    queryFn: fetchColourOptions,
  });

  const sizesQuery = useQuery({
    queryKey: ['products', 'sizes'],
    queryFn: fetchSizeOptions,
  });

  return {
    colours: coloursQuery.data ?? [],
    sizes: sizesQuery.data ?? [],
    isLoading: coloursQuery.isLoading || sizesQuery.isLoading,
  };
}
