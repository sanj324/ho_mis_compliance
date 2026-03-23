import { api } from "../../../lib/api";
import type {
  ExposureCheckResult,
  ExposureSummaryRow,
  InvestmentDashboardSummary,
  InvestmentItem,
  InvestmentMasterItem,
  MaturityLadderRow,
  RegisterReportRow
} from "../types";

const unwrap = <T>(payload: { success: true; data: T }): T => payload.data;
const toNullableNumber = (value: number | string | null | undefined): number | null =>
  value === null || value === undefined ? null : Number(value);
const toInvestmentItem = (item: InvestmentItem): InvestmentItem => ({
  ...item,
  faceValue: Number(item.faceValue),
  bookValue: Number(item.bookValue),
  marketValue: toNullableNumber(item.marketValue),
  yieldRate: toNullableNumber(item.yieldRate)
});

export const investmentApi = {
  getDashboardSummary: async (): Promise<InvestmentDashboardSummary> =>
    unwrap((await api.get<{ success: true; data: InvestmentDashboardSummary }>("/investments/dashboard/summary")).data),
  listInvestments: async (): Promise<InvestmentItem[]> =>
    unwrap((await api.get<{ success: true; data: InvestmentItem[] }>("/investments")).data).map(toInvestmentItem),
  getInvestment: async (id: string): Promise<InvestmentItem> =>
    toInvestmentItem(unwrap((await api.get<{ success: true; data: InvestmentItem }>(`/investments/${id}`)).data)),
  createInvestment: async (payload: Record<string, unknown>): Promise<InvestmentItem> =>
    toInvestmentItem(unwrap((await api.post<{ success: true; data: InvestmentItem }>("/investments", payload)).data)),
  updateInvestment: async (id: string, payload: Record<string, unknown>): Promise<InvestmentItem> =>
    toInvestmentItem(unwrap((await api.patch<{ success: true; data: InvestmentItem }>(`/investments/${id}`, payload)).data)),
  postAccrual: async (id: string): Promise<Record<string, unknown>> =>
    unwrap((await api.post<{ success: true; data: Record<string, unknown> }>(`/investments/${id}/accrual`)).data),
  listCounterparties: async (): Promise<InvestmentMasterItem[]> =>
    unwrap((await api.get<{ success: true; data: InvestmentMasterItem[] }>("/investments/counterparties")).data),
  createCounterparty: async (payload: Record<string, unknown>): Promise<InvestmentMasterItem> =>
    unwrap((await api.post<{ success: true; data: InvestmentMasterItem }>("/investments/counterparties", payload)).data),
  listSecurityTypes: async (): Promise<InvestmentMasterItem[]> =>
    unwrap((await api.get<{ success: true; data: InvestmentMasterItem[] }>("/investments/security-types")).data),
  createSecurityType: async (payload: Record<string, unknown>): Promise<InvestmentMasterItem> =>
    unwrap((await api.post<{ success: true; data: InvestmentMasterItem }>("/investments/security-types", payload)).data),
  listIssuers: async (): Promise<InvestmentMasterItem[]> =>
    unwrap((await api.get<{ success: true; data: InvestmentMasterItem[] }>("/investments/issuers")).data),
  createIssuer: async (payload: Record<string, unknown>): Promise<InvestmentMasterItem> =>
    unwrap((await api.post<{ success: true; data: InvestmentMasterItem }>("/investments/issuers", payload)).data),
  listBrokers: async (): Promise<InvestmentMasterItem[]> =>
    unwrap((await api.get<{ success: true; data: InvestmentMasterItem[] }>("/investments/brokers")).data),
  createBroker: async (payload: Record<string, unknown>): Promise<InvestmentMasterItem> =>
    unwrap((await api.post<{ success: true; data: InvestmentMasterItem }>("/investments/brokers", payload)).data),
  getRegisterReport: async (): Promise<RegisterReportRow[]> =>
    unwrap((await api.get<{ success: true; data: RegisterReportRow[] }>("/investments/reports/register")).data),
  getMaturityLadder: async (): Promise<MaturityLadderRow[]> =>
    unwrap((await api.get<{ success: true; data: MaturityLadderRow[] }>("/investments/reports/maturity-ladder")).data),
  getExposureSummary: async (): Promise<ExposureSummaryRow[]> =>
    unwrap((await api.get<{ success: true; data: ExposureSummaryRow[] }>("/investments/reports/exposure-summary")).data),
  getExposureChecks: async (): Promise<ExposureCheckResult> =>
    unwrap((await api.get<{ success: true; data: ExposureCheckResult }>("/investments/exposure/checks")).data)
};
