import { api, downloadFile } from "../../../lib/api";
import type { AssetDashboardSummary, AssetItem, AssetMasterItem } from "../types";

const unwrap = <T>(payload: { success: true; data: T }): T => payload.data;

const normalizeAsset = (asset: Record<string, unknown>): AssetItem => ({
  ...(asset as unknown as AssetItem),
  originalCost: Number(asset.originalCost ?? 0),
  netBookValue: Number(asset.netBookValue ?? 0)
});

export const assetApi = {
  getDashboardSummary: async (): Promise<AssetDashboardSummary> =>
    unwrap((await api.get<{ success: true; data: AssetDashboardSummary }>("/assets/dashboard/summary")).data),
  listAssets: async (): Promise<AssetItem[]> =>
    unwrap((await api.get<{ success: true; data: Array<Record<string, unknown>> }>("/assets")).data).map(normalizeAsset),
  getAsset: async (id: string): Promise<AssetItem> =>
    normalizeAsset(unwrap((await api.get<{ success: true; data: Record<string, unknown> }>(`/assets/${id}`)).data)),
  createAsset: async (payload: Record<string, unknown>): Promise<AssetItem> =>
    normalizeAsset(unwrap((await api.post<{ success: true; data: Record<string, unknown> }>("/assets", payload)).data)),
  updateAsset: async (id: string, payload: Record<string, unknown>): Promise<AssetItem> =>
    normalizeAsset(unwrap((await api.patch<{ success: true; data: Record<string, unknown> }>(`/assets/${id}`, payload)).data)),
  listCategories: async (): Promise<AssetMasterItem[]> =>
    unwrap((await api.get<{ success: true; data: AssetMasterItem[] }>("/assets/categories")).data),
  createCategory: async (payload: Record<string, unknown>): Promise<AssetMasterItem> =>
    unwrap((await api.post<{ success: true; data: AssetMasterItem }>("/assets/categories", payload)).data),
  listDepreciationMethods: async (): Promise<AssetMasterItem[]> =>
    unwrap((await api.get<{ success: true; data: AssetMasterItem[] }>("/assets/depreciation-methods")).data),
  createDepreciationMethod: async (payload: Record<string, unknown>): Promise<AssetMasterItem> =>
    unwrap((await api.post<{ success: true; data: AssetMasterItem }>("/assets/depreciation-methods", payload)).data),
  runDepreciation: async (payload: Record<string, unknown>) =>
    unwrap((await api.post<{ success: true; data: Array<Record<string, unknown>> }>("/assets/depreciation/run", payload)).data),
  listInsurances: async () =>
    unwrap((await api.get<{ success: true; data: Array<Record<string, unknown>> }>("/assets/insurances")).data),
  createInsurance: async (payload: Record<string, unknown>) =>
    unwrap((await api.post<{ success: true; data: Record<string, unknown> }>("/assets/insurances", payload)).data),
  listTransfers: async () =>
    unwrap((await api.get<{ success: true; data: Array<Record<string, unknown>> }>("/assets/transfers")).data),
  createTransfer: async (payload: Record<string, unknown>) =>
    unwrap((await api.post<{ success: true; data: Record<string, unknown> }>("/assets/transfers", payload)).data),
  listDisposals: async () =>
    unwrap((await api.get<{ success: true; data: Array<Record<string, unknown>> }>("/assets/disposals")).data),
  createDisposal: async (payload: Record<string, unknown>) =>
    unwrap((await api.post<{ success: true; data: Record<string, unknown> }>("/assets/disposals", payload)).data),
  registerReport: async () =>
    unwrap((await api.get<{ success: true; data: Array<Record<string, unknown>> }>("/assets/reports/register")).data),
  depreciationSchedule: async () =>
    unwrap((await api.get<{ success: true; data: Array<Record<string, unknown>> }>("/assets/reports/depreciation-schedule")).data),
  insuranceExpiryReport: async () =>
    unwrap((await api.get<{ success: true; data: Array<Record<string, unknown>> }>("/assets/reports/insurance-expiry")).data),
  downloadReport: async (report: "register" | "depreciation-schedule" | "insurance-expiry", format: "csv" | "excel" | "pdf") => {
    const extension = format === "excel" ? "xls" : format;
    await downloadFile(`/assets/reports/${report}/export?format=${format}`, `assets-${report}.${extension}`);
  }
};
