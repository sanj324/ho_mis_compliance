import { api, downloadFile } from "../../../lib/api";
import type { StationeryDashboardSummary, StationeryItem, StationeryMasterItem } from "../types";

const unwrap = <T>(payload: { success: true; data: T }): T => payload.data;

const normalizeItem = (item: Record<string, unknown>): StationeryItem => ({
  ...(item as unknown as StationeryItem),
  reorderLevel: Number(item.reorderLevel ?? 0),
  maxLevel: Number(item.maxLevel ?? 0),
  gstRate: Number(item.gstRate ?? 0)
});

export const stationeryApi = {
  getDashboardSummary: async (): Promise<StationeryDashboardSummary> =>
    unwrap((await api.get<{ success: true; data: StationeryDashboardSummary }>("/stationery/dashboard/summary")).data),
  listItems: async (): Promise<StationeryItem[]> =>
    unwrap((await api.get<{ success: true; data: Array<Record<string, unknown>> }>("/stationery/items")).data).map(normalizeItem),
  createItem: async (payload: Record<string, unknown>): Promise<StationeryItem> =>
    normalizeItem(unwrap((await api.post<{ success: true; data: Record<string, unknown> }>("/stationery/items", payload)).data)),
  listCategories: async (): Promise<StationeryMasterItem[]> =>
    unwrap((await api.get<{ success: true; data: StationeryMasterItem[] }>("/stationery/categories")).data),
  createCategory: async (payload: Record<string, unknown>): Promise<StationeryMasterItem> =>
    unwrap((await api.post<{ success: true; data: StationeryMasterItem }>("/stationery/categories", payload)).data),
  listVendors: async (): Promise<Array<Record<string, unknown>>> =>
    unwrap((await api.get<{ success: true; data: Array<Record<string, unknown>> }>("/stationery/vendors")).data),
  createVendor: async (payload: Record<string, unknown>) =>
    unwrap((await api.post<{ success: true; data: Record<string, unknown> }>("/stationery/vendors", payload)).data),
  createRequisition: async (payload: Record<string, unknown>) =>
    unwrap((await api.post<{ success: true; data: Record<string, unknown> }>("/stationery/requisitions", payload)).data),
  createIssue: async (payload: Record<string, unknown>) =>
    unwrap((await api.post<{ success: true; data: Record<string, unknown> }>("/stationery/issues", payload)).data),
  listTransfers: async (): Promise<Array<Record<string, unknown>>> =>
    unwrap((await api.get<{ success: true; data: Array<Record<string, unknown>> }>("/stationery/transfers")).data),
  createTransfer: async (payload: Record<string, unknown>) =>
    unwrap((await api.post<{ success: true; data: Record<string, unknown> }>("/stationery/transfers", payload)).data),
  stockRegister: async () =>
    unwrap((await api.get<{ success: true; data: Array<Record<string, unknown>> }>("/stationery/reports/stock-register")).data),
  consumptionReport: async () =>
    unwrap((await api.get<{ success: true; data: Array<Record<string, unknown>> }>("/stationery/reports/consumption")).data),
  lowStockReport: async () =>
    unwrap((await api.get<{ success: true; data: Array<Record<string, unknown>> }>("/stationery/reports/low-stock")).data),
  downloadReport: async (report: "stock-register" | "consumption" | "low-stock", format: "csv" | "excel" | "pdf") => {
    const extension = format === "excel" ? "xls" : format;
    await downloadFile(`/stationery/reports/${report}/export?format=${format}`, `stationery-${report}.${extension}`);
  }
};
