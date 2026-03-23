import type { HODashboardSummary } from "@ho-mis/types";

import { api } from "../../../lib/api";

export const dashboardApi = {
  getSummary: async (): Promise<HODashboardSummary> => {
    const response = await api.get<{ success: true; data: HODashboardSummary }>("/dashboard/ho-summary");
    return response.data.data;
  }
};
