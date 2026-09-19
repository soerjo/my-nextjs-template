"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AlertDialog, Button, Chip, Spinner, Table } from "@heroui/react";
import { UsersService, type UserListItem } from "@/features/users/services";
import { queryKeys } from "@/lib";

interface UsersTableProps {
  users: UserListItem[];
  loading?: boolean;
  onEdit: (user: UserListItem) => void;
  onDeleted: () => void;
}

export function UsersTable({ users, loading = false, onEdit, onDeleted }: UsersTableProps) {
  const queryClient = useQueryClient();
  const [pendingDelete, setPendingDelete] = useState<UserListItem | null>(null);

  const deleteMutation = useMutation({
    mutationFn: (id: string) => UsersService.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.users.list });
      onDeleted();
      setPendingDelete(null);
    },
  });

  function openDelete(user: UserListItem) {
    deleteMutation.reset();
    setPendingDelete(user);
  }

  function closeDelete() {
    setPendingDelete(null);
  }

  return (
    <div className="flex flex-col gap-4">
      {loading ? (
        <div className="flex min-h-[240px] items-center justify-center">
          <Spinner size="lg" />
        </div>
      ) : (
        <Table aria-label="Users" variant="primary" className="w-full">
          <Table.Content>
            <Table.Header>
              <Table.Column id="email" isRowHeader>
                Email
              </Table.Column>
              <Table.Column id="firstName">First Name</Table.Column>
              <Table.Column id="lastName">Last Name</Table.Column>
              <Table.Column id="status">Status</Table.Column>
              <Table.Column id="actions" className="w-1">
                Actions
              </Table.Column>
            </Table.Header>
            <Table.Body items={users}>
              {(user) => (
                <Table.Row id={user.id}>
                  <Table.Cell className="font-medium">{user.email}</Table.Cell>
                  <Table.Cell>{user.firstName}</Table.Cell>
                  <Table.Cell>{user.lastName}</Table.Cell>
                  <Table.Cell>
                    <Chip
                      size="sm"
                      color={user.isActive ? "success" : "default"}
                      variant="soft"
                    >
                      {user.isActive ? "Active" : "Inactive"}
                    </Chip>
                  </Table.Cell>
                  <Table.Cell>
                    <div className="flex items-center gap-2">
                      <Button size="sm" variant="tertiary" onPress={() => onEdit(user)}>
                        Edit
                      </Button>
                      <Button size="sm" variant="danger" onPress={() => openDelete(user)}>
                        Delete
                      </Button>
                    </div>
                  </Table.Cell>
                </Table.Row>
              )}
            </Table.Body>
          </Table.Content>
        </Table>
      )}

      <AlertDialog
        isOpen={pendingDelete !== null}
        onOpenChange={(isOpen) => {
          if (!isOpen) closeDelete();
        }}
      >
        <AlertDialog.Backdrop isDismissable={!deleteMutation.isPending}>
          <AlertDialog.Container size="xs">
            <AlertDialog.Dialog>
              <AlertDialog.Header>
                <AlertDialog.Icon status="danger">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M3 6h18" />
                    <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                    <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                    <line x1="10" x2="10" y1="11" y2="17" />
                    <line x1="14" x2="14" y1="11" y2="17" />
                  </svg>
                </AlertDialog.Icon>
                <AlertDialog.Heading>Delete user</AlertDialog.Heading>
              </AlertDialog.Header>
              <AlertDialog.Body>
                <p>
                  Are you sure you want to delete{" "}
                  <span className="font-medium">{pendingDelete?.email}</span>?
                  This action cannot be undone.
                </p>
                {deleteMutation.error && (
                  <p role="alert" className="mt-3 text-sm text-danger">
                    {deleteMutation.error.message || "Failed to delete user."}
                  </p>
                )}
              </AlertDialog.Body>
              <AlertDialog.Footer>
                <Button
                  variant="tertiary"
                  isDisabled={deleteMutation.isPending}
                  onPress={closeDelete}
                >
                  Cancel
                </Button>
                <Button
                  variant="danger"
                  isDisabled={deleteMutation.isPending}
                  onPress={() => {
                    if (pendingDelete) deleteMutation.mutate(pendingDelete.id);
                  }}
                >
                  {deleteMutation.isPending ? <Spinner size="sm" /> : "Delete"}
                </Button>
              </AlertDialog.Footer>
            </AlertDialog.Dialog>
          </AlertDialog.Container>
        </AlertDialog.Backdrop>
      </AlertDialog>
    </div>
  );
}