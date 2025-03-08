import { NavbarDashboard } from '@/shared/components/navbarDashboard';
import ProtectedLayout from '@/shared/components/protectedLayout';

export default function DocsLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedLayout>
      <NavbarDashboard />
      <main className="container flex flex-col items-center justify-center">{children}</main>
    </ProtectedLayout>
  );
}
