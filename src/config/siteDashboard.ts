export type SiteConfig = typeof siteConfigDashboard;

export const siteConfigDashboard = {
  name: 'Bash App',
  description: 'Make your garbage collection easier with Bash App.',
  icon: '/favicon.ico',
  navItems: [
    {
      label: 'Dashboard',
      href: '/',
    },
    {
      label: 'Transaksi',
      href: '/transactions',
    },
    {
      label: 'Nasabah',
      href: '/customers',
    },
    {
      label: 'Sampah',
      href: '/trash',
    },
  ],
};
