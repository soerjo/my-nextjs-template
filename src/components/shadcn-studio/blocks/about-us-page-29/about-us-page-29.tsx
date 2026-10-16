'use client';

// React Imports
import { useRef, useState } from 'react';

// Third-party Imports
import { motion, useScroll, useSpring, useTransform } from 'motion/react';

// Component Imports
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
// Util Imports
import { cn } from '@/utils/index';
import { MapPinIcon, ArrowRightIcon } from 'lucide-react';

const STATS = [
  { label: 'Total hours', value: '163' },
  { label: 'Rating', value: '4.82' },
  { label: 'Total jobs', value: '81' },
];

const FEATURES = [
  'One request at a time',
  'Avg. 48 hour turnaround',
  'Unlimited revisions',
  'Design + code delivered',
  'Up to 2 stakeholders',
];

const ProfileCard = ({ className }: { className?: string }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isFlipped, setIsFlipped] = useState(false);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });

  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 20, mass: 0.5 });
  const rotate = useTransform(progress, [0, 0.5, 1], [-4, 0, 4]);

  return (
    <div
      ref={containerRef}
      className={cn('bg-background flex flex-col justify-between rounded-2xl border p-6', className)}
    >
      <motion.div
        style={{ rotate }}
        className="origin-bottom perspective-[1500px] sm:-ml-4 sm:w-88 md:-ml-9 md:w-68 lg:-ml-9 lg:w-88"
      >
        <div
          role="button"
          tabIndex={0}
          aria-pressed={isFlipped}
          onClick={() => setIsFlipped((prev) => !prev)}
          onKeyDown={(event) => {
            if (event.key === 'Enter' || event.key === ' ') {
              event.preventDefault();
              setIsFlipped((prev) => !prev);
            }
          }}
          className={cn(
            'relative cursor-pointer transition-transform duration-700 transform-3d',
            isFlipped && 'transform-[rotateY(180deg)]',
          )}
        >
          <Card className="shadow-lg ring-0 backface-hidden dark:ring dark:ring-white/20">
            <CardContent className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="flex grow flex-col items-center gap-4">
                  <div className="relative">
                    <Avatar className="size-30">
                      <AvatarImage
                        src="https://cdn.shadcnstudio.com/ss-assets/template/landing-page/zolt/profile.png"
                        alt="Zolt Mercer"
                      />
                      <AvatarFallback>Z</AvatarFallback>
                    </Avatar>
                    <span className="absolute -bottom-3 left-[50%] flex size-7.5 -translate-x-1/2 items-center justify-center">
                      <img
                        src="https://cdn.shadcnstudio.com/ss-assets/template/landing-page/zolt/profile-star-icon.png"
                        alt="Verified"
                        loading="lazy"
                        className="size-full"
                      />
                    </span>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold lg:text-[36px]">Zolt Mercer</h3>
                    <p className="text-muted-foreground flex items-center justify-center gap-1 text-base font-medium">
                      <MapPinIcon className="fill-muted-foreground text-card size-5" />
                      Austin, USA
                    </p>
                  </div>
                </div>

                <div className="divide-border divide-y text-center">
                  {STATS.map((stat) => (
                    <div key={stat.label} className="py-1.5 first:pt-0 last:pb-0">
                      <p className="text-foreground text-xl font-semibold lg:text-[26px]">{stat.value}</p>
                      <p className="text-base">{stat.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card
            style={{
              backgroundImage:
                "url('https://cdn.shadcnstudio.com/ss-assets/template/landing-page/zolt/card-back-bg.png')",
            }}
            className="absolute inset-0 transform-[rotateY(180deg)] overflow-hidden rounded-[24px] bg-black bg-cover bg-center text-white shadow-lg ring-0 backface-hidden dark:ring dark:ring-white/20"
          >
            <CardContent className="relative flex h-full flex-col justify-between gap-6">
              <div>
                <p className="text-xs text-white/60">Zolt Mercer</p>
                <h3 className="text-base font-medium">Verified since April 2019</h3>
              </div>

              <div className="flex items-end justify-between gap-3">
                <p className="text-base">
                  I care about craft, details, and building things people actually enjoy using.
                </p>
                <Avatar className="h-24.5 w-20.5 shrink-0 rounded-[12px]">
                  <AvatarImage
                    src="https://cdn.shadcnstudio.com/ss-assets/template/landing-page/zolt/profile.png"
                    alt="Zolt Mercer"
                    className="rounded-[12px]"
                  />
                  <AvatarFallback>Z</AvatarFallback>
                </Avatar>
              </div>
            </CardContent>
          </Card>
        </div>
      </motion.div>

      <div className="mt-6 space-y-3">
        <Badge
          variant="outline"
          className="bg-card h-6.5 gap-1 rounded-full text-green-600 shadow-sm dark:text-green-400"
        >
          <span className="relative inline-flex size-1.5">
            <span className="absolute -inset-0.5 animate-[ping_1.8s_cubic-bezier(0,0,0.2,1)_infinite] rounded-full bg-green-600/40 opacity-75 dark:bg-green-400/40" />
            <span className="relative inline-flex size-1.5 rounded-full bg-green-600 dark:bg-green-400" />
          </span>
          Available
        </Badge>

        <p className="mb-2 text-xl font-medium sm:text-2xl lg:text-[30px]">Hire me today</p>

        <p className="text-muted-foreground text-base">
          I take on only a small number of projects at a time, so your work always gets my full focus.
        </p>
      </div>
    </div>
  );
};

const PricingCard = ({ className }: { className?: string }) => {
  return (
    <Card className={cn('bg-background rounded-2xl border py-6', className)}>
      <CardContent className="gap-0 space-y-6 px-6">
        <div className="space-y-2.5">
          <p className="text-foreground text-2xl font-medium lg:text-[30px]">Monthly Retainer</p>
          <p className="text-muted-foreground mb-0 text-base">One design engineer dedicated to your product.</p>
          <p className="text-muted-foreground text-base">
            I design it, build it, and ship it - start to finish, no middleman.
          </p>
        </div>

        <Separator />

        <Badge variant="secondary" className="text-foreground bg-muted h-6.5 rounded-full font-normal">
          Pause or cancel anytime
        </Badge>

        <p className="text-foreground mb-5.5 text-4xl font-semibold sm:text-5xl">
          $1,900 <span className="text-muted-foreground -ml-3 text-xl font-medium lg:text-[30px]">/month</span>
        </p>

        <ul className="mb-5.5 grid grid-cols-1 gap-x-4 gap-y-2 sm:grid-cols-2">
          {FEATURES.map((feature) => (
            <li key={feature} className="text-foreground flex items-center gap-2 text-base font-medium">
              <span className="bg-foreground size-1.5 shrink-0 rounded-full" />
              {feature}
            </li>
          ))}
        </ul>

        <Button
          variant="outline"
          className="hover:bg-card bg-card group h-11 gap-2.5 rounded-full pr-4! pl-4! text-base shadow-sm transition-[padding] duration-300 hover:pl-2!"
          asChild
        >
          <a href="#">
            <span className="bg-primary relative flex size-2.5 items-center justify-center overflow-hidden rounded-full transition-all duration-300 group-hover:size-6.5">
              <ArrowRightIcon className="text-primary-foreground absolute size-4.5 -translate-x-3 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100" />
            </span>
            Let&apos;s connect
          </a>
        </Button>
      </CardContent>
    </Card>
  );
};

const AboutUs = () => {
  return (
    <section className="py-8 sm:py-16 lg:py-24">
      <div className="mx-auto max-w-5xl space-y-8 px-4 sm:px-6 lg:space-y-16 lg:px-8">
        <div className="space-y-2">
          <p className="text-primary text-lg font-medium italic sm:text-xl">{'// How it works'}</p>
          <h2 className="text-2xl font-semibold sm:text-3xl lg:text-4xl">
            No agencies - just me, fully in on your product
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-[240px_1fr] lg:grid-cols-[334px_1fr]">
          <ProfileCard />
          <PricingCard />
        </div>
      </div>
    </section>
  );
};

export default AboutUs;
