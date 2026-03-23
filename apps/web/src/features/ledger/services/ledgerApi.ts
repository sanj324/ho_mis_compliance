import { api } from "../../../lib/api";

const unwrap = <T>(payload: { success: true; data: T }): T => payload.data;

export type LedgerAccountItem = {
  id: string;
  accountCode: string;
  accountName: string;
  accountType: string;
};

export type VoucherItem = {
  id: string;
  voucherNo: string;
  moduleName: string;
  referenceType: string;
  referenceId: string;
  narration: string;
  totalAmount: string | number;
  postingDate: string;
};

export const ledgerApi = {
  listAccounts: async (): Promise<LedgerAccountItem[]> =>
    unwrap((await api.get<{ success: true; data: LedgerAccountItem[] }>("/ledger/accounts")).data),
  listVouchers: async (): Promise<VoucherItem[]> =>
    unwrap((await api.get<{ success: true; data: VoucherItem[] }>("/ledger/vouchers")).data),
  postPayroll: async (runId: string) =>
    unwrap((await api.post<{ success: true; data: VoucherItem }>(`/ledger/postings/payroll/${runId}`)).data),
  postInvestment: async (id: string) =>
    unwrap((await api.post<{ success: true; data: VoucherItem }>(`/ledger/postings/investment/${id}`)).data),
  postAsset: async (id: string) =>
    unwrap((await api.post<{ success: true; data: VoucherItem }>(`/ledger/postings/asset/${id}`)).data),
  postStationery: async (id: string) =>
    unwrap((await api.post<{ success: true; data: VoucherItem }>(`/ledger/postings/stationery/${id}`)).data),
  postShareCapital: async (id: string) =>
    unwrap((await api.post<{ success: true; data: VoucherItem }>(`/ledger/postings/share-capital/${id}`)).data)
};
