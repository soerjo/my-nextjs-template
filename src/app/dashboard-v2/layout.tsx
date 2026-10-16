import { SsAppShell } from '@/components/layouts/ss-app-shell';

export default function DashboardV2Layout({ children }: { children: React.ReactNode }) {
  return <SsAppShell>{children}</SsAppShell>;
}
