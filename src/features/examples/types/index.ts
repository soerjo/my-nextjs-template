import { z } from 'zod';

export type ExampleRole = 'admin' | 'editor' | 'viewer';

export type ExampleStatus = 'active' | 'pending' | 'inactive';

export interface ExampleRecord {
  id: string;
  name: string;
  email: string;
  role: ExampleRole;
  status: ExampleStatus;
  amount: number;
  createdAt: string;
}

export interface TableSort {
  id: string;
  desc: boolean;
}

export interface TableQueryParams {
  pageIndex: number;
  pageSize: number;
  sorting: TableSort[];
}

export interface TableQueryResult {
  rows: ExampleRecord[];
  rowCount: number;
}

export interface DashboardPoint {
  date: string;
  revenue: number;
  orders: number;
}

export interface DashboardSummary {
  totalRevenue: number;
  totalOrders: number;
  averageOrderValue: number;
}

export interface DashboardResult {
  points: DashboardPoint[];
  summary: DashboardSummary;
}

export const profileEmailSchema = z.object({
  label: z.string().min(1, 'Label is required'),
  address: z.string().min(1, 'Email is required').email('Invalid email address'),
});

export type ProfileEmailValues = z.infer<typeof profileEmailSchema>;

export const profileFormSchema = z.object({
  fullName: z.string().min(1, 'Full name is required'),
  headline: z.string().min(1, 'Headline is required'),
  bio: z.string().max(280, 'Bio must be 280 characters or less').optional(),
  emails: z.array(profileEmailSchema).min(1, 'Add at least one email address'),
});

export type ProfileFormValues = z.infer<typeof profileFormSchema>;

export interface ProfileFormResult {
  id: string;
  fullName: string;
  headline: string;
  bio?: string;
  emails: ProfileEmailValues[];
  updatedAt: string;
}
