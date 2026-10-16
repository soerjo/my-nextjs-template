import { SsAppShell } from '@/components/layouts/ss-app-shell';
import { ProtectedRoute } from '@/features/auth/hooks';

export default function DashboardRouteLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute>
      <SsAppShell>{children}</SsAppShell>
    </ProtectedRoute>
  );
}
