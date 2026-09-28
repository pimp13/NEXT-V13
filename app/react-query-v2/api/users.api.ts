import type { CreateUserFormValues } from "../schema/users.schema";
import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:2000/api';

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
  const response = await fetch(`${API_URL}/v1/users`, {
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
  const res = await axios.get(`${API_URL}/v1/users`);
  if (res.status !== 200) {
    throw new Error(res?.data?.message || res?.statusText || 'خطا در دریافت کاربران');
  }

  return res.data.data;

}