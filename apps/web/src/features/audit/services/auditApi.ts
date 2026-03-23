import type { AuditLogRecord } from "@ho-mis/types";

import { api } from "../../../lib/api";

export const auditApi = {
  list: async (): Promise<AuditLogRecord[]> => {
    const response = await api.get<{ success: true; data: AuditLogRecord[] }>("/audit-logs");
    return response.data.data;
  }
};
