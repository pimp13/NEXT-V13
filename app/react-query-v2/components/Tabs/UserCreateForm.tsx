"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  createUserSchema,
  type CreateUserFormValues,
} from "../../schema/users.schema";

import { createUser } from "../../api/users.api";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

export function UserCreateForm() {
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    watch,
    formState: {
      errors,
      isSubmitting,
    },
  } = useForm<CreateUserFormValues>({
    resolver: zodResolver(createUserSchema),
    defaultValues: {
      email: "",
      name: "",
      username: "",
      password: "",
      isActive: true,
      meta: null,
    },
  });

  const createMutation = useMutation({
    mutationFn: createUser,

    onSuccess: () => {
      reset();

      queryClient.invalidateQueries({
        queryKey: ["users"],
      });
    },
  });

  const onSubmit = (data: CreateUserFormValues) => {
    createMutation.mutate(data);
  };

  const isActive = watch("isActive");

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create User</CardTitle>

        <CardDescription>
          Enter the information for the new user.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-6"
        >
          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email">
              Email
            </Label>

            <Input
              id="email"
              type="email"
              placeholder="example@mail.com"
              {...register("email")}
            />

            {errors.email && (
              <p className="text-sm text-destructive">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Username */}
          <div className="space-y-2">
            <Label htmlFor="username">
              Username
            </Label>

            <Input
              id="username"
              placeholder="username"
              {...register("username")}
            />

            {errors.username && (
              <p className="text-sm text-destructive">
                {errors.username.message}
              </p>
            )}
          </div>

          {/* Name */}
          <div className="space-y-2">
            <Label htmlFor="name">
              Name
            </Label>

            <Input
              id="name"
              placeholder="User name"
              {...register("name")}
            />

            {errors.name && (
              <p className="text-sm text-destructive">
                {errors.name.message}
              </p>
            )}
          </div>

          {/* Password */}
          <div className="space-y-2">
            <Label htmlFor="password">
              Password
            </Label>

            <Input
              id="password"
              type="password"
              placeholder="At least 8 characters"
              {...register("password")}
            />

            <p className="text-xs text-muted-foreground">
              At least 8 characters, including at least one letter
              and one number.
            </p>

            {errors.password && (
              <p className="text-sm text-destructive">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Active */}
          <div className="flex items-center gap-3">
            <Checkbox
              id="isActive"
              checked={isActive}
              onCheckedChange={(checked) => {
                setValue(
                  "isActive",
                  checked === true,
                  {
                    shouldValidate: true,
                  }
                );
              }}
            />

            <Label htmlFor="isActive">
              Active user
            </Label>
          </div>

          {/* Meta */}
          <div className="space-y-2">
            <Label htmlFor="meta">
              Metadata
            </Label>

            <Textarea
              id="meta"
              placeholder='{"serviceId": 123}'
              rows={5}
              onChange={(event) => {
                try {
                  const value = event.target.value;

                  setValue(
                    "meta",
                    value ? JSON.parse(value) : null,
                    {
                      shouldValidate: true,
                    }
                  );
                } catch {
                  setValue("meta", null);
                }
              }}
            />

            <p className="text-xs text-muted-foreground">
              Enter a valid JSON value.
            </p>
          </div>

          {/* Server Error */}
          {createMutation.isError && (
            <div className="rounded-md border border-destructive/50 bg-destructive/10 p-3">
              <p className="text-sm text-destructive">
                {createMutation.error.message}
              </p>
            </div>
          )}

          {/* Submit */}
          <Button
            type="submit"
            disabled={
              isSubmitting ||
              createMutation.isPending
            }
          >
            {createMutation.isPending
              ? "Creating..."
              : "Create User"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
