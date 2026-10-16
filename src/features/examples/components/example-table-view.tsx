'use client';

import * as React from 'react';
import {
  type ColumnDef,
  type SortingState,
  rowPaginationFeature,
  rowSortingFeature,
  tableFeatures,
  useTable,
} from '@tanstack/react-table';
import { format } from 'date-fns';
import { ArrowUpDown, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useExampleTable } from '@/features/examples/hooks';
import type { ExampleRecord, TableSort } from '@/features/examples/types';
import { cn } from '@/utils';

const features = tableFeatures({
  rowSortingFeature,
  rowPaginationFeature,
});

const PAGE_SIZE_OPTIONS = [10, 20, 30, 40, 50] as const;

const STATUS_STYLES: Record<string, string> = {
  active: 'bg-primary/10 text-primary',
  pending: 'bg-muted text-muted-foreground',
  inactive: 'bg-destructive/10 text-destructive',
};

function SortableHeader({
  column,
  label,
}: {
  column: {
    toggleSorting: (desc?: boolean, isMulti?: boolean) => void;
    getIsSorted: () => false | 'asc' | 'desc';
  };
  label: string;
}) {
  return (
    <Button
      variant="ghost"
      size="sm"
      className="-ml-2.5 data-[state=open]:bg-accent"
      onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
    >
      {label}
      <ArrowUpDown className="ml-2 h-4 w-4" />
    </Button>
  );
}

export function ExampleTableView() {
  const [pageIndex, setPageIndex] = React.useState(0);
  const [pageSize, setPageSize] = React.useState(10);
  const [sorting, setSorting] = React.useState<SortingState>([{ id: 'createdAt', desc: true }]);

  const queryParams = React.useMemo(() => {
    const tableSorts: TableSort[] = sorting.map((s) => ({ id: s.id, desc: s.desc }));

    return {
      pageIndex,
      pageSize,
      sorting: tableSorts,
    };
  }, [pageIndex, pageSize, sorting]);

  const { data, isLoading, isFetching } = useExampleTable(queryParams);

  const columns = React.useMemo<ColumnDef<typeof features, ExampleRecord>[]>(
    () => [
      {
        accessorKey: 'id',
        header: ({ column }) => <SortableHeader column={column} label="ID" />,
        cell: ({ row }) => <span className="font-mono text-xs font-medium">{row.getValue('id')}</span>,
      },
      {
        accessorKey: 'name',
        header: ({ column }) => <SortableHeader column={column} label="Name" />,
        cell: ({ row }) => <span className="font-medium">{row.getValue('name')}</span>,
      },
      {
        accessorKey: 'email',
        header: ({ column }) => <SortableHeader column={column} label="Email" />,
        cell: ({ row }) => <span className="text-muted-foreground">{row.getValue('email')}</span>,
      },
      {
        accessorKey: 'role',
        header: 'Role',
        cell: ({ row }) => (
          <span className="inline-flex items-center rounded-md bg-muted px-2 py-1 text-xs font-medium text-muted-foreground capitalize">
            {row.getValue('role')}
          </span>
        ),
      },
      {
        accessorKey: 'status',
        header: 'Status',
        cell: ({ row }) => {
          const status = row.getValue<string>('status');

          return (
            <span
              className={cn(
                'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize',
                STATUS_STYLES[status] ?? 'bg-muted text-muted-foreground',
              )}
            >
              {status}
            </span>
          );
        },
      },
      {
        accessorKey: 'amount',
        header: ({ column }) => <SortableHeader column={column} label="Amount" />,
        cell: ({ row }) => {
          const amount = Number(row.getValue('amount'));

          return (
            <span className="font-medium">
              {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount)}
            </span>
          );
        },
      },
      {
        accessorKey: 'createdAt',
        header: ({ column }) => <SortableHeader column={column} label="Created At" />,
        cell: ({ row }) => (
          <span className="text-muted-foreground">{format(new Date(row.getValue<string>('createdAt')), 'PP')}</span>
        ),
      },
    ],
    [],
  );

  const rows = data?.rows ?? [];
  const rowCount = data?.rowCount ?? 0;
  const pageCount = Math.max(Math.ceil(rowCount / pageSize), 1);

  const table = useTable({
    features,
    data: rows,
    columns,
    state: {
      sorting,
      pagination: { pageIndex, pageSize },
    },
    onSortingChange: (updater) => {
      setSorting(updater);
      setPageIndex(0);
    },
    manualPagination: true,
    manualSorting: true,
    pageCount,
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">User Records</h1>
          <p className="text-sm text-muted-foreground">
            Server-side paginated and sorted table using TanStack Table &amp; React Query.
          </p>
        </div>
        {isFetching && !isLoading && (
          <div className="flex animate-pulse items-center gap-2 text-xs text-muted-foreground">
            <span className="h-2 w-2 rounded-full bg-primary" />
            Syncing...
          </div>
        )}
      </div>

      <div className="rounded-md border border-border bg-card">
        <div className="relative w-full overflow-auto">
          <table className="w-full caption-bottom text-sm">
            <thead className="border-b border-border bg-muted/50 text-muted-foreground">
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id} className="border-b border-border transition-colors">
                  {headerGroup.headers.map((header) => (
                    <th key={header.id} className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                      {header.isPlaceholder ? null : <table.FlexRender header={header} />}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody className="divide-y divide-border [&_tr:last-child]:border-0">
              {isLoading ? (
                Array.from({ length: pageSize }).map((_, rowIdx) => (
                  <tr key={`skeleton-${rowIdx}`}>
                    {columns.map((_, colIdx) => (
                      <td key={`skeleton-cell-${colIdx}`} className="p-4 align-middle">
                        <Skeleton className="h-5 w-full rounded" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : table.getRowModel().rows.length ? (
                table.getRowModel().rows.map((row) => (
                  <tr key={row.id} className="transition-colors hover:bg-muted/50">
                    {row.getAllCells().map((cell) => (
                      <td key={cell.id} className="p-4 align-middle">
                        <table.FlexRender cell={cell} />
                      </td>
                    ))}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={columns.length} className="h-24 text-center text-muted-foreground">
                    No results.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="flex flex-col gap-3 border-t border-border px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>
              Showing {rowCount === 0 ? 0 : pageIndex * pageSize + 1} to{' '}
              {Math.min((pageIndex + 1) * pageSize, rowCount)} of {rowCount} results
            </span>
            <select
              aria-label="Rows per page"
              className="h-8 rounded-md border border-border bg-background px-2 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
              value={pageSize}
              onChange={(event) => {
                setPageSize(Number(event.target.value));
                setPageIndex(0);
              }}
            >
              {PAGE_SIZE_OPTIONS.map((size) => (
                <option key={size} value={size}>
                  {size} rows
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">
              Page {pageIndex + 1} of {pageCount}
            </span>
            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setPageIndex(0)}
                disabled={pageIndex === 0 || isLoading}
              >
                <ChevronsLeft className="h-4 w-4" />
                <span className="sr-only">First page</span>
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setPageIndex((prev) => Math.max(prev - 1, 0))}
                disabled={pageIndex === 0 || isLoading}
              >
                <ChevronLeft className="h-4 w-4" />
                <span className="sr-only">Previous page</span>
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setPageIndex((prev) => Math.min(prev + 1, pageCount - 1))}
                disabled={pageIndex >= pageCount - 1 || isLoading}
              >
                <ChevronRight className="h-4 w-4" />
                <span className="sr-only">Next page</span>
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setPageIndex(pageCount - 1)}
                disabled={pageIndex >= pageCount - 1 || isLoading}
              >
                <ChevronsRight className="h-4 w-4" />
                <span className="sr-only">Last page</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
