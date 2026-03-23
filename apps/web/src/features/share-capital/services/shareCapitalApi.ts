import { api } from "../../../lib/api";
import type {
  DividendDeclarationItem,
  MemberItem,
  ShareCapitalDashboardSummary,
  ShareClassItem
} from "../types";

const unwrap = <T>(payload: { success: true; data: T }): T => payload.data;

const normalizeMember = (item: Record<string, unknown>): MemberItem => ({
  id: String(item.id),
  memberCode: String(item.memberCode),
  memberName: String(item.memberName),
  branchId: String(item.branchId),
  panNo: item.panNo ? String(item.panNo) : null,
  aadhaarNo: item.aadhaarNo ? String(item.aadhaarNo) : null,
  kycStatus: String(item.kycStatus),
  memberStatus: String(item.memberStatus),
  freezeStatus: Boolean(item.freezeStatus),
  lienStatus: Boolean(item.lienStatus),
  registrarRefNo: item.registrarRefNo ? String(item.registrarRefNo) : null,
  ...(item.currentBalance !== undefined ? { currentBalance: Number(item.currentBalance) } : {}),
  ...(item.branch && typeof item.branch === "object"
    ? {
        branch: {
          id: String((item.branch as Record<string, unknown>).id),
          code: String((item.branch as Record<string, unknown>).code),
          name: String((item.branch as Record<string, unknown>).name)
        }
      }
    : {})
});

const normalizeShareClass = (item: Record<string, unknown>): ShareClassItem => ({
  id: String(item.id),
  code: String(item.code),
  name: String(item.name),
  faceValue: Number(item.faceValue ?? 0),
  dividendRate: item.dividendRate !== null && item.dividendRate !== undefined ? Number(item.dividendRate) : null,
  isActive: Boolean(item.isActive)
});

export const shareCapitalApi = {
  getDashboardSummary: async (): Promise<ShareCapitalDashboardSummary> =>
    unwrap((await api.get<{ success: true; data: ShareCapitalDashboardSummary }>("/share-capital/dashboard/summary")).data),
  listMembers: async (): Promise<MemberItem[]> =>
    unwrap((await api.get<{ success: true; data: Array<Record<string, unknown>> }>("/share-capital/members")).data).map(normalizeMember),
  getMember: async (id: string): Promise<MemberItem> =>
    normalizeMember(unwrap((await api.get<{ success: true; data: Record<string, unknown> }>(`/share-capital/members/${id}`)).data)),
  createMember: async (payload: Record<string, unknown>): Promise<MemberItem> =>
    normalizeMember(unwrap((await api.post<{ success: true; data: Record<string, unknown> }>("/share-capital/members", payload)).data)),
  updateMember: async (id: string, payload: Record<string, unknown>): Promise<MemberItem> =>
    normalizeMember(unwrap((await api.patch<{ success: true; data: Record<string, unknown> }>(`/share-capital/members/${id}`, payload)).data)),
  listShareClasses: async (): Promise<ShareClassItem[]> =>
    unwrap((await api.get<{ success: true; data: Array<Record<string, unknown>> }>("/share-capital/share-classes")).data).map(normalizeShareClass),
  createShareClass: async (payload: Record<string, unknown>): Promise<ShareClassItem> =>
    normalizeShareClass(unwrap((await api.post<{ success: true; data: Record<string, unknown> }>("/share-capital/share-classes", payload)).data)),
  createAllotment: async (payload: Record<string, unknown>) =>
    unwrap((await api.post<{ success: true; data: Record<string, unknown> }>("/share-capital/allotments", payload)).data),
  createTransfer: async (payload: Record<string, unknown>) =>
    unwrap((await api.post<{ success: true; data: Record<string, unknown> }>("/share-capital/transfers", payload)).data),
  createRedemption: async (payload: Record<string, unknown>) =>
    unwrap((await api.post<{ success: true; data: Record<string, unknown> }>("/share-capital/redemptions", payload)).data),
  listDividends: async (): Promise<DividendDeclarationItem[]> =>
    unwrap((await api.get<{ success: true; data: DividendDeclarationItem[] }>("/share-capital/dividends")).data),
  declareDividend: async (payload: Record<string, unknown>) =>
    unwrap((await api.post<{ success: true; data: Record<string, unknown> }>("/share-capital/dividends/declare", payload)).data),
  shareRegister: async () =>
    unwrap((await api.get<{ success: true; data: Array<Record<string, unknown>> }>("/share-capital/reports/share-register")).data),
  dividendRegister: async () =>
    unwrap((await api.get<{ success: true; data: Array<Record<string, unknown>> }>("/share-capital/reports/dividend-register")).data),
  kycDeficientMembers: async () =>
    unwrap((await api.get<{ success: true; data: Array<Record<string, unknown>> }>("/share-capital/reports/kyc-deficient-members")).data)
};
