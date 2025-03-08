'use client';

import { useListCustomers } from '@/shared/hooks/customers/useListCustomer';

export default function DashboardPage() {
  const { data, isLoading, isError } = useListCustomers();

  console.log({ data });
  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error</div>;

  return (
    <>
      {JSON.stringify(data)}
      {/* <DashboardComponent /> */}
      {/* <h1 className={title()}>Dashboard</h1> */}
      {/* <CustomSection /> */}
    </>
  );
}
