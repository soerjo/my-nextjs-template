import { SsAppShell } from '@/components/layouts/ss-app-shell';

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return <SsAppShell>{children}</SsAppShell>;
}
