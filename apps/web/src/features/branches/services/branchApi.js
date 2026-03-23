import { api } from "../../../lib/api";
export const branchApi = {
    list: async () => {
        const response = await api.get("/branches");
        return response.data.data;
    },
    create: async (payload) => {
        const response = await api.post("/branches", payload);
        return response.data.data;
    },
    update: async (id, payload) => {
        const response = await api.patch(`/branches/${id}`, payload);
        return response.data.data;
    }
};
