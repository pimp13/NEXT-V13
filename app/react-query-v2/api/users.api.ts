import type { CreateUserFormValues } from "../schema/users.schema";

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

export interface User {
  id: string;
  email: string;
  name?: string;
  username: string;
  isActive: boolean;
  meta?: Record<string, unknown> | null;
  createdAt?: string;
  updatedAt?: string;
}

export async function createUser(
  data: CreateUserFormValues
): Promise<User> {
  const response = await fetch(`${API_URL}/users`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(data),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result?.message || "خطا در ساخت کاربر"
    );
  }

  return result.data;
}

export async function getUsers(): Promise<User[]> {
  const response = await fetch(`${API_URL}/users`, {
    method: "GET",
    credentials: "include",
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result?.message || "خطا در دریافت کاربران"
    );
  }

  return result.data;
}