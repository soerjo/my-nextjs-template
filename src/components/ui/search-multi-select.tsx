'use client';

import * as React from 'react';
import { Check, ChevronsUpDown, SearchX } from 'lucide-react';
import { cn } from '@/utils';
import { Button } from '@/components/ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ChipToken } from './chip-token';

export interface Option {
  label: string;
  value: string;
  color?: string;
}

interface SearchMultiSelectProps {
  options: Option[];
  value: string[];
  onChange: (value: string[]) => void;
  placeholder?: string;
  emptyMessage?: string;
  className?: string;
}

export function SearchMultiSelect({
  options,
  value,
  onChange,
  placeholder = 'Select options...',
  emptyMessage = 'No option found.',
  className,
}: SearchMultiSelectProps) {
  const [open, setOpen] = React.useState(false);

  const selectedOptions = options.filter((opt) => value.includes(opt.value));

  const toggleOption = (optValue: string) => {
    if (value.includes(optValue)) {
      onChange(value.filter((v) => v !== optValue));
    } else {
      onChange([...value, optValue]);
    }
  };

  const selectAll = () => {
    onChange(options.map((opt) => opt.value));
  };

  const clearAll = () => {
    onChange([]);
  };

  return (
    <div className={cn('flex flex-col gap-2', className)}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full h-10 justify-between rounded-lg font-medium text-muted-foreground hover:text-foreground data-[state=open]:border-primary data-[state=open]:ring-1 data-[state=open]:ring-primary"
          >
            {value.length > 0 ? `${value.length} selected` : placeholder}
            <ChevronsUpDown className="ml-2 size-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0" align="start">
          <Command>
            <CommandInput placeholder="Search option..." />
            <CommandList>
              <CommandEmpty className="py-6 flex flex-col items-center justify-center gap-2 text-muted-foreground">
                <SearchX className="size-6 opacity-50" />
                <span>{emptyMessage}</span>
              </CommandEmpty>
              <CommandGroup>
                {options.map((option) => {
                  const isSelected = value.includes(option.value);
                  return (
                    <CommandItem
                      key={option.value}
                      value={option.label}
                      onSelect={() => toggleOption(option.value)}
                      className={cn(isSelected && 'bg-primary/15 font-medium')}
                    >
                      <div
                        className={cn(
                          'mr-2 flex size-4 items-center justify-center rounded-sm border border-primary',
                          isSelected ? 'bg-primary text-primary-foreground' : 'opacity-50 [&_svg]:invisible',
                        )}
                      >
                        <Check className="size-4" />
                      </div>
                      {option.color && (
                        <span
                          className="mr-2 size-2.5 rounded-full shrink-0"
                          style={{ backgroundColor: option.color }}
                        />
                      )}
                      <span>{option.label}</span>
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            </CommandList>
            <div className="flex items-center justify-between border-t border-border px-2 py-1.5 bg-muted/20">
              <Button
                variant="ghost"
                size="xs"
                className="h-7 px-2 text-xs text-muted-foreground hover:text-foreground"
                onClick={(e) => {
                  e.preventDefault();
                  selectAll();
                }}
              >
                Select all
              </Button>
              <Button
                variant="ghost"
                size="xs"
                className="h-7 px-2 text-xs text-muted-foreground hover:text-foreground"
                onClick={(e) => {
                  e.preventDefault();
                  clearAll();
                }}
              >
                Clear all
              </Button>
            </div>
          </Command>
        </PopoverContent>
      </Popover>

      {selectedOptions.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {selectedOptions.map((opt) => (
            <ChipToken
              key={opt.value}
              label={opt.label}
              dotColor={opt.color}
              onRemove={() => toggleOption(opt.value)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
