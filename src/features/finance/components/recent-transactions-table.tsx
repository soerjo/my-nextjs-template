'use client';

import * as React from 'react';
import { type ColumnDef, rowPaginationFeature, tableFeatures, useTable } from '@tanstack/react-table';
import { format } from 'date-fns';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useFinanceTransactions } from '@/features/finance/hooks';
import type { FinanceTransaction, FinanceTransactionMonth } from '@/features/finance/types';
import { cn } from '@/utils';

const features = tableFeatures({
  rowPaginationFeature,
});

const PAGE_SIZE_OPTIONS = [10, 20, 30] as const;

export function RecentTransactionsTable() {
  const [month, setMonth] = React.useState<FinanceTransactionMonth>('this-month');
  const [pageIndex, setPageIndex] = React.useState(0);
  const [pageSize, setPageSize] = React.useState(10);

  const queryParams = React.useMemo(
    () => ({
      month,
      pageIndex,
      pageSize,
    }),
    [month, pageIndex, pageSize],
  );

  const { data, isLoading } = useFinanceTransactions(queryParams);

  const columns = React.useMemo<ColumnDef<typeof features, FinanceTransaction>[]>(
    () => [
      {
        accessorKey: 'name',
        header: 'Merchant / Description',
        cell: ({ row }) => (
          <div>
            <p className="font-medium text-foreground">{row.getValue('name')}</p>
            <p className="text-xs text-muted-foreground">{row.original.note}</p>
          </div>
        ),
      },
      {
        accessorKey: 'type',
        header: 'Type',
        cell: ({ row }) => <span className="text-xs font-medium text-muted-foreground">{row.getValue('type')}</span>,
      },
      {
        accessorKey: 'date',
        header: 'Date & Time',
        cell: ({ row }) => (
          <div>
            <p className="text-xs text-foreground">{format(new Date(row.getValue('date')), 'MMM d, yyyy')}</p>
            <p className="text-xs text-muted-foreground">{row.original.time}</p>
          </div>
        ),
      },
      {
        accessorKey: 'amount',
        header: 'Amount',
        cell: ({ row }) => {
          const amount = Number(row.getValue('amount'));
          const isPositive = amount > 0;

          return (
            <span className={cn('font-semibold text-xs', isPositive ? 'text-primary' : 'text-foreground')}>
              {isPositive ? '+' : ''}
              {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount)}
            </span>
          );
        },
      },
      {
        accessorKey: 'status',
        header: 'Status',
        cell: ({ row }) => {
          const status = row.getValue<FinanceTransaction['status']>('status');

          if (status === 'completed') {
            return <Badge variant="default">Completed</Badge>;
          }
          if (status === 'failed') {
            return <Badge variant="destructive">Failed</Badge>;
          }
          return (
            <Badge variant="secondary" className="text-warning">
              Pending
            </Badge>
          );
        },
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
      pagination: { pageIndex, pageSize },
    },
    manualPagination: true,
    pageCount,
  });

  return (
    <Card className="border-border bg-card">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <div>
          <CardTitle className="text-base font-semibold">Recent Transactions</CardTitle>
          <p className="text-xs text-muted-foreground">Detailed transaction logs with status filters.</p>
        </div>
        <select
          aria-label="Filter transactions by month"
          className="h-8 rounded-md border border-border bg-background px-3 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
          value={month}
          onChange={(event) => {
            setMonth(event.target.value as FinanceTransactionMonth);
            setPageIndex(0);
          }}
        >
          <option value="this-month">This Month</option>
          <option value="last-month">Last Month</option>
          <option value="all">All Time</option>
        </select>
      </CardHeader>
      <CardContent className="p-0">
        <div className="relative w-full overflow-auto">
          <table className="w-full caption-bottom text-sm">
            <thead className="border-b border-border bg-muted/50 text-muted-foreground">
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id} className="border-b border-border">
                  {headerGroup.headers.map((header) => (
                    <th key={header.id} className="h-10 px-4 text-left align-middle font-medium text-muted-foreground">
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
                    No transactions found.
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
      </CardContent>
    </Card>
  );
}
