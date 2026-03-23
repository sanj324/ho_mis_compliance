import { api } from "../../../lib/api";

export type BranchListItem = {
  id: string;
  code: string;
  name: string;
  addressLine1?: string | null;
  city: string | null;
  state: string | null;
  isHeadOffice?: boolean;
  isActive?: boolean;
  approvalState?: "DRAFT" | "PENDING_APPROVAL" | "APPROVED" | "REJECTED";
};

export type BranchPayload = {
  code?: string;
  name: string;
  addressLine1?: string;
  city?: string;
  state?: string;
  isHeadOffice?: boolean;
  isActive?: boolean;
  approvalState?: "DRAFT" | "PENDING_APPROVAL" | "APPROVED" | "REJECTED";
};

export const branchApi = {
  list: async (): Promise<BranchListItem[]> => {
    const response = await api.get<{ success: true; data: BranchListItem[] }>("/branches");
    return response.data.data;
  },
  create: async (payload: BranchPayload): Promise<BranchListItem> => {
    const response = await api.post<{ success: true; data: BranchListItem }>("/branches", payload);
    return response.data.data;
  },
  update: async (id: string, payload: BranchPayload): Promise<BranchListItem> => {
    const response = await api.patch<{ success: true; data: BranchListItem }>(`/branches/${id}`, payload);
    return response.data.data;
  },
  delete: async (id: string): Promise<void> => {
    await api.delete(`/branches/${id}`);
  }
};
