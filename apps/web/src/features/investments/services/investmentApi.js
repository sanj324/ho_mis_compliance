import { api } from "../../../lib/api";
const unwrap = (payload) => payload.data;
const toNullableNumber = (value) => value === null || value === undefined ? null : Number(value);
const toInvestmentItem = (item) => ({
    ...item,
    faceValue: Number(item.faceValue),
    bookValue: Number(item.bookValue),
    marketValue: toNullableNumber(item.marketValue),
    yieldRate: toNullableNumber(item.yieldRate)
});
export const investmentApi = {
    getDashboardSummary: async () => unwrap((await api.get("/investments/dashboard/summary")).data),
    listInvestments: async () => unwrap((await api.get("/investments")).data).map(toInvestmentItem),
    getInvestment: async (id) => toInvestmentItem(unwrap((await api.get(`/investments/${id}`)).data)),
    createInvestment: async (payload) => toInvestmentItem(unwrap((await api.post("/investments", payload)).data)),
    updateInvestment: async (id, payload) => toInvestmentItem(unwrap((await api.patch(`/investments/${id}`, payload)).data)),
    postAccrual: async (id) => unwrap((await api.post(`/investments/${id}/accrual`)).data),
    listCounterparties: async () => unwrap((await api.get("/investments/counterparties")).data),
    createCounterparty: async (payload) => unwrap((await api.post("/investments/counterparties", payload)).data),
    listSecurityTypes: async () => unwrap((await api.get("/investments/security-types")).data),
    createSecurityType: async (payload) => unwrap((await api.post("/investments/security-types", payload)).data),
    listIssuers: async () => unwrap((await api.get("/investments/issuers")).data),
    createIssuer: async (payload) => unwrap((await api.post("/investments/issuers", payload)).data),
    listBrokers: async () => unwrap((await api.get("/investments/brokers")).data),
    createBroker: async (payload) => unwrap((await api.post("/investments/brokers", payload)).data),
    getRegisterReport: async () => unwrap((await api.get("/investments/reports/register")).data),
    getMaturityLadder: async () => unwrap((await api.get("/investments/reports/maturity-ladder")).data),
    getExposureSummary: async () => unwrap((await api.get("/investments/reports/exposure-summary")).data),
    getExposureChecks: async () => unwrap((await api.get("/investments/exposure/checks")).data)
};
