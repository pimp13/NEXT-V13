"use client";

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

import { UserCreateForm } from "./UserCreateForm";
import { UserList } from "./UserList";

export function UserPageTab() {
  return (
    <div className="container mx-auto max-w-6xl py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">
          User Management
        </h1>

        <p className="mt-2 text-muted-foreground">
          Create and manage system users.
        </p>
      </div>

      <Tabs defaultValue="create" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="create">
            <span className="text-stone-50">Create User</span>
          </TabsTrigger>

          <TabsTrigger value="list">
            <span className="text-stone-50">User List</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="create">
          <UserCreateForm />
        </TabsContent>

        <TabsContent value="list">
          <UserList />
        </TabsContent>
      </Tabs>
    </div>
  );
}
