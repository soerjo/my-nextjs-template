import { Card, CardContent } from '@/components/ui/card';
import { Marquee } from '@/components/ui/marquee';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

import { cn } from '@/utils/index';

type brandLogos = {
  image: string;
  name: string;
};

const CONTRIBUTION_LEVEL_STYLES = [
  'bg-primary/10 dark:bg-primary',
  'bg-primary/30 dark:bg-primary/70',
  'bg-primary/50 dark:bg-primary/50',
  'bg-primary/70 dark:bg-primary/30',
  'bg-primary dark:bg-primary/10',
];

const CONTRIBUTION_LEVEL_COUNTS = [0, 1, 3, 5, 8];

const CONTRIBUTION_ROWS = 6;
const CONTRIBUTION_COLUMNS = 39;
const TOTAL_CONTRIBUTION_CELLS = CONTRIBUTION_ROWS * CONTRIBUTION_COLUMNS;
const LATEST_CONTRIBUTION_DATE = new Date(2024, 3, 30);

// Weighted so most cells stay empty, like a real contribution graph
const CONTRIBUTION_LEVEL_WEIGHTS = [40, 25, 20, 10, 5];

const getRandomContributionLevel = () => {
  const roll = Math.random() * 100;
  let cumulativeWeight = 0;

  for (let level = 0; level < CONTRIBUTION_LEVEL_WEIGHTS.length; level++) {
    cumulativeWeight += CONTRIBUTION_LEVEL_WEIGHTS[level];
    if (roll < cumulativeWeight) return level;
  }

  return CONTRIBUTION_LEVEL_WEIGHTS.length - 1;
};

const buildContributionCell = (rowIndex: number, columnIndex: number) => {
  const level = getRandomContributionLevel();
  const chronologicalIndex = columnIndex * CONTRIBUTION_ROWS + rowIndex;
  const daysAgo = TOTAL_CONTRIBUTION_CELLS - 1 - chronologicalIndex;

  const date = new Date(LATEST_CONTRIBUTION_DATE);

  date.setDate(date.getDate() - daysAgo);

  return { level, count: CONTRIBUTION_LEVEL_COUNTS[level], date };
};

const CONTRIBUTION_GRID = Array.from({ length: CONTRIBUTION_ROWS }, (_, rowIndex) =>
  Array.from({ length: CONTRIBUTION_COLUMNS }, (_, columnIndex) => buildContributionCell(rowIndex, columnIndex)),
);

const LogoCloud = ({ brandLogos }: { brandLogos: brandLogos[] }) => {
  const half = Math.ceil(brandLogos.length / 2);
  const logoRows = [brandLogos.slice(0, half), brandLogos.slice(half)];

  return (
    <section className="py-8 sm:py-16 lg:py-24">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <Card className="ring-foreground/10 gap-6 rounded-3xl p-6 shadow-lg ring-1">
          <CardContent className="gap-0 space-y-4 p-0">
            <div>
              <p className="text-sm font-semibold">@zolt_mercer</p>
              <p className="text-muted-foreground text-xs opacity-75">864 contributions in the template timeline</p>
            </div>

            <div className="overflow-x-auto max-md:pr-6">
              <div className="space-y-1">
                {CONTRIBUTION_GRID.map((row, rowIndex) => (
                  <div key={rowIndex} className="flex gap-1">
                    {row.map((cell, columnIndex) => {
                      const dateLabel = cell.date.toLocaleDateString('en-US', { day: 'numeric', month: 'short' });

                      return (
                        <Tooltip key={columnIndex}>
                          <TooltipTrigger asChild>
                            <span
                              className={cn(
                                'size-3.5 rounded-xs transition-transform duration-150 hover:scale-125 max-lg:shrink-0 sm:size-5',
                                CONTRIBUTION_LEVEL_STYLES[cell.level],
                              )}
                            />
                          </TooltipTrigger>
                          <TooltipContent className="dark:text-primary bg-black font-medium [&>*:last-child]:hidden">
                            <span className="font-semibold">
                              {cell.count} contribution{cell.count === 1 ? '' : 's'}
                            </span>{' '}
                            on {dateLabel}
                          </TooltipContent>
                        </Tooltip>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
          </CardContent>

          <div className="border-border -mx-6 border-t" />

          <div className="min-w-0 space-y-8">
            {logoRows.map((row, rowIndex) => (
              <Marquee
                key={rowIndex}
                pauseOnHover
                duration={25}
                gap={2}
                reverse={rowIndex === 1}
                className="mask-[linear-gradient(to_right,transparent,black_5%,black_95%,transparent)] p-0"
              >
                {row.map((logo, logoIndex) => (
                  <div
                    key={`${logo.image}-${logoIndex}`}
                    className="bg-muted flex size-16 shrink-0 items-center justify-center rounded-md"
                  >
                    <img src={logo.image} alt={logo.name} loading="lazy" className="size-10 grayscale" />
                  </div>
                ))}
              </Marquee>
            ))}
          </div>
        </Card>
      </div>
    </section>
  );
};

export default LogoCloud;
