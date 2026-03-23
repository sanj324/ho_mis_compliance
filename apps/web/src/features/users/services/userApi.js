import { api } from "../../../lib/api";
export const userApi = {
    list: async () => {
        const response = await api.get("/users");
        return response.data.data;
    },
    create: async (payload) => {
        const response = await api.post("/users", payload);
        return response.data.data;
    },
    update: async (id, payload) => {
        const response = await api.patch(`/users/${id}`, payload);
        return response.data.data;
    },
    options: async () => {
        const response = await api.get("/users/options");
        return response.data.data;
    }
};
