import FAQ from '@/components/shadcn-studio/blocks/faq-component-21/faq-component-21';

const services = [
  {
    title: 'UI & Product Design',
    image: 'https://cdn.shadcnstudio.com/ss-assets/template/landing-page/zolt/thumb-01.png',
    duration: '1 to 3 weeks',
    tools: ['Figma', 'Spline', 'Adobe XD'],
    description:
      'I design interfaces that are clean, intuitive, and built around your users. From the wireframe to the final pixel-perfect file.',
  },
  {
    title: 'Design Engineering',
    image: 'https://cdn.shadcnstudio.com/ss-assets/template/landing-page/zolt/thumb-02.png',
    duration: '2 to 4 weeks',
    tools: ['React', 'Tailwind', 'Figma'],
    description: 'I bridge the gap between design and code, turning polished mockups into production-ready interfaces.',
  },
  {
    title: 'Framer Development',
    image: 'https://cdn.shadcnstudio.com/ss-assets/template/landing-page/zolt/thumb-03.png',
    duration: '1 to 2 weeks',
    tools: ['Framer', 'CMS', 'SEO'],
    description: 'I build and launch fast, animated marketing sites in Framer — from first draft to live domain.',
  },
  {
    title: 'Design Systems',
    image: 'https://cdn.shadcnstudio.com/ss-assets/template/landing-page/zolt/thumb-04.png',
    duration: '3 to 6 weeks',
    tools: ['Figma', 'Tokens', 'Component library'],
    description: 'I build scalable design systems that keep design and code in sync as your product grows.',
  },
  {
    title: 'Interaction & Motion Design',
    image: 'https://cdn.shadcnstudio.com/ss-assets/template/landing-page/zolt/thumb-05.png',
    duration: '1 to 3 weeks',
    tools: ['Framer', 'GSAP', 'Motion'],
    description: 'I add the small, purposeful motion details that make an interface feel alive and considered.',
  },
];

const FAQPage = () => {
  return <FAQ services={services} />;
};

export default FAQPage;
