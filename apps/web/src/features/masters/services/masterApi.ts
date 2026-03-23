import { api } from "../../../lib/api";

export type MasterApprovalState = "DRAFT" | "PENDING_APPROVAL" | "APPROVED" | "REJECTED";

export type MasterItem = {
  id: string;
  code: string;
  name: string;
  branchId?: string | null;
  branch?: {
    id: string;
    code: string;
    name: string;
  } | null;
  isActive?: boolean;
  approvalState?: MasterApprovalState;
};

export type MasterCreatePayload = {
  code: string;
  name: string;
  branchId?: string;
  isActive?: boolean;
};

export type MasterUpdatePayload = {
  name?: string;
  branchId?: string | null;
  isActive?: boolean;
  approvalState?: MasterApprovalState;
};

const unwrap = <T>(payload: { success: true; data: T }): T => payload.data;

const listMasters = async (path: string): Promise<MasterItem[]> =>
  unwrap((await api.get<{ success: true; data: MasterItem[] }>(path)).data);

const createMaster = async (path: string, payload: MasterCreatePayload): Promise<MasterItem> =>
  unwrap((await api.post<{ success: true; data: MasterItem }>(path, payload)).data);

const updateMaster = async (path: string, id: string, payload: MasterUpdatePayload): Promise<MasterItem> =>
  unwrap((await api.patch<{ success: true; data: MasterItem }>(`${path}/${id}`, payload)).data);

const deleteMaster = async (path: string, id: string): Promise<void> => {
  await api.delete(`${path}/${id}`);
};

export const masterApi = {
  listDepartments: async () => listMasters("/departments"),
  listDesignations: async () => listMasters("/designations"),
  listCostCenters: async () => listMasters("/cost-centers"),
  createDepartment: async (payload: MasterCreatePayload) => createMaster("/departments", payload),
  createDesignation: async (payload: MasterCreatePayload) => createMaster("/designations", payload),
  createCostCenter: async (payload: MasterCreatePayload) => createMaster("/cost-centers", payload),
  updateDepartment: async (id: string, payload: MasterUpdatePayload) => updateMaster("/departments", id, payload),
  updateDesignation: async (id: string, payload: MasterUpdatePayload) => updateMaster("/designations", id, payload),
  updateCostCenter: async (id: string, payload: MasterUpdatePayload) => updateMaster("/cost-centers", id, payload),
  deleteDepartment: async (id: string) => deleteMaster("/departments", id),
  deleteDesignation: async (id: string) => deleteMaster("/designations", id),
  deleteCostCenter: async (id: string) => deleteMaster("/cost-centers", id)
};
