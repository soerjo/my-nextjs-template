"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button, Spinner } from "@heroui/react";
import { ProtectedRoute, useRole } from "@/features/auth/hooks";
import { UsersService } from "@/features/users/services";
import type { UserDetail } from "@/features/users/services";
import { UserFormModal, UsersTable } from "@/features/users/components";
import type { UserFormMode } from "@/features/users/components";
import { queryKeys } from "@/lib";

interface FormModalState {
  isOpen: boolean;
  mode: UserFormMode;
  initial: UserDetail | null;
}

const CLOSED_FORM_MODAL: FormModalState = {
  isOpen: false,
  mode: "create",
  initial: null,
};

export default function UsersPage() {
  const { role, isLoading: isRoleLoading } = useRole();
  const [formModal, setFormModal] = useState<FormModalState>(CLOSED_FORM_MODAL);

  const usersQuery = useQuery({
    queryKey: queryKeys.users.list,
    queryFn: () => UsersService.list(),
  });

  const isLoading = isRoleLoading;

  const users = usersQuery.data ?? [];
  const isAdmin = role === "ADMIN";

  function openCreateModal() {
    setFormModal({ isOpen: true, mode: "create", initial: null });
  }

  function openEditModal(user: UserDetail) {
    setFormModal({ isOpen: true, mode: "edit", initial: user });
  }

  function closeFormModal() {
    setFormModal((prev) => ({ ...prev, isOpen: false }));
  }

  return (
    <ProtectedRoute>
      <div className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-6 px-6 py-8">
        {isLoading ? (
          <div className="flex min-h-[60vh] items-center justify-center">
            <Spinner size="lg" />
          </div>
        ) : !isAdmin ? (
          <div className="flex min-h-[60vh] items-center justify-center">
            <div className="max-w-md rounded-xl border border-zinc-200 bg-white p-8 text-center dark:border-zinc-800 dark:bg-black">
              <p className="text-lg font-semibold">Access restricted</p>
              <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                Only administrators can view and manage users.
              </p>
            </div>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-semibold">Users</h1>
                <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                  Manage user accounts and permissions.
                </p>
              </div>
              <Button variant="primary" onPress={openCreateModal}>
                Add User
              </Button>
            </div>

            <UsersTable
              users={users}
              loading={usersQuery.isPending}
              onEdit={openEditModal}
              onDeleted={() => void usersQuery.refetch()}
            />
          </>
        )}

        <UserFormModal
          isOpen={formModal.isOpen}
          mode={formModal.mode}
          initial={formModal.initial}
          onClose={closeFormModal}
          onSaved={() => void usersQuery.refetch()}
        />
      </div>
    </ProtectedRoute>
  );
}