import { api } from "../../../lib/api";
import type { ComplianceCalendarItem, ComplianceEventItem, ComplianceSummary } from "../types";

const unwrap = <T>(payload: { success: true; data: T }): T => payload.data;

export const complianceApi = {
  getDashboardSummary: async (): Promise<ComplianceSummary> =>
    unwrap((await api.get<{ success: true; data: ComplianceSummary }>("/compliance/dashboard/summary")).data),
  listEvents: async (): Promise<ComplianceEventItem[]> =>
    unwrap((await api.get<{ success: true; data: ComplianceEventItem[] }>("/compliance/events")).data),
  getCalendar: async (): Promise<ComplianceCalendarItem[]> =>
    unwrap((await api.get<{ success: true; data: ComplianceCalendarItem[] }>("/compliance/calendar")).data),
  closeEvent: async (id: string, remarks: string) =>
    unwrap((await api.post<{ success: true; data: ComplianceEventItem }>(`/compliance/events/${id}/close`, { remarks })).data)
};
