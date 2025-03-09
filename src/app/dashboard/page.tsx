'use client';

import { useListCustomers } from '@/shared/hooks/customers/useListCustomer';

export default function DashboardPage() {
  const { data, isLoading, isError } = useListCustomers();

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error</div>;

  return <p>{JSON.stringify(data)}</p>;
}
