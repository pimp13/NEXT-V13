"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  Card,
  CardContent,
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

import { Badge } from "@/components/ui/badge";
import { deleteUserById, getUsers } from "../../api/users.api";
import { BeautifulModal } from "@/components/BeautifulModal";
import { useModalStore } from "../../store/useModalStore";
import { Button } from "@/components/ui/button";
import { EditUserForm } from "./EditUserForm";
import toast from "react-hot-toast";

export function UserList() {
  const open = useModalStore((state) => state.open);
  const close = useModalStore((state) => state.close);
  const openModal = useModalStore(
    (state) => state.openModal
  );
  const selectedId = useModalStore(
    (state) => state.selectedId
  );
  const queryClient = useQueryClient();

  const {
    data: users = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["users"],
    queryFn: getUsers,
  });

  const deleteMutation = useMutation({
    mutationFn: deleteUserById,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["users"],
      });
    },
  });

  const deleteUser = async (id: string | number) => {
    try {
      deleteMutation.mutate(Number(id));
      toast.success('کاربر مورد نظر باموفقیت حذف شد');
    } catch (err: any) {
      console.log('failed', err);
      toast.error(err || 'خطا در برقراری با سرور');
    }
  }

  if (isLoading) {
    return (
      <Card>
        <CardContent className="py-10 text-center">
          Loading users...
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
    <Card>
      <CardHeader>
        <CardTitle>
          Users ({users.length})
        </CardTitle>
      </CardHeader>

      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>
                  Name
                </TableHead>

                <TableHead>
                  Username
                </TableHead>

                <TableHead>
                  Email
                </TableHead>

                <TableHead>
                  Status
                </TableHead>

                <TableHead>
                  Created At
                </TableHead>

                <TableHead>
                  Action
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody className="text-black">
              {!users || users.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="h-24 text-center"
                  >
                    No users found..
                  </TableCell>
                </TableRow>
              ) : (
                users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      {user.name || "-"}
                    </TableCell>

                    <TableCell>
                      {user.username}
                    </TableCell>

                    <TableCell>
                      {user.email}
                    </TableCell>

                    <TableCell>
                      {user.isActive ? (
                        <Badge>
                          Active
                        </Badge>
                      ) : (
                        <Badge variant="secondary">
                          Inactive
                        </Badge>
                      )}
                    </TableCell>

                    <TableCell>
                      {user.createdAt
                        ? new Date(
                          user.createdAt
                        ).toLocaleDateString("en-US")
                        : "-"}
                    </TableCell>

                    <TableCell>
                      <Button
                        onClick={() => open("edit-user", user.id)}
                      >
                        Edit User
                      </Button>

                      <Button
                        onClick={() => deleteUser(user.id)}
                        variant="destructive"
                        className="ml-2"
                      >
                        Delete User
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>

      <EditUserForm userId={selectedId} openModal={openModal} close={close} />
    </Card >
  );
}
