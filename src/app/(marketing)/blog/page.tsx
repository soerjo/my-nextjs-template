import Blog from '@/components/shadcn-studio/blocks/blog-component-15/blog-component-15';
import BlogAlternate from '@/components/shadcn-studio/blocks/blog-component-17/blog-component-17';
import Header from '@/components/shadcn-studio/blocks/hero-section-41/header';
import HeroSection from '@/components/shadcn-studio/blocks/hero-section-41/hero-section-41';
import type { NavigationSection } from '@/components/shadcn-studio/blocks/menu-navigation';

const navigationData: NavigationSection[] = [
  { title: 'Home', href: '/' },
  { title: 'About', href: '/about' },
  { title: 'Contact', href: '/contact' },
];

const menudata = [
  {
    id: 1,
    img: 'https://cdn.shadcnstudio.com/ss-assets/template/landing-page/bistro/image-18.png',
    imgAlt: 'plate-1',
    userComment: 'The ambiance is perfect and the food is absolutely delicious. Highly recommended!',
    userAvatar: 'https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-56.png',
  },
  {
    id: 2,
    img: 'https://cdn.shadcnstudio.com/ss-assets/template/landing-page/bistro/image-19.png',
    imgAlt: 'plate-2',
    userComment: 'Best dining experience in town. The staff is friendly and the menu is exceptional.',
    userAvatar: 'https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-46.png',
  },
  {
    id: 3,
    img: 'https://cdn.shadcnstudio.com/ss-assets/template/landing-page/bistro/image-20.png',
    imgAlt: 'plate-3',
    userComment: 'Every dish is crafted with care. This place never disappoints!',
    userAvatar: 'https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-57.png',
  },
  {
    id: 4,
    img: 'https://cdn.shadcnstudio.com/ss-assets/template/landing-page/bistro/image-05.png',
    imgAlt: 'plate-4',
    userComment: 'Great atmosphere and incredible flavors. A must-visit restaurant!',
    userAvatar: 'https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-58.png',
  },
  {
    id: 5,
    img: 'https://cdn.shadcnstudio.com/ss-assets/template/landing-page/bistro/image-20.png',
    imgAlt: 'plate-3',
    userComment: 'Every dish is crafted with care. This place never disappoints!',
    userAvatar: 'https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-57.png',
  },
];

const blogPosts = [
  {
    title: 'Design Smarter: How User Behavior Shapes Winning Products',
    description: 'Learn how to discover what users truly want and build with confidence.',
    imageUrl: 'https://cdn.shadcnstudio.com/ss-assets/template/landing-page/ink/image-04.png',
    imageAlt: 'Design workspace with color swatches',
    date: 'March 12, 2025',
    category: 'Product',
    author: 'Phillip Palmer',
    authorLink: '#',
    blogLink: '#',
    categoryLink: '#',
  },
  {
    title: 'Nail Your First Launch: A Checklist for Product Debut Success',
    description: 'Avoid common launch traps and create excitement from day one.',
    imageUrl: 'https://cdn.shadcnstudio.com/ss-assets/template/landing-page/ink/image-05.png',
    imageAlt: 'Product launch analytics',
    date: 'January 20, 2025',
    category: 'Startup Growth',
    author: 'Michael Brown',
    authorLink: '#',
    blogLink: '#',
    categoryLink: '#',
  },
  {
    title: 'Why Fast Apps Win: The Blueprint for Lightning-Quick Experiences',
    description: 'Explore proven strategies to boost speed and delight users every time.',
    imageUrl: 'https://cdn.shadcnstudio.com/ss-assets/template/landing-page/ink/image-06.png',
    imageAlt: 'Mobile app development',
    date: 'February 28, 2025',
    category: 'Product',
    author: 'Jane Smith',
    authorLink: '#',
    blogLink: '#',
    categoryLink: '#',
  },
  {
    title: 'Scaling Design the Right Way with a Solid Component System',
    description: 'Build consistency, save time, and ship optimized UI every release.',
    imageUrl: 'https://cdn.shadcnstudio.com/ss-assets/template/landing-page/ink/image-07.png',
    imageAlt: 'Component design system',
    date: 'March 05, 2025',
    category: 'Design',
    author: 'Dylan Field',
    authorLink: '#',
    blogLink: '#',
    categoryLink: '#',
  },
  {
    title: 'Product KPIs That Actually Matter And How to Track Them',
    description: 'Measure progress the right way to build momentum and stay focused.',
    imageUrl: 'https://cdn.shadcnstudio.com/ss-assets/template/landing-page/ink/image-08.png',
    imageAlt: 'Team analyzing KPIs',
    date: 'January 09, 2025',
    category: 'Design',
    author: 'Nina Rich',
    authorLink: '#',
    blogLink: '#',
    categoryLink: '#',
  },
  {
    title: 'How AI-Driven Workflows Are Transforming Product Development',
    description: 'Discover smarter ways to ideate, design, and build using AI tools.',
    imageUrl: 'https://cdn.shadcnstudio.com/ss-assets/template/landing-page/ink/image-09.png',
    imageAlt: 'AI in product development',
    date: 'March 05, 2025',
    category: 'Startup Growth',
    author: 'Startup Growth',
    authorLink: '#',
    blogLink: '#',
    categoryLink: '#',
  },
];

const featuredPosts = [
  {
    title: 'Ship Faster with a Scalable UI Architecture',
    description: 'Reduce tech debt, accelerate release cycles, keep your product consistent as you grow.',
    imageUrl: 'https://cdn.shadcnstudio.com/ss-assets/template/landing-page/ink/image-04.png',
    imageAlt: 'ship',
    date: 'May 23, 2025',
    category: 'Dev Productivity',
    author: 'Lea Potts',
    authorLink: '#',
    blogLink: '#',
    categoryLink: '#',
  },
  {
    title: 'SEO Playbook for SaaS Products That Scale',
    description: 'Turn search into compounding sign-ups with a strategy tailored for SaaS funnels.',
    imageUrl: 'https://cdn.shadcnstudio.com/ss-assets/template/landing-page/ink/image-10.png',
    imageAlt: 'Seo',
    date: 'May 15, 2025',
    category: 'SEO',
    author: 'Bella Craig',
    authorLink: '#',
    blogLink: '#',
    categoryLink: '#',
  },
  {
    title: 'Automating Product Delivery with AI Workflows',
    description: 'Replace repetitive tasks with AI-powered workflows and give teams more time to innovate.',
    imageUrl: 'https://cdn.shadcnstudio.com/ss-assets/template/landing-page/ink/image-09.png',
    imageAlt: 'AI',
    date: 'February 28, 2025',
    category: 'AI Automation',
    author: 'Noah Ortega',
    authorLink: '#',
    blogLink: '#',
    categoryLink: '#',
  },
];

export default function BlogPage() {
  return (
    <div className="overflow-x-hidden">
      <Header navigationData={navigationData} />
      <main className="flex flex-col pt-17.5">
        <HeroSection menudata={menudata} />
      </main>
      <Blog blogPosts={blogPosts} />
      <BlogAlternate blogPosts={featuredPosts} />
    </div>
  );
}
