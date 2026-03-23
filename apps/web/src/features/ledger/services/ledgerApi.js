import { api } from "../../../lib/api";
const unwrap = (payload) => payload.data;
export const ledgerApi = {
    listAccounts: async () => unwrap((await api.get("/ledger/accounts")).data),
    listVouchers: async () => unwrap((await api.get("/ledger/vouchers")).data),
    postPayroll: async (runId) => unwrap((await api.post(`/ledger/postings/payroll/${runId}`)).data),
    postInvestment: async (id) => unwrap((await api.post(`/ledger/postings/investment/${id}`)).data),
    postAsset: async (id) => unwrap((await api.post(`/ledger/postings/asset/${id}`)).data),
    postStationery: async (id) => unwrap((await api.post(`/ledger/postings/stationery/${id}`)).data),
    postShareCapital: async (id) => unwrap((await api.post(`/ledger/postings/share-capital/${id}`)).data)
};
