'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';

import MenuDropdown from '@/components/shadcn-studio/blocks/menu-dropdown';
import MenuNavigation from '@/components/shadcn-studio/blocks/menu-navigation';
import type { NavigationSection } from '@/components/shadcn-studio/blocks/menu-navigation';

import { cn } from '@/utils/index';

import BistroLogo from '@/assets/svg/bistro-logo';
import { MenuIcon } from 'lucide-react';

type HeaderProps = {
  navigationData: NavigationSection[];
  className?: string;
};

const Header = ({ navigationData, className }: HeaderProps) => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <header
      className={cn(
        'fixed top-0 z-50 h-17.5 w-full border-b transition-all duration-300',
        {
          'bg-background shadow-md': isScrolled,
        },
        className,
      )}
    >
      <div className="mx-auto flex h-full max-w-7xl items-center justify-between gap-6 px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <a href="#" className="flex items-center gap-3">
          <BistroLogo />
          <span className="text-primary text-[20px] font-semibold">Bistro</span>
        </a>

        {/* Navigation */}
        <MenuNavigation
          navigationData={navigationData}
          className="max-lg:hidden [&_[data-slot=navigation-menu-list]]:gap-1"
        />

        {/* Actions */}
        {/* Navigation for small screens */}
        <div className="flex gap-3">
          <Button size="lg" className="rounded-full" asChild>
            <a href="#">Book table</a>
          </Button>

          <MenuDropdown
            align="end"
            navigationData={navigationData}
            trigger={
              <Button variant="outline" size="icon-lg" className="rounded-full lg:hidden">
                <MenuIcon />
                <span className="sr-only">Menu</span>
              </Button>
            }
          />
        </div>
      </div>
    </header>
  );
};

export default Header;
