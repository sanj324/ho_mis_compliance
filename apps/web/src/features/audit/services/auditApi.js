import { api } from "../../../lib/api";
export const auditApi = {
    list: async () => {
        const response = await api.get("/audit-logs");
        return response.data.data;
    }
};
