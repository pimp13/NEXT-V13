import axios from "axios";
import { CreateRoleSchemaType } from "../_components/schema/create-role.schema";

export interface Role {
  id: string | number;
  name: string;
  description?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:2000/api";

export async function createNewRole(data: CreateRoleSchemaType): Promise<Role> {
  const response = await axios.post(`${API_URL}/v1/roles`, data);

  if (response.status !== 201) {
    throw new Error(response.data?.message ?? "Error creating a new role");
  }

  return response.data?.data;
}

export async function getAllRoles(): Promise<Role[]> {
  const resp = await axios.get(`${API_URL}/v1/roles`);

  if (resp.status !== 200) {
    throw new Error(resp.data?.message ?? "Error get all roles");
  }

  return resp.data.data;
}

export async function deleteRoleById(id: number) {
  const resp = await axios.delete(`${API_URL}/v1/roles/${id}`);

  if (resp.status !== 200) {
    throw new Error(resp.data?.message ?? "Error in delete role");
  }

  return resp.data.data;
}
