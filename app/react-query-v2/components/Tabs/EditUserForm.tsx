"use client";

import { BeautifulModal } from "@/components/BeautifulModal";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { getUsersById, updateUser } from "../../api/users.api";
import { ModalType } from "../../store/useModalStore";
import {
    editUserSchema,
    EditUserSchemaType,
} from "../../schema/edit-user.schema";

type EditUserFormProps = {
    userId: number | string | null;
    openModal: ModalType | null;
    close: () => void;
};

export function EditUserForm({ userId, openModal, close }: EditUserFormProps) {
    const queryClient = useQueryClient();
    const isOpen = openModal === "edit-user";

    const numericUserId =
        userId !== null && userId !== undefined ? Number(userId) : null;

    const isValidId =
        numericUserId !== null && Number.isFinite(numericUserId);

    // برای نمایش JSON در textarea
    const [metaText, setMetaText] = useState("{}");

    const {
        register,
        handleSubmit,
        reset,
        control,
        setValue,
        setError,
        clearErrors,
        formState: { errors, isSubmitting },
    } = useForm<EditUserSchemaType>({
        resolver: zodResolver(editUserSchema),
        defaultValues: {
            email: "",
            name: "",
            username: "",
            isActive: true,
            meta: null,
        },
    });

    /* ----------------------------- Fetch User ----------------------------- */
    const {
        data: userData,
        isLoading: isUserLoading,
        isError: isUserError,
        error: userError,
        refetch,
    } = useQuery({
        queryKey: ["user", numericUserId],
        queryFn: () => getUsersById(numericUserId as number),
        enabled: isOpen && isValidId,
        staleTime: 30_000,
    });

    /* ---------------------- Populate form when data arrives ---------------------- */
    useEffect(() => {
        if (!userData) return;

        reset({
            email: userData.email ?? "",
            name: userData.name ?? "",
            username: userData.username ?? "",
            isActive: userData.isActive ?? true,
            meta: userData.meta ?? null,
        });

        setMetaText(JSON.stringify(userData.meta ?? {}, null, 2));
    }, [userData, reset]);

    /* ----------------------------- Update Mutation ----------------------------- */
    const updateMutation = useMutation({
        mutationFn: ({
            userId,
            data,
        }: {
            userId: number;
            data: EditUserSchemaType;
        }) => updateUser(userId, data),

        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ["users"] });

            if (isValidId) {
                await queryClient.invalidateQueries({
                    queryKey: ["user", numericUserId],
                });
            }

            handleClose(true); // force close after success
        },
    });

    const isLoading = isSubmitting || updateMutation.isPending;

    /* ----------------------------- Handlers ----------------------------- */
    const handleClose = (force = false) => {
        if (isLoading && !force) return;

        reset();
        setMetaText("{}");
        updateMutation.reset();
        close();
    };

    const onSubmit = (data: EditUserSchemaType) => {
        if (!isValidId) return;

        updateMutation.mutate({
            userId: numericUserId as number,
            data,
        });
    };

    const handleMetaChange = (value: string) => {
        setMetaText(value);

        if (!value.trim()) {
            setValue("meta", null, {
                shouldDirty: true,
                shouldValidate: true,
            });
            clearErrors("meta");
            return;
        }

        try {
            const parsed = JSON.parse(value);
            setValue("meta", parsed, {
                shouldDirty: true,
                shouldTouch: true,
                shouldValidate: true,
            });
            clearErrors("meta");
        } catch {
            setError("meta", {
                type: "validate",
                message: "Invalid JSON format",
            });
        }
    };

    /* ----------------------------- Render ----------------------------- */
    return (
        <BeautifulModal
            open={isOpen}
            onOpenChange={(open) => !open && handleClose()}
            title="Edit User"
            description="Update the users information."
            isShowBtns={false}
        >
            <div className="space-y-6">
                {/* Loading State */}
                {isUserLoading && (
                    <div className="flex flex-col items-center justify-center py-12 gap-3">
                        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                        <p className="text-sm text-muted-foreground">Loading user...</p>
                    </div>
                )}

                {/* Error State */}
                {isUserError && (
                    <div className="rounded-lg border border-destructive/40 bg-destructive/10 p-4 space-y-3">
                        <p className="text-sm text-destructive">
                            {userError instanceof Error
                                ? userError.message
                                : "Failed to load user data."}
                        </p>
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => refetch()}
                        >
                            Try Again
                        </Button>
                    </div>
                )}

                {/* Form */}
                {!isUserLoading && !isUserError && userData && (
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                        {/* Email */}
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="example@mail.com"
                                disabled={isLoading}
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
                            <Label htmlFor="username">Username</Label>
                            <Input
                                id="username"
                                placeholder="username"
                                disabled={isLoading}
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
                            <Label htmlFor="name">Name</Label>
                            <Input
                                id="name"
                                placeholder="Full name"
                                disabled={isLoading}
                                {...register("name")}
                            />
                            {errors.name && (
                                <p className="text-sm text-destructive">{errors.name.message}</p>
                            )}
                        </div>

                        {/* Active */}
                        <div className="flex items-center gap-3">
                            <Controller
                                name="isActive"
                                control={control}
                                render={({ field }) => (
                                    <Checkbox
                                        id="isActive"
                                        checked={field.value || false}
                                        disabled={isLoading}
                                        onCheckedChange={field.onChange}
                                    />
                                )}
                            />
                            <Label htmlFor="isActive" className="cursor-pointer">
                                Active user
                            </Label>
                        </div>
                        {errors.isActive && (
                            <p className="text-sm text-destructive">
                                {errors.isActive.message}
                            </p>
                        )}

                        {/* Metadata */}
                        <div className="space-y-2">
                            <Label htmlFor="meta">Metadata (JSON)</Label>
                            <Textarea
                                id="meta"
                                placeholder='{"key": "value"}'
                                rows={6}
                                disabled={isLoading}
                                value={metaText}
                                onChange={(e) => handleMetaChange(e.target.value)}
                                className="font-mono text-sm"
                            />
                            <p className="text-xs text-muted-foreground">
                                Enter a valid JSON object.
                            </p>
                            {errors.meta && (
                                <p className="text-sm text-destructive">{errors.meta.message as any}</p>
                            )}
                        </div>

                        {/* Server Error */}
                        {updateMutation.isError && (
                            <div className="rounded-lg border border-destructive/40 bg-destructive/10 p-3">
                                <p className="text-sm text-destructive">
                                    {updateMutation.error instanceof Error
                                        ? updateMutation.error.message
                                        : "Failed to update user."}
                                </p>
                            </div>
                        )}

                        {/* Actions */}
                        <div className="flex items-center justify-end gap-3 pt-2">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => handleClose()}
                                disabled={isLoading}
                            >
                                Cancel
                            </Button>
                            <Button type="submit" disabled={isLoading}>
                                {isLoading ? "Updating..." : "Update User"}
                            </Button>
                        </div>
                    </form>
                )}
            </div>
        </BeautifulModal>
    );
}