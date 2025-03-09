// import { Navbar } from '@/shared/components/navbar';
import { NavbarDashboard } from '@/shared/components/navbarDashboard';
import ProtectedLayout from '@/shared/components/protectedLayout';

export default function DocsLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedLayout>
      <NavbarDashboard />
      <main className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
        <div className="inline-block max-w-lg text-center justify-center">{children}</div>
      </main>
    </ProtectedLayout>
  );
}
