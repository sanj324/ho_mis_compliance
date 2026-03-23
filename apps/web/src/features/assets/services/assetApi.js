import { api, downloadFile } from "../../../lib/api";
const unwrap = (payload) => payload.data;
const normalizeAsset = (asset) => ({
    ...asset,
    originalCost: Number(asset.originalCost ?? 0),
    netBookValue: Number(asset.netBookValue ?? 0)
});
export const assetApi = {
    getDashboardSummary: async () => unwrap((await api.get("/assets/dashboard/summary")).data),
    listAssets: async () => unwrap((await api.get("/assets")).data).map(normalizeAsset),
    getAsset: async (id) => normalizeAsset(unwrap((await api.get(`/assets/${id}`)).data)),
    createAsset: async (payload) => normalizeAsset(unwrap((await api.post("/assets", payload)).data)),
    updateAsset: async (id, payload) => normalizeAsset(unwrap((await api.patch(`/assets/${id}`, payload)).data)),
    listCategories: async () => unwrap((await api.get("/assets/categories")).data),
    createCategory: async (payload) => unwrap((await api.post("/assets/categories", payload)).data),
    listDepreciationMethods: async () => unwrap((await api.get("/assets/depreciation-methods")).data),
    createDepreciationMethod: async (payload) => unwrap((await api.post("/assets/depreciation-methods", payload)).data),
    runDepreciation: async (payload) => unwrap((await api.post("/assets/depreciation/run", payload)).data),
    listInsurances: async () => unwrap((await api.get("/assets/insurances")).data),
    createInsurance: async (payload) => unwrap((await api.post("/assets/insurances", payload)).data),
    listTransfers: async () => unwrap((await api.get("/assets/transfers")).data),
    createTransfer: async (payload) => unwrap((await api.post("/assets/transfers", payload)).data),
    listDisposals: async () => unwrap((await api.get("/assets/disposals")).data),
    createDisposal: async (payload) => unwrap((await api.post("/assets/disposals", payload)).data),
    registerReport: async () => unwrap((await api.get("/assets/reports/register")).data),
    depreciationSchedule: async () => unwrap((await api.get("/assets/reports/depreciation-schedule")).data),
    insuranceExpiryReport: async () => unwrap((await api.get("/assets/reports/insurance-expiry")).data),
    downloadReport: async (report, format) => {
        const extension = format === "excel" ? "xls" : format;
        await downloadFile(`/assets/reports/${report}/export?format=${format}`, `assets-${report}.${extension}`);
    }
};
