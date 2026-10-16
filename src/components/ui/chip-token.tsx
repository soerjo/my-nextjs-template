import { cn } from '@/utils';
import { X } from 'lucide-react';

interface ChipTokenProps {
  label: string;
  dotColor?: string;
  onRemove?: () => void;
  className?: string;
}

export function ChipToken({ label, dotColor, onRemove, className }: ChipTokenProps) {
  return (
    <span
      className={cn(
        'inline-flex h-8 items-center gap-1.5 rounded-full border border-border bg-muted/50 px-4 py-0.5 text-xs font-medium text-foreground',
        className,
      )}
    >
      {dotColor && <span className="size-2 rounded-full shrink-0" style={{ backgroundColor: dotColor }} />}
      <span>{label}</span>
      {onRemove && (
        <button
          type="button"
          onClick={onRemove}
          className="ml-0.5 rounded-full p-0.5 text-muted-foreground hover:bg-muted hover:text-foreground focus:outline-none"
        >
          <X className="size-3" />
        </button>
      )}
    </span>
  );
}
