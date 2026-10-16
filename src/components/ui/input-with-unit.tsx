import * as React from 'react';
import { cn } from '@/utils';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface InputWithUnitProps extends React.ComponentProps<typeof Input> {
  unit: string;
  onUnitChange: (unit: string) => void;
  units: string[];
}

export function InputWithUnit({ unit, onUnitChange, units, className, ...props }: InputWithUnitProps) {
  return (
    <div className={cn('relative flex rounded-md shadow-xs', className)}>
      <Input className="rounded-r-none border-r-0 focus-visible:z-10" {...props} />
      <Select value={unit} onValueChange={onUnitChange}>
        <SelectTrigger className="w-24 rounded-l-none border-l bg-muted/50 focus-visible:relative focus-visible:z-10">
          <SelectValue placeholder="Unit" />
        </SelectTrigger>
        <SelectContent>
          {units.map((u) => (
            <SelectItem key={u} value={u}>
              {u}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
