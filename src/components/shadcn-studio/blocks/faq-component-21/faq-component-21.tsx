'use client';

import { useEffect, useRef, useState } from 'react';
import type { MouseEvent } from 'react';

import { Accordion as AccordionPrimitive } from 'radix-ui';
import { motion, useMotionValue, useSpring, useTransform } from 'motion/react';
import { Accordion, AccordionItem } from '@/components/ui/accordion';
import { MotionPreset } from '@/components/ui/motion-preset';
import { PlusIcon, MinusIcon } from 'lucide-react';

type ServiceItem = {
  title: string;
  image: string;
  duration: string;
  tools: string[];
  description: string;
};

type FAQComponentProps = {
  services: ServiceItem[];
};

const FAQ = ({ services }: FAQComponentProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [displayedIndex, setDisplayedIndex] = useState<number | null>(null);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 300, damping: 30, mass: 0.5 });
  const springY = useSpring(mouseY, { stiffness: 300, damping: 30, mass: 0.5 });

  const offsetX = useTransform(springX, (value) => `calc(${value}px - 50%)`);
  const offsetY = useTransform(springY, (value) => `calc(${value}px - 50%)`);

  const rawTilt = useMotionValue(-8);
  const tilt = useSpring(rawTilt, { stiffness: 300, damping: 20 });

  useEffect(() => {
    rawTilt.set(hoveredIndex !== null && hoveredIndex % 2 === 1 ? 8 : -8);
  }, [hoveredIndex, rawTilt]);

  const handleServiceMouseEnter = (index: number) => {
    setHoveredIndex(index);
    setDisplayedIndex(index);
  };

  const handleMouseMove = (event: MouseEvent<HTMLDivElement>) => {
    const bounds = event.currentTarget.getBoundingClientRect();

    mouseX.set(event.clientX - bounds.left);
    mouseY.set(event.clientY - bounds.top);
  };

  const handleContainerMouseEnter = () => {
    if (!containerRef.current) return;

    containerRef.current.style.setProperty('cursor', 'none', 'important');
    containerRef.current
      .querySelectorAll('button')
      .forEach((button) => button.style.setProperty('cursor', 'none', 'important'));
  };

  const handleContainerMouseLeave = () => {
    if (containerRef.current) {
      containerRef.current.style.removeProperty('cursor');
      containerRef.current.querySelectorAll('button').forEach((button) => button.style.removeProperty('cursor'));
    }

    setHoveredIndex(null);
  };

  return (
    <section className="bg-background py-8 sm:py-16 lg:py-24">
      <div className="mx-auto max-w-5xl space-y-8 px-4 sm:px-6 lg:space-y-16 lg:px-8">
        <div className="space-y-2">
          <MotionPreset fade blur slide={{ direction: 'down', offset: 50 }} transition={{ duration: 0.5 }}>
            <p className="text-primary text-lg font-medium italic sm:text-xl">{'// Services I provide'}</p>
          </MotionPreset>
          <MotionPreset
            component="h2"
            className="text-2xl font-semibold sm:text-3xl lg:text-4xl"
            fade
            blur
            delay={0.2}
            slide={{ direction: 'down', offset: 50 }}
            transition={{ duration: 0.5 }}
          >
            I can help you with these things
          </MotionPreset>
        </div>

        <MotionPreset
          fade
          blur
          delay={0.4}
          slide={{ direction: 'down', offset: 50 }}
          transition={{ duration: 0.5 }}
          className="relative mx-auto"
        >
          <div
            ref={containerRef}
            onMouseMove={handleMouseMove}
            onMouseEnter={handleContainerMouseEnter}
            onMouseLeave={handleContainerMouseLeave}
          >
            <Accordion type="single" collapsible defaultValue="item-0">
              {services.map((service, index) => (
                <AccordionItem
                  key={service.title}
                  value={`item-${index}`}
                  onMouseEnter={() => handleServiceMouseEnter(index)}
                >
                  <AccordionPrimitive.Header className="flex">
                    <AccordionPrimitive.Trigger
                      data-slot="accordion-trigger"
                      className="group/trigger focus-visible:border-ring focus-visible:ring-ring/50 flex flex-1 items-center justify-between gap-4 py-4 text-left text-lg font-medium outline-none focus-visible:ring-[3px] disabled:pointer-events-none disabled:opacity-50 sm:text-xl lg:text-[26px]"
                    >
                      <span>
                        {index + 1}. {service.title}
                      </span>
                      <span className="text-primary ring-muted-foreground/40 relative flex size-6 shrink-0 items-center justify-center rounded-full ring-1">
                        <PlusIcon className="pointer-events-none absolute size-4 rotate-0 opacity-100 transition-all duration-300 group-data-[state=open]/trigger:rotate-90 group-data-[state=open]/trigger:opacity-0" />
                        <MinusIcon className="pointer-events-none absolute size-4 -rotate-90 opacity-0 transition-all duration-300 group-data-[state=open]/trigger:rotate-0 group-data-[state=open]/trigger:opacity-100" />
                      </span>
                    </AccordionPrimitive.Trigger>
                  </AccordionPrimitive.Header>
                  <AccordionPrimitive.Content
                    data-slot="accordion-content"
                    className="data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down overflow-hidden"
                  >
                    <div className="mt-2 space-y-4 pb-4">
                      <p className="text-sm font-medium tracking-wide uppercase">{service.duration}</p>
                      <p className="text-muted-foreground mb-1 flex flex-wrap items-center gap-3 text-sm font-medium tracking-wide uppercase">
                        {service.tools.map((tool, toolIndex) => (
                          <span key={tool} className="flex items-center gap-2">
                            {tool}
                            {toolIndex < service.tools.length - 1 && <span className="text-primary">✦</span>}
                          </span>
                        ))}
                      </p>
                      <p className="text-muted-foreground text-base">{service.description}</p>
                    </div>
                  </AccordionPrimitive.Content>
                </AccordionItem>
              ))}
            </Accordion>

            <motion.div
              style={{ x: offsetX, y: offsetY, rotate: tilt, opacity: hoveredIndex === null ? 0 : 1 }}
              className="bg-card ring-foreground/10 pointer-events-none absolute top-0 left-0 z-10 block w-44 rounded-lg p-1 shadow-xl ring-1 transition-opacity duration-200"
            >
              {displayedIndex !== null && (
                <img
                  src={services[displayedIndex].image}
                  alt=""
                  aria-hidden="true"
                  loading="lazy"
                  className="h-auto w-full rounded-lg object-cover"
                />
              )}
            </motion.div>
          </div>
        </MotionPreset>
      </div>
    </section>
  );
};

export default FAQ;
