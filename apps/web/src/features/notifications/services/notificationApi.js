import { api } from "../../../lib/api";
const unwrap = (payload) => payload.data;
export const notificationApi = {
    list: async () => unwrap((await api.get("/notifications")).data),
    markRead: async (id) => unwrap((await api.post(`/notifications/${id}/read`)).data)
};
