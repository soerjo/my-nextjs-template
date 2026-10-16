import { HomeHero } from '@/features/home/components';
import Header from '@/components/shadcn-studio/blocks/hero-section-01/header';
import HeroSection from '@/components/shadcn-studio/blocks/hero-section-01/hero-section-01';
import LogoCloud from '@/components/shadcn-studio/blocks/logo-cloud-01/logo-cloud-01';
import TestimonialsComponent from '@/components/shadcn-studio/blocks/testimonials-component-26/testimonials-component-26';
import FAQ from '@/components/shadcn-studio/blocks/faq-component-21/faq-component-21';
import type { NavigationSection } from '@/components/shadcn-studio/blocks/hero-section-01/header';

const navigationData: NavigationSection[] = [
  { title: 'Home', href: '/' },
  { title: 'About', href: '/about' },
  { title: 'Blog', href: '/blog' },
  { title: 'FAQ', href: '/faq' },
  { title: 'Contact', href: '/contact' },
  { title: 'Dashboard', href: '/dashboard' },
];

const logos = [
  { image: 'https://cdn.shadcnstudio.com/ss-assets/brand-logo/amazon-logo-bw.png', alt: 'Amazon' },
  { image: 'https://cdn.shadcnstudio.com/ss-assets/brand-logo/hubspot-logo-bw.png', alt: 'HubSpot' },
  { image: 'https://cdn.shadcnstudio.com/ss-assets/brand-logo/walmart-logo-bw.png', alt: 'Walmart' },
  { image: 'https://cdn.shadcnstudio.com/ss-assets/brand-logo/microsoft-logo-bw.png', alt: 'Microsoft' },
  { image: 'https://cdn.shadcnstudio.com/ss-assets/brand-logo/evernote-icon-bw.png', alt: 'Evernote' },
  { image: 'https://cdn.shadcnstudio.com/ss-assets/brand-logo/paypal-logo-bw.png', alt: 'PayPal' },
];

const services = [
  {
    title: 'UI & Product Design',
    image: 'https://cdn.shadcnstudio.com/ss-assets/template/landing-page/zolt/thumb-01.png',
    duration: '1 to 3 weeks',
    tools: ['Figma', 'Spline', 'Adobe XD'],
    description: 'I design interfaces that are clean, intuitive, and built around your users.',
  },
  {
    title: 'Design Engineering',
    image: 'https://cdn.shadcnstudio.com/ss-assets/template/landing-page/zolt/thumb-02.png',
    duration: '2 to 4 weeks',
    tools: ['React', 'Tailwind', 'Figma'],
    description: 'I bridge the gap between design and code, turning polished mockups into production-ready interfaces.',
  },
];

export default function MarketingLandingPage() {
  return (
    <div className="flex flex-col w-full">
      <Header navigationData={navigationData} />
      <HeroSection />
      <div className="flex justify-center w-full bg-muted/50 py-12">
        <HomeHero />
      </div>
      <LogoCloud logos={logos} />
      <TestimonialsComponent />
      <FAQ services={services} />
    </div>
  );
}
