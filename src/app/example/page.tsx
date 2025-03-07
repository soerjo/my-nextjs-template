'use client';

import { CustomSection } from '@/shared/components/page/example/customSection';
import { title } from '@/shared/components/primitives';

export default function ExamplePage() {
  return (
    <div>
      <h1 className={title()}>Example</h1>
      <CustomSection />
    </div>
  );
}
