import { AppSidebar } from './app-sidebar';
import { DashboardHeader } from './dashboard-header';
import { ProtectedRoute } from '@/features/auth/hooks';

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute>
      <div className="flex min-h-screen bg-muted/30">
        <AppSidebar />
        <div className="flex flex-1 flex-col md:pl-16">
          <DashboardHeader />
          <main className="flex flex-1 flex-col p-6 lg:p-8">{children}</main>
        </div>
      </div>
    </ProtectedRoute>
  );
}
