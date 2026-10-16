import * as React from 'react';
import { cn } from '@/utils';

interface SegmentedTab {
  value: string;
  label: string;
}

interface SegmentedTabsProps {
  tabs: SegmentedTab[];
  value: string;
  onValueChange: (value: string) => void;
  className?: string;
}

export function SegmentedTabs({ tabs, value, onValueChange, className }: SegmentedTabsProps) {
  return (
    <div
      className={cn(
        'inline-flex h-9 items-center justify-center rounded-lg bg-muted p-1 text-muted-foreground',
        className,
      )}
    >
      {tabs.map((tab) => {
        const isActive = tab.value === value;
        return (
          <button
            key={tab.value}
            type="button"
            onClick={() => onValueChange(tab.value)}
            className={cn(
              'inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1 text-xs font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
              isActive ? 'bg-background text-foreground shadow-xs font-semibold' : 'hover:text-foreground',
            )}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
