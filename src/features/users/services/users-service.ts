import { apiClient } from "@/lib";
import { API_ROUTES } from "@/constants";
import type { ApiResponse } from "@/types";

export type UserRole = "ADMIN" | "USER" | "SYSTEM";

export interface UserListItem {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UserDetail extends UserListItem {
  organizationId?: string;
  organization?: { id: string; name: string };
  role?: UserRole;
}

export interface CreateUserPayload {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  organizationId: string;
  role?: UserRole;
}

export interface UpdateUserPayload {
  email?: string;
  firstName?: string;
  lastName?: string;
  organizationId?: string;
  role?: UserRole;
}

const USERS_ROUTE = "/api/users";

export class UsersService {
  static async list(): Promise<UserListItem[]> {
    const res = await apiClient.get<ApiResponse<UserListItem[]>>(USERS_ROUTE);
    return res.data ?? [];
  }

  static async getById(id: string): Promise<UserDetail> {
    const res = await apiClient.get<ApiResponse<UserDetail>>(`${USERS_ROUTE}/${id}`);
    return res.data;
  }

  static async create(data: CreateUserPayload): Promise<UserDetail> {
    const res = await apiClient.post<ApiResponse<UserDetail>>(USERS_ROUTE, data);
    return res.data;
  }

  static async update(id: string, data: UpdateUserPayload): Promise<UserDetail> {
    const res = await apiClient.patch<ApiResponse<UserDetail>>(`${USERS_ROUTE}/${id}`, data);
    return res.data;
  }

  static async remove(id: string): Promise<void> {
    await apiClient.delete(`${USERS_ROUTE}/${id}`);
  }

  static async me(): Promise<UserDetail> {
    const res = await apiClient.get<ApiResponse<UserDetail>>(API_ROUTES.me);
    return res.data;
  }
}