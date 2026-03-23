import { api, downloadFile } from "../../../lib/api";
const unwrap = (payload) => payload.data;
const normalizeItem = (item) => ({
    ...item,
    reorderLevel: Number(item.reorderLevel ?? 0),
    maxLevel: Number(item.maxLevel ?? 0),
    gstRate: Number(item.gstRate ?? 0)
});
export const stationeryApi = {
    getDashboardSummary: async () => unwrap((await api.get("/stationery/dashboard/summary")).data),
    listItems: async () => unwrap((await api.get("/stationery/items")).data).map(normalizeItem),
    createItem: async (payload) => normalizeItem(unwrap((await api.post("/stationery/items", payload)).data)),
    listCategories: async () => unwrap((await api.get("/stationery/categories")).data),
    createCategory: async (payload) => unwrap((await api.post("/stationery/categories", payload)).data),
    listVendors: async () => unwrap((await api.get("/stationery/vendors")).data),
    createVendor: async (payload) => unwrap((await api.post("/stationery/vendors", payload)).data),
    createRequisition: async (payload) => unwrap((await api.post("/stationery/requisitions", payload)).data),
    createIssue: async (payload) => unwrap((await api.post("/stationery/issues", payload)).data),
    listTransfers: async () => unwrap((await api.get("/stationery/transfers")).data),
    createTransfer: async (payload) => unwrap((await api.post("/stationery/transfers", payload)).data),
    stockRegister: async () => unwrap((await api.get("/stationery/reports/stock-register")).data),
    consumptionReport: async () => unwrap((await api.get("/stationery/reports/consumption")).data),
    lowStockReport: async () => unwrap((await api.get("/stationery/reports/low-stock")).data),
    downloadReport: async (report, format) => {
        const extension = format === "excel" ? "xls" : format;
        await downloadFile(`/stationery/reports/${report}/export?format=${format}`, `stationery-${report}.${extension}`);
    }
};
