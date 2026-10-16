import AboutUs from '@/components/shadcn-studio/blocks/about-us-page-01/about-us-page-01';
import HeroSection from '@/components/shadcn-studio/blocks/hero-section-44/hero-section-44';
import Process, {
  type ExperienceStep,
} from '@/components/shadcn-studio/blocks/timeline-component-07/timeline-component-07';
import ChangelogContent, {
  type Release,
} from '@/components/shadcn-studio/blocks/timeline-component-05/timeline-component-05';
import V1_3_0_Content from '@/components/shadcn-studio/blocks/timeline-component-05/content/v1-3-0';
import V1_2_0_Content from '@/components/shadcn-studio/blocks/timeline-component-05/content/v1-2-0';
import V1_1_0_Content from '@/components/shadcn-studio/blocks/timeline-component-05/content/v1-1-0';
import LogoCloud from '@/components/shadcn-studio/blocks/logo-cloud-10/logo-cloud-10';
import { SparklesIcon, TargetIcon, StarIcon, MedalIcon } from 'lucide-react';

const stats = [
  {
    icon: <SparklesIcon />,
    value: '20+',
    description: 'Years of Experience',
  },
  {
    icon: <TargetIcon />,
    value: '70+',
    description: 'Successful Projects',
  },
  {
    icon: <StarIcon />,
    value: '550+',
    description: 'Customer Reviews',
  },
  {
    icon: <MedalIcon />,
    value: '25',
    description: 'Achieve Awards',
  },
];

const brandLogos = Array.from({ length: 20 }, (_, index) => {
  const position = String(index + 1).padStart(2, '0');

  return {
    image: `https://cdn.shadcnstudio.com/ss-assets/template/landing-page/zolt/logo-${position}.png`,
    name: `Tech stack logo ${position}`,
  };
});

const milestones: ExperienceStep[] = [
  {
    id: '01',
    logo: 'https://cdn.shadcnstudio.com/ss-assets/template/landing-page/zolt/case-logo-01.png',
    company: 'Company Founded',
    role: 'The beginning',
    period: '2022',
    stack: ['Research', 'Branding'],
    achievement: 'Launched the studio with our first 5 clients',
    description:
      'We started as a small team of designers and engineers with a simple goal: ship interfaces people love to use.',
  },
  {
    id: '02',
    logo: 'https://cdn.shadcnstudio.com/ss-assets/template/landing-page/zolt/case-logo-02.png',
    company: 'Product Launch',
    role: 'First platform release',
    period: '2023',
    stack: ['React', 'Next.js', 'Design system'],
    achievement: 'Reached 10k active users within the first quarter',
    description:
      'Our first platform shipped with a full component library and a design system that keeps product and marketing in sync.',
  },
  {
    id: '03',
    logo: 'https://cdn.shadcnstudio.com/ss-assets/template/landing-page/zolt/case-logo-03.png',
    company: 'Going Global',
    role: 'International expansion',
    period: '2024',
    stack: ['Localization', 'Partnerships'],
    achievement: 'Serving customers across 40+ countries',
    description:
      'With customers around the world, we opened remote-first teams and localized the product for key markets.',
  },
  {
    id: '04',
    logo: 'https://cdn.shadcnstudio.com/ss-assets/template/landing-page/zolt/case-logo-04.png',
    company: 'Open Source',
    role: 'Giving back',
    period: '2025 - ',
    status: { text: 'Ongoing', tone: 'accent' as const },
    stack: ['Open source', 'Community'],
    achievement: '1 open source component library, 3 shipped apps',
    description: 'We share what we learn — components, patterns, and tooling — with a growing community of builders.',
  },
];

const changelogReleases: Release[] = [
  {
    version: 'v 1.3.0',
    date: 'November 7, 2025',
    content: <V1_3_0_Content />,
  },
  {
    version: 'v 1.2.0',
    date: 'March 22, 2025',
    content: <V1_2_0_Content />,
  },
  {
    version: 'v 1.1.0',
    date: 'January 15, 2025',
    content: <V1_1_0_Content />,
  },
];

export default function AboutUsPage() {
  return (
    <div className="flex w-full flex-col">
      <AboutUs stats={stats} />

      <HeroSection brandLogos={brandLogos} />

      <div className="mx-auto w-full max-w-4xl px-4 py-10 md:px-8 md:py-16">
        <ChangelogContent releases={changelogReleases} />
      </div>

      <Process data={milestones} />

      <LogoCloud brandLogos={brandLogos} />
    </div>
  );
}
