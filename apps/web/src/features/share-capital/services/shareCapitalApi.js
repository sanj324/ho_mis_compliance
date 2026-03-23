import { api } from "../../../lib/api";
const unwrap = (payload) => payload.data;
const normalizeMember = (item) => ({
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
                id: String(item.branch.id),
                code: String(item.branch.code),
                name: String(item.branch.name)
            }
        }
        : {})
});
const normalizeShareClass = (item) => ({
    id: String(item.id),
    code: String(item.code),
    name: String(item.name),
    faceValue: Number(item.faceValue ?? 0),
    dividendRate: item.dividendRate !== null && item.dividendRate !== undefined ? Number(item.dividendRate) : null,
    isActive: Boolean(item.isActive)
});
export const shareCapitalApi = {
    getDashboardSummary: async () => unwrap((await api.get("/share-capital/dashboard/summary")).data),
    listMembers: async () => unwrap((await api.get("/share-capital/members")).data).map(normalizeMember),
    getMember: async (id) => normalizeMember(unwrap((await api.get(`/share-capital/members/${id}`)).data)),
    createMember: async (payload) => normalizeMember(unwrap((await api.post("/share-capital/members", payload)).data)),
    updateMember: async (id, payload) => normalizeMember(unwrap((await api.patch(`/share-capital/members/${id}`, payload)).data)),
    listShareClasses: async () => unwrap((await api.get("/share-capital/share-classes")).data).map(normalizeShareClass),
    createShareClass: async (payload) => normalizeShareClass(unwrap((await api.post("/share-capital/share-classes", payload)).data)),
    createAllotment: async (payload) => unwrap((await api.post("/share-capital/allotments", payload)).data),
    createTransfer: async (payload) => unwrap((await api.post("/share-capital/transfers", payload)).data),
    createRedemption: async (payload) => unwrap((await api.post("/share-capital/redemptions", payload)).data),
    listDividends: async () => unwrap((await api.get("/share-capital/dividends")).data),
    declareDividend: async (payload) => unwrap((await api.post("/share-capital/dividends/declare", payload)).data),
    shareRegister: async () => unwrap((await api.get("/share-capital/reports/share-register")).data),
    dividendRegister: async () => unwrap((await api.get("/share-capital/reports/dividend-register")).data),
    kycDeficientMembers: async () => unwrap((await api.get("/share-capital/reports/kyc-deficient-members")).data)
};
