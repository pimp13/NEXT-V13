"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";


import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { createRoleSchema, CreateRoleSchemaType } from "./schema/create-role.schema";
import { createNewRole } from "../api/role.api";

type Props = {
  close: () => void;
}

export function CreateRoleForm({ close }: Props) {
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
  } = useForm<CreateRoleSchemaType>({
    resolver: zodResolver(createRoleSchema),
    defaultValues: {
      name: '',
      description: null
    },
  });

  const createMutation = useMutation({
    mutationFn: createNewRole,

    onSuccess: async () => {
      close();
      reset();

      await queryClient.invalidateQueries({
        queryKey: ["roles"],
      });
    },

    onError: (error) => {
      console.error("CREATE ROLE ERROR:", error);
    },
  });

  const onSubmit = (data: CreateRoleSchemaType) => {
    createMutation.mutate(data);
  };


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
          {/* Name */}
          <div className="space-y-2">
            <Label htmlFor="name">
              Name
            </Label>

            <Input
              id="name"
              placeholder="Role name"
              {...register("name")}
            />

            {errors.name && (
              <p className="text-sm text-destructive">
                {errors.name.message}
              </p>
            )}
          </div>

          {/* Meta */}
          <div className="space-y-2">
            <Label htmlFor="description">
              Role description
            </Label>

            <Textarea
              id="description"
              placeholder=''
              rows={5}
              {...register("description")}
            />

            <p className="text-xs text-muted-foreground">
              role description is nullable.
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
            {createMutation.isPending || isSubmitting
              ? "Creating..."
              : "Create User"}
          </Button>
        </form>

      </CardContent>

    </Card>
  );
}
