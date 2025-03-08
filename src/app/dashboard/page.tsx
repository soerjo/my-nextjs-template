'use client';

import { CustomSection } from '@/shared/components/page/example/customSection';
import { title } from '@/shared/components/primitives';

export default function DashboardPage() {
  return (
    <div>
      <h1 className={title()}>Dashboard</h1>
      <CustomSection />
    </div>
  );
}
