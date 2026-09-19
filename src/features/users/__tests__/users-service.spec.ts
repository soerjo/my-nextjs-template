import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { UsersService } from "@/features/users";
import type {
  CreateUserPayload,
  UpdateUserPayload,
  UserDetail,
  UserListItem,
} from "@/features/users";
import type { ApiResponse } from "@/types";

const mocks = vi.hoisted(() => ({
  get: vi.fn(),
  post: vi.fn(),
  patch: vi.fn(),
  delete: vi.fn(),
}));

vi.mock("@/lib", () => ({
  apiClient: {
    get: mocks.get,
    post: mocks.post,
    patch: mocks.patch,
    delete: mocks.delete,
  },
}));

const userListItem: UserListItem = {
  id: "user-1",
  email: "alice@example.com",
  firstName: "Alice",
  lastName: "Example",
  isActive: true,
  createdAt: "2026-01-01T00:00:00.000Z",
  updatedAt: "2026-01-02T00:00:00.000Z",
};

const userDetail: UserDetail = {
  ...userListItem,
  organizationId: "org-1",
  organization: { id: "org-1", name: "Acme" },
  role: "USER",
};

describe("UsersService", () => {
  beforeEach(() => {
    mocks.get.mockReset();
    mocks.post.mockReset();
    mocks.patch.mockReset();
    mocks.delete.mockReset();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("list calls get on the users route and unwraps the data array", async () => {
    mocks.get.mockResolvedValue({ data: [userListItem] } as ApiResponse<UserListItem[]>);

    const result = await UsersService.list();

    expect(mocks.get).toHaveBeenCalledTimes(1);
    expect(mocks.get).toHaveBeenCalledWith("/api/users");
    expect(result).toEqual([userListItem]);
  });

  it("list falls back to an empty array when data is missing", async () => {
    mocks.get.mockResolvedValue({ message: "no users" } as ApiResponse<UserListItem[]>);

    const result = await UsersService.list();

    expect(result).toEqual([]);
  });

  it("getById calls get on the user route and unwraps the detail", async () => {
    mocks.get.mockResolvedValue({ data: userDetail } as ApiResponse<UserDetail>);

    const result = await UsersService.getById("user-1");

    expect(mocks.get).toHaveBeenCalledTimes(1);
    expect(mocks.get).toHaveBeenCalledWith("/api/users/user-1");
    expect(result).toEqual(userDetail);
  });

  it("create posts the full payload and unwraps the created detail", async () => {
    const payload: CreateUserPayload = {
      email: "bob@example.com",
      password: "s3cret",
      firstName: "Bob",
      lastName: "Example",
      organizationId: "org-1",
      role: "ADMIN",
    };
    const created: UserDetail = { ...userDetail, email: payload.email, role: "ADMIN" };
    mocks.post.mockResolvedValue({ data: created } as ApiResponse<UserDetail>);

    const result = await UsersService.create(payload);

    expect(mocks.post).toHaveBeenCalledTimes(1);
    expect(mocks.post).toHaveBeenCalledWith("/api/users", payload);
    expect(result).toEqual(created);
  });

  it("update patches the payload to the user route and unwraps the updated detail", async () => {
    const payload: UpdateUserPayload = {
      firstName: "Alicia",
      role: "ADMIN",
      organizationId: "org-2",
    };
    const updated: UserDetail = {
      ...userDetail,
      firstName: payload.firstName ?? null,
      role: "ADMIN",
      organizationId: "org-2",
      organization: { id: "org-2", name: "Globex" },
    };
    mocks.patch.mockResolvedValue({ data: updated } as ApiResponse<UserDetail>);

    const result = await UsersService.update("user-1", payload);

    expect(mocks.patch).toHaveBeenCalledTimes(1);
    expect(mocks.patch).toHaveBeenCalledWith("/api/users/user-1", payload);
    expect(result).toEqual(updated);
  });

  it("remove calls delete on the user route and resolves", async () => {
    mocks.delete.mockResolvedValue({ data: null });

    await expect(UsersService.remove("user-1")).resolves.toBeUndefined();

    expect(mocks.delete).toHaveBeenCalledTimes(1);
    expect(mocks.delete).toHaveBeenCalledWith("/api/users/user-1");
  });

  it("me calls get on the current user route and unwraps the detail", async () => {
    mocks.get.mockResolvedValue({ data: userDetail } as ApiResponse<UserDetail>);

    const result = await UsersService.me();

    expect(mocks.get).toHaveBeenCalledTimes(1);
    expect(mocks.get).toHaveBeenCalledWith("/api/users/me");
    expect(result).toEqual(userDetail);
  });
});