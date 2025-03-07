'use client';

import { Button } from '@heroui/button';

import { CustomButton } from './customButton';
import { MapDatas } from './mapDatas';

import { useGetUser } from '@/shared/hooks/users/useGetUser';

export function CustomSection() {
  const { refetch } = useGetUser();

  return (
    <>
      <CustomButton />
      <div>
        <div className="flex flex-row gap-2 justify-center items-center mx-auto p-4">
          <h1>Custom Section 2:</h1>
          <Button onPress={() => refetch()}>Refresh</Button>
        </div>
        <MapDatas />
      </div>
    </>
  );
}
