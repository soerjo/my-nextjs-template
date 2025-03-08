export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  name: 'Bash App',
  description: 'Make your garbage collection easier with Bash App.',
  icon: '/favicon.ico',
  navItems: [
    {
      label: 'Home',
      href: '/',
      isProtected: false,
    },
    {
      label: 'Example',
      href: '/example',
      isProtected: false,
    },
    {
      label: 'Docs',
      href: '/docs',
      isProtected: false,
    },
    {
      label: 'Pricing',
      href: '/pricing',
      isProtected: false,
    },
    {
      label: 'Blog',
      href: '/blog',
      isProtected: false,
    },
    {
      label: 'About',
      href: '/about',
      isProtected: false,
    },
    {
      label: 'Register',
      href: '/register',
      isProtected: false,
    },
  ],
};
