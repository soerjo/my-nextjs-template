import { Button } from '@heroui/button';

import { useStore } from '@/shared/store/useStore';

export function CustomButton() {
  const { increase, count } = useStore();

  return (
    <div className="flex flex-row gap-2 justify-center items-center mx-auto p-4">
      <h1>Custom Section: {count}</h1>
      <Button onPress={increase}>refresh</Button>
    </div>
  );
}
