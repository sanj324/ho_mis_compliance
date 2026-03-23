import { api } from "../../../lib/api";

export type UserListItem = {
  id: string;
  username: string;
  fullName: string;
  email: string | null;
  isActive: boolean;
  approvalState?: "DRAFT" | "PENDING_APPROVAL" | "APPROVED" | "REJECTED";
  branch?: {
    id: string;
    name: string;
  } | null;
  userRoles?: Array<{
    role: {
      id: string;
      name: string;
      code: string;
    };
  }>;
};

export type UserCreatePayload = {
  username: string;
  fullName: string;
  email?: string;
  password: string;
  branchId?: string | null;
  roleIds: string[];
};

export type UserUpdatePayload = {
  fullName?: string;
  email?: string;
  branchId?: string | null;
  isActive?: boolean;
  approvalState?: "DRAFT" | "PENDING_APPROVAL" | "APPROVED" | "REJECTED";
};

export type UserOptions = {
  roles: Array<{ id: string; name: string; code: string }>;
  branches: Array<{ id: string; name: string; code: string }>;
};

export const userApi = {
  list: async (): Promise<UserListItem[]> => {
    const response = await api.get<{ success: true; data: UserListItem[] }>("/users");
    return response.data.data;
  },
  create: async (payload: UserCreatePayload): Promise<UserListItem> => {
    const response = await api.post<{ success: true; data: UserListItem }>("/users", payload);
    return response.data.data;
  },
  update: async (id: string, payload: UserUpdatePayload): Promise<UserListItem> => {
    const response = await api.patch<{ success: true; data: UserListItem }>(`/users/${id}`, payload);
    return response.data.data;
  },
  delete: async (id: string): Promise<void> => {
    await api.delete(`/users/${id}`);
  },
  options: async (): Promise<UserOptions> => {
    const response = await api.get<{ success: true; data: UserOptions }>("/users/options");
    return response.data.data;
  }
};
