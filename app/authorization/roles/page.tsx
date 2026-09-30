"use client";

import { useState } from "react";
import {
  MoreHorizontal,
  Plus,
  Search,
  Shield,
  Pencil,
  Trash2,
  KeyRound,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { BeautifulModal } from "@/components/BeautifulModal";
import { useModalStore } from "@/app/react-query-v2/store/useModalStore";
import { CreateRoleForm } from "./_components/CreateRoleForm";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { deleteRoleById, getAllRoles } from "./api/role.api";
import toast from "react-hot-toast";


export default function RolesPage() {
  const open = useModalStore((state) => state.open);
  const close = useModalStore((state) => state.close);
  const openModal = useModalStore(
    (state) => state.openModal
  );
  const selectedId = useModalStore(
    (state) => state.selectedId
  );

  const [search, setSearch] = useState("");
  const queryClient = useQueryClient();
  const {
    data: roles = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["roles"],
    queryFn: getAllRoles,
  });

  const deleteMutation = useMutation({
    mutationFn: deleteRoleById,

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["roles"],
      });
    },
  });

  const handleDeleteRole = async (id: number) => {
    try {
      if (confirm('Motmaen be hazfe role hasti?')) {
        deleteMutation.mutate(id);
        toast.success('Role is deleted successfully!');
      }
    } catch (err: any) {
      console.log('failed', err);
      toast.error(err || 'Server error');
    }
  }

  const filteredRoles = roles.filter((role) => {
    const value = search.toLowerCase();

    return (
      role.name.toLowerCase().includes(value) ||
      role.description?.toLowerCase().includes(value)
    );
  });

  if (isLoading) {
    return (
      <Card>
        <CardContent className="py-10 text-center">
          Loading roles...
        </CardContent>
      </Card>
    );
  }

  if (isError) {
    return (
      <Card>
        <CardContent className="py-10 text-center text-destructive">
          {error.message}
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <div className="flex flex-col gap-6 p-6">
        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <Shield className="size-5" />

              <h1 className="text-2xl font-semibold tracking-tight">
                Roles
              </h1>
            </div>

            <p className="mt-1 text-sm text-muted-foreground">
              Manage roles and control what users can access.
            </p>
          </div>

          <Button onClick={() => open('create-role')}>
            <Plus className="mr-2 size-4" />
            Create Role
          </Button>
        </div>

        {/* Content */}
        <Card>
          <CardHeader>
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <CardTitle>All Roles</CardTitle>

                <CardDescription>
                  Create, edit and manage application roles.
                </CardDescription>
              </div>

              {/* Search */}
              <div className="relative w-full md:w-72">
                <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

                <Input
                  placeholder="Search roles..."
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
          </CardHeader>

          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Role</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Users</TableHead>
                    <TableHead>Permissions</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead className="w-12" />
                  </TableRow>
                </TableHeader>

                <TableBody className="text-neutral-900">
                  {filteredRoles.length > 0 ? (
                    filteredRoles.map((role) => (
                      <TableRow key={role.id}>
                        {/* Role */}
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="flex size-9 items-center justify-center rounded-md border bg-muted/50">
                              <Shield className="size-4 text-muted-foreground" />
                            </div>

                            <div>
                              <div className="font-medium">
                                {role.name}
                              </div>

                              <div className="text-xs text-muted-foreground">
                                ID: {role.id}
                              </div>
                            </div>
                          </div>
                        </TableCell>

                        {/* Description */}
                        <TableCell>
                          <span className="text-sm text-muted-foreground">
                            {role.description || "No description"}
                          </span>
                        </TableCell>

                        {/* Users */}
                        <TableCell>
                          <Badge>
                            {0} users
                          </Badge>
                        </TableCell>

                        {/* Permissions */}
                        <TableCell>
                          <Badge variant="outline">
                            <KeyRound className="mr-1 size-3" />
                            {0}
                          </Badge>
                        </TableCell>

                        {/* Created */}
                        <TableCell>
                          <span className="text-sm text-muted-foreground">
                            {new Date(role?.createdAt || '').toLocaleDateString()}
                          </span>
                        </TableCell>

                        {/* Actions */}
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="size-8"
                              >
                                <MoreHorizontal className="size-4" />
                                <span className="sr-only">
                                  Open actions
                                </span>
                              </Button>
                            </DropdownMenuTrigger>

                            <DropdownMenuContent className="bg-neutral-800" align="end">
                              <DropdownMenuItem className="cursor-pointer hover:bg-gray-600 transition">
                                <Pencil className="mr-2 size-4" />
                                Edit Role
                              </DropdownMenuItem>

                              <DropdownMenuItem className="cursor-pointer hover:bg-gray-600 transition">
                                <KeyRound className="mr-2 size-4" />
                                Manage Permissions
                              </DropdownMenuItem>

                              <DropdownMenuSeparator />

                              <DropdownMenuItem onClick={() => handleDeleteRole(+role.id)}
                                className="text-destructive focus:text-destructive cursor-pointer hover:bg-gray-600 transition">
                                <Trash2 className="mr-2 size-4" />
                                Delete Role
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={6}
                        className="h-32 text-center"
                      >
                        <div className="flex flex-col items-center justify-center gap-2">
                          <Shield className="size-8 text-muted-foreground" />

                          <p className="font-medium">
                            No roles found
                          </p>

                          <p className="text-sm text-muted-foreground">
                            Try changing your search query.
                          </p>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>

            {/* Footer */}
            <div className="mt-4 flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                Showing{" "}
                <span className="font-medium text-muted-foreground">
                  {filteredRoles.length}
                </span>{" "}
                of{" "}
                <span className="font-medium text-muted-foreground">
                  {filteredRoles.length}
                </span>{" "}
                roles
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <BeautifulModal
        open={openModal === 'create-role'}
        onOpenChange={(open) => !open && close()}
        title="Create Role"
        description="Create a new role."
        isShowBtns={false}
      >
        <CreateRoleForm close={close} />
      </BeautifulModal>
    </>
  );
}