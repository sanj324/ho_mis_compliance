import { api } from "../../../lib/api";
export const dashboardApi = {
    getSummary: async () => {
        const response = await api.get("/dashboard/ho-summary");
        return response.data.data;
    }
};
