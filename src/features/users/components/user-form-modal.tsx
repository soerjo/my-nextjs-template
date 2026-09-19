"use client";

import { useEffect, useMemo, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { z } from "zod";
import {
  Button,
  Input,
  Label,
  ListBox,
  ListBoxItem,
  Modal,
  Select,
  Spinner,
  useOverlayState,
} from "@heroui/react";
import { PasswordInput } from "@/components/ui";
import { ApiError } from "@/lib";
import { UsersService } from "@/features/users/services";
import type {
  CreateUserPayload,
  UpdateUserPayload,
  UserDetail,
  UserRole,
} from "@/features/users/services";
import { cn } from "@/utils";

export type UserFormMode = "create" | "edit";

export interface UserFormValues {
  email: string;
  password?: string;
  firstName: string;
  lastName: string;
  organizationId?: string;
  role: UserRole;
}

const USER_ROLES = ["USER", "ADMIN", "SYSTEM"] as const;

function buildUserFormSchema(mode: UserFormMode) {
  return z
    .object({
      email: z
        .string()
        .min(1, "Email is required")
        .email("Invalid email address"),
      password: z.string().optional(),
      firstName: z.string().min(1, "First name is required"),
      lastName: z.string().min(1, "Last name is required"),
      organizationId: z.string().optional(),
      role: z.union([z.literal("USER"), z.literal("ADMIN"), z.literal("SYSTEM")]),
    })
    .superRefine((values, ctx) => {
      if (mode !== "create") return;

      const password = values.password ?? "";
      if (!password) {
        ctx.addIssue({
          code: "custom",
          path: ["password"],
          message: "Password is required",
        });
      } else if (password.length < 6) {
        ctx.addIssue({
          code: "custom",
          path: ["password"],
          message: "Password must be at least 6 characters",
        });
      }
    });
}

interface UserFormModalProps {
  isOpen: boolean;
  mode: UserFormMode;
  initial?: UserDetail | null;
  onClose: () => void;
  onSaved: () => void;
}

function getDefaultValues(mode: UserFormMode, initial?: UserDetail | null): UserFormValues {
  return {
    email: initial?.email ?? "",
    password: "",
    firstName: initial?.firstName ?? "",
    lastName: initial?.lastName ?? "",
    organizationId: initial?.organizationId ?? "",
    role: initial?.role ?? "USER",
  };
}

function parseApiErrorMessage(error: unknown): string {
  if (error instanceof ApiError) {
    try {
      const parsed = JSON.parse(error.message) as { message?: string };
      return parsed.message ?? error.message;
    } catch {
      return error.message || "Request failed. Please try again.";
    }
  }
  return "Request failed. Please try again.";
}

export function UserFormModal({
  isOpen,
  mode,
  initial,
  onClose,
  onSaved,
}: UserFormModalProps) {
  const overlay = useOverlayState({
    isOpen,
    onOpenChange: (next) => {
      if (!next) onClose();
    },
  });

  const schema = useMemo(() => buildUserFormSchema(mode), [mode]);

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UserFormValues>({
    resolver: zodResolver(schema),
    defaultValues: getDefaultValues(mode, initial),
  });

  const [submitError, setSubmitError] = useState("");

  if (isOpen && submitError) {
    setSubmitError("");
  }

  const createMutation = useMutation({
    mutationFn: (data: CreateUserPayload) => UsersService.create(data),
    onSuccess: () => {
      onSaved();
      onClose();
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateUserPayload }) =>
      UsersService.update(id, data),
    onSuccess: () => {
      onSaved();
      onClose();
    },
  });

  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  useEffect(() => {
    if (isOpen) {
      reset(getDefaultValues(mode, initial));
    }
  }, [isOpen, mode, initial, reset]);

  async function onSubmit(values: UserFormValues) {
    setSubmitError("");
    try {
      const organizationId = values.organizationId?.trim()
        ? values.organizationId.trim()
        : "";

      if (mode === "create") {
        await createMutation.mutateAsync({
          email: values.email,
          password: values.password ?? "",
          firstName: values.firstName,
          lastName: values.lastName,
          organizationId,
          role: values.role,
        });
      } else if (initial) {
        await updateMutation.mutateAsync({
          id: initial.id,
          data: {
            email: values.email,
            firstName: values.firstName,
            lastName: values.lastName,
            organizationId,
            role: values.role,
          },
        });
      }
    } catch (error) {
      setSubmitError(parseApiErrorMessage(error));
    }
  }

  return (
    <Modal state={overlay}>
      <Modal.Backdrop isDismissable={!isSubmitting}>
        <Modal.Container size="md">
          <Modal.Dialog>
            <Modal.Header>
              <Modal.Heading>
                {mode === "create" ? "Add User" : "Edit User"}
              </Modal.Heading>
              <Modal.CloseTrigger />
            </Modal.Header>

            <form onSubmit={handleSubmit(onSubmit)}>
              <Modal.Body>
                <div className="flex flex-col gap-4">
                  {submitError && (
                    <div
                      role="alert"
                      className="rounded-lg bg-danger-50 border border-danger-200 px-4 py-3 text-sm text-danger-700 dark:bg-danger-950 dark:border-danger-800 dark:text-danger-300"
                    >
                      {submitError}
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label htmlFor="firstName" className="text-sm font-medium">
                        First Name <span className="text-danger">*</span>
                      </label>
                      <Input
                        id="firstName"
                        type="text"
                        placeholder="John"
                        {...register("firstName")}
                      />
                      {errors.firstName && (
                        <p className="text-sm text-danger">{errors.firstName.message}</p>
                      )}
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label htmlFor="lastName" className="text-sm font-medium">
                        Last Name <span className="text-danger">*</span>
                      </label>
                      <Input
                        id="lastName"
                        type="text"
                        placeholder="Doe"
                        {...register("lastName")}
                      />
                      {errors.lastName && (
                        <p className="text-sm text-danger">{errors.lastName.message}</p>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="email" className="text-sm font-medium">
                      Email <span className="text-danger">*</span>
                    </label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="john@example.com"
                      {...register("email")}
                    />
                    {errors.email && (
                      <p className="text-sm text-danger">{errors.email.message}</p>
                    )}
                  </div>

                  {mode === "create" && (
                    <div className="flex flex-col gap-1.5">
                      <PasswordInput
                        name="password"
                        label="Password"
                        placeholder="Enter a password"
                        register={register}
                        error={errors.password?.message}
                        required
                      />
                    </div>
                  )}

                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="organizationId" className="text-sm font-medium">
                      Organization ID
                    </label>
                    <Input
                      id="organizationId"
                      type="text"
                      placeholder="Enter an organization ID"
                      {...register("organizationId")}
                    />
                    {errors.organizationId && (
                      <p className="text-sm text-danger">{errors.organizationId.message}</p>
                    )}
                  </div>

                  <Controller
                    control={control}
                    name="role"
                    render={({ field }) => (
                      <div className="flex flex-col gap-1.5">
                        <Label className="text-sm font-medium">
                          Role <span className="text-danger">*</span>
                        </Label>
                        <Select.Root
                          selectedKey={field.value}
                          onSelectionChange={(key) => field.onChange(key as UserRole)}
                          placeholder="Select a role"
                          className={cn("w-full", errors.role && "border-danger")}
                        >
                          <Select.Trigger className="w-full">
                            <Select.Value />
                            <Select.Indicator>
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="20"
                                height="20"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="text-default-400"
                              >
                                <polyline points="6 9 12 15 18 9" />
                              </svg>
                            </Select.Indicator>
                          </Select.Trigger>
                          <Select.Popover>
                            <ListBox aria-label="Role" className="w-full max-w-[220px]">
                              {USER_ROLES.map((role) => (
                                <ListBoxItem
                                  key={role}
                                  id={role}
                                  textValue={role}
                                  className="cursor-pointer"
                                >
                                  {role}
                                </ListBoxItem>
                              ))}
                            </ListBox>
                          </Select.Popover>
                        </Select.Root>
                        {errors.role && (
                          <p className="text-sm text-danger">{errors.role.message}</p>
                        )}
                      </div>
                    )}
                  />
                </div>
              </Modal.Body>

              <Modal.Footer>
                <Button
                  variant="tertiary"
                  isDisabled={isSubmitting}
                  onPress={onClose}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  isDisabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <Spinner size="sm" />
                  ) : mode === "create" ? (
                    "Create User"
                  ) : (
                    "Save Changes"
                  )}
                </Button>
              </Modal.Footer>
            </form>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  );
}