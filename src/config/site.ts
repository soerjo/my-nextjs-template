export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  name: 'Next.js + HeroUI',
  description: 'Make beautiful websites regardless of your design experience.',
  navItems: [
    {
      label: 'Home',
      href: '/',
      isProtected: false,
    },
    {
      label: 'Dashboard',
      href: '/dashboard',
      isProtected: true,
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
  ],
  navMenuItems: [
    {
      label: 'Profile',
      href: '/profile',
      isProtected: false,
    },
    {
      label: 'Dashboard',
      href: '/dashboard',
      isProtected: false,
    },
    {
      label: 'Projects',
      href: '/projects',
      isProtected: false,
    },
    {
      label: 'Team',
      href: '/team',
      isProtected: false,
    },
    {
      label: 'Calendar',
      href: '/calendar',
      isProtected: false,
    },
    {
      label: 'Settings',
      href: '/settings',
      isProtected: false,
    },
    {
      label: 'Help & Feedback',
      href: '/help-feedback',
      isProtected: false,
    },
    {
      label: 'Logout',
      href: '/logout',
      isProtected: false,
    },
  ],
  links: {
    github: 'https://github.com/heroui-inc/heroui',
    twitter: 'https://twitter.com/hero_ui',
    docs: 'https://heroui.com',
    discord: 'https://discord.gg/9b6yyZKmH4',
    sponsor: 'https://patreon.com/jrgarciadev',
  },
};
