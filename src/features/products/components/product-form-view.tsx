'use client';

import * as React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useFieldArray, useForm } from 'react-hook-form';
import { Calendar as CalendarIcon, Loader2, Package } from 'lucide-react';
import { format } from 'date-fns';
import type { DateRange } from 'react-day-picker';

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { AppLink } from '@/components/ui';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { SearchMultiSelect } from '@/components/ui/search-multi-select';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useCreateProduct, useProductOptions } from '@/features/products/hooks';
import { buildVariantRows } from '@/features/products/lib';
import { productFormSchema, type ProductFormValues } from '@/features/products/types';
import { cn } from '@/utils';

const DEFAULT_VALUES: ProductFormValues = {
  title: '',
  sku: '',
  colours: ['forest', 'lime'],
  sizes: ['s', 'm', 'l'],
  variants: buildVariantRows(['forest', 'lime'], ['s', 'm', 'l']),
  currency: 'USD',
  basePrice: '149.99',
  promoPrice: '119.99',
  promoType: 'percentage',
  promoDateRange: { from: undefined, to: undefined },
};

export function ProductFormView() {
  const { colours: colourOptions, sizes: sizeOptions } = useProductOptions();

  const { mutateAsync, isPending } = useCreateProduct();

  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<ProductFormValues>({
    resolver: zodResolver(productFormSchema),
    defaultValues: DEFAULT_VALUES,
  });

  const { fields, replace } = useFieldArray({
    control,
    name: 'variants',
  });

  /* eslint-disable-next-line react-hooks/incompatible-library */
  const watchedColours = watch('colours');
  const watchedSizes = watch('sizes');

  // Handle colour/size changes and rebuild variant matrix
  const handleColoursChange = (newColours: string[]) => {
    setValue('colours', newColours, { shouldValidate: true });
    const updated = buildVariantRows(newColours, watchedSizes, control._formValues.variants);
    replace(updated);
  };

  const handleSizesChange = (newSizes: string[]) => {
    setValue('sizes', newSizes, { shouldValidate: true });
    const updated = buildVariantRows(watchedColours, newSizes, control._formValues.variants);
    replace(updated);
  };

  // Group variants by colour for merged cell rendering
  const colourGroups = React.useMemo(() => {
    const map = new Map<string, typeof fields>();
    for (const field of fields) {
      const list = map.get(field.colour) || [];
      list.push(field);
      map.set(field.colour, list);
    }
    // Convert map to array of groups
    const result: Array<{ colour: string; rows: typeof fields; startIndex: number }> = [];
    let currentIndex = 0;
    for (const [colour, rows] of map.entries()) {
      result.push({ colour, rows, startIndex: currentIndex });
      currentIndex += rows.length;
    }
    return result;
  }, [fields]);

  const [dateRange, setDateRange] = React.useState<DateRange | undefined>();

  async function onSubmit(values: ProductFormValues) {
    try {
      await mutateAsync(values);
    } catch {
      // Handled by mutation error toast
    }
  }

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <AppLink href="/dashboard">Dashboard</AppLink>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Products</BreadcrumbPage>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage className="font-semibold text-foreground">New Product</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Create New Product</h1>
        <p className="text-sm text-muted-foreground">Configure product variations, pricing matrix, and attributes.</p>
      </div>

      <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
        {/* Basic Info Card */}
        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle className="text-base font-semibold">Basic Information</CardTitle>
            <CardDescription>General product identification and naming.</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="title">
                Product Title <span className="text-destructive">*</span>
              </Label>
              <Input id="title" placeholder="e.g. Premium Wool Overshirt" {...register('title')} />
              {errors.title && <p className="text-xs text-destructive">{errors.title.message}</p>}
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="sku">
                SKU <span className="text-destructive">*</span>
              </Label>
              <Input id="sku" placeholder="e.g. OVS-W01-BLK" {...register('sku')} />
              {errors.sku && <p className="text-xs text-destructive">{errors.sku.message}</p>}
            </div>
          </CardContent>
        </Card>

        {/* 6 Tabs */}
        <Tabs defaultValue="variations" className="w-full">
          <TabsList className="w-full justify-start overflow-x-auto rounded-xl bg-muted p-1">
            <TabsTrigger value="general">General info</TabsTrigger>
            <TabsTrigger value="variations">Variations and price</TabsTrigger>
            <TabsTrigger value="inventory">Inventory</TabsTrigger>
            <TabsTrigger value="shipping">Shipping</TabsTrigger>
            <TabsTrigger value="seo">SEO</TabsTrigger>
            <TabsTrigger value="attributes">Attributes</TabsTrigger>
          </TabsList>

          {/* Placeholder tabs */}
          {['general', 'inventory', 'shipping', 'seo', 'attributes'].map((tabVal) => (
            <TabsContent key={tabVal} value={tabVal} className="mt-4">
              <Card className="border-border bg-card">
                <CardContent className="flex flex-col items-center justify-center p-12 text-center text-muted-foreground">
                  <Package className="size-10 opacity-40 mb-2" />
                  <p className="font-medium capitalize">{tabVal} configuration panel</p>
                  <p className="text-xs mt-1">This section is a placeholder as specified.</p>
                </CardContent>
              </Card>
            </TabsContent>
          ))}

          {/* Variations and price tab (Fully implemented) */}
          <TabsContent value="variations" className="mt-4 space-y-6">
            {/* Colour & Size Selectors */}
            <Card className="border-border bg-card">
              <CardHeader>
                <CardTitle className="text-base font-semibold">Product Options &amp; Attributes</CardTitle>
                <CardDescription>Select available colours and sizes to generate the variant matrix.</CardDescription>
              </CardHeader>
              <CardContent className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div className="flex flex-col gap-2">
                  <Label>Colours</Label>
                  <SearchMultiSelect
                    options={colourOptions}
                    value={watchedColours}
                    onChange={handleColoursChange}
                    placeholder="Select colours..."
                  />
                  {errors.colours && <p className="text-xs text-destructive">{errors.colours.message}</p>}
                </div>

                <div className="flex flex-col gap-2">
                  <Label>Sizes</Label>
                  <SearchMultiSelect
                    options={sizeOptions}
                    value={watchedSizes}
                    onChange={handleSizesChange}
                    placeholder="Select sizes..."
                  />
                  {errors.sizes && <p className="text-xs text-destructive">{errors.sizes.message}</p>}
                </div>
              </CardContent>
            </Card>

            {/* Variant Matrix Grid */}
            <Card className="border-border bg-card">
              <CardHeader>
                <CardTitle className="text-base font-semibold">Variant Matrix Grid</CardTitle>
                <CardDescription>Cartesian product of colours and sizes with sparse pricing overrides.</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <div className="relative w-full overflow-auto">
                  <table className="w-full caption-bottom text-sm">
                    <thead className="border-b border-border bg-muted/50 text-muted-foreground">
                      <tr className="border-b border-border">
                        <th className="h-10 px-4 text-left font-medium">Colour</th>
                        <th className="h-10 px-4 text-left font-medium">Size</th>
                        <th className="h-10 px-4 text-left font-medium">Stock</th>
                        <th className="h-10 px-4 text-left font-medium">Price</th>
                        <th className="h-10 px-4 text-left font-medium">Discount</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border [&_tr:last-child]:border-0">
                      {colourGroups.map((group) => {
                        const colourObj = colourOptions.find((c) => c.value === group.colour);
                        const colourLabel = colourObj?.label ?? group.colour;

                        return group.rows.map((field, rowIdx) => {
                          const absoluteIdx = fields.findIndex((f) => f.key === field.key);
                          const sizeObj = sizeOptions.find((s) => s.value === field.size);
                          const sizeLabel = sizeObj?.label ?? field.size;

                          return (
                            <tr key={field.key} className="transition-colors hover:bg-muted/50">
                              {rowIdx === 0 && (
                                <td
                                  rowSpan={group.rows.length}
                                  className="p-4 align-middle font-medium border-r border-border bg-muted/20"
                                >
                                  <div className="flex items-center gap-2">
                                    {colourObj?.color && (
                                      <span
                                        className="size-3 rounded-full shrink-0 border border-border"
                                        style={{ backgroundColor: colourObj.color }}
                                      />
                                    )}
                                    <span>{colourLabel}</span>
                                  </div>
                                </td>
                              )}
                              <td className="p-4 align-middle font-medium text-muted-foreground">{sizeLabel}</td>
                              <td className="p-4 align-middle">
                                <Input
                                  className="w-24 h-8"
                                  type="number"
                                  {...register(`variants.${absoluteIdx}.stock` as const)}
                                />
                              </td>
                              {rowIdx === 0 && (
                                <>
                                  <td
                                    rowSpan={group.rows.length}
                                    className="p-4 align-middle border-l border-border bg-muted/20"
                                  >
                                    <Input
                                      className="w-28 h-8"
                                      type="number"
                                      step="0.01"
                                      placeholder="149.99"
                                      {...register(`variants.${absoluteIdx}.price` as const)}
                                    />
                                  </td>
                                  <td rowSpan={group.rows.length} className="p-4 align-middle bg-muted/20">
                                    <Input
                                      className="w-24 h-8"
                                      type="number"
                                      step="0.01"
                                      placeholder="0.00"
                                      {...register(`variants.${absoluteIdx}.discount` as const)}
                                    />
                                  </td>
                                </>
                              )}
                            </tr>
                          );
                        });
                      })}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            {/* Price & Offer Sub-panel */}
            <Card className="border-border bg-card">
              <CardHeader>
                <CardTitle className="text-base font-semibold">Price &amp; Offer</CardTitle>
                <CardDescription>Base pricing, promotional discounts, and campaign date range.</CardDescription>
              </CardHeader>
              <CardContent className="grid grid-cols-1 gap-6 sm:grid-cols-3">
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="basePrice">Base Price</Label>
                  <div className="flex">
                    <Select
                      defaultValue="USD"
                      onValueChange={(val) => setValue('currency', val as ProductFormValues['currency'])}
                    >
                      <SelectTrigger className="w-20 rounded-r-none border-r-0">
                        <SelectValue placeholder="USD" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="USD">USD</SelectItem>
                        <SelectItem value="EUR">EUR</SelectItem>
                        <SelectItem value="GBP">GBP</SelectItem>
                        <SelectItem value="IDR">IDR</SelectItem>
                      </SelectContent>
                    </Select>
                    <Input id="basePrice" className="rounded-l-none" placeholder="149.99" {...register('basePrice')} />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="promoPrice">Promo Price &amp; Type</Label>
                  <div className="flex">
                    <Input
                      id="promoPrice"
                      className="rounded-r-none border-r-0"
                      placeholder="119.99"
                      {...register('promoPrice')}
                    />
                    <Select
                      defaultValue="percentage"
                      onValueChange={(val) => setValue('promoType', val as ProductFormValues['promoType'])}
                    >
                      <SelectTrigger className="w-28 rounded-l-none">
                        <SelectValue placeholder="Type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="percentage">% Off</SelectItem>
                        <SelectItem value="fixed">Fixed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <Label>Campaign Date Range</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          'w-full justify-start text-left font-normal',
                          !dateRange && 'text-muted-foreground',
                        )}
                      >
                        <CalendarIcon className="mr-2 size-4" />
                        {dateRange?.from ? (
                          dateRange.to ? (
                            <>
                              {format(dateRange.from, 'LLL dd, y')} - {format(dateRange.to, 'LLL dd, y')}
                            </>
                          ) : (
                            format(dateRange.from, 'LLL dd, y')
                          )
                        ) : (
                          <span>Pick campaign dates</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="range"
                        selected={dateRange}
                        onSelect={(range) => {
                          setDateRange(range);
                          setValue('promoDateRange', {
                            from: range?.from ? range.from.toISOString() : undefined,
                            to: range?.to ? range.to.toISOString() : undefined,
                          });
                        }}
                        numberOfMonths={2}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Submit Action */}
        <div className="flex items-center justify-end gap-3">
          <Button disabled={isPending} type="submit" size="lg">
            {isPending ? (
              <>
                <Loader2 className="animate-spin mr-2" />
                Publishing Product...
              </>
            ) : (
              'Publish Product'
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
