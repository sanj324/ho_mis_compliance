import { api } from "../../../lib/api";
const unwrap = (payload) => payload.data;
export const complianceApi = {
    getDashboardSummary: async () => unwrap((await api.get("/compliance/dashboard/summary")).data),
    listEvents: async () => unwrap((await api.get("/compliance/events")).data),
    getCalendar: async () => unwrap((await api.get("/compliance/calendar")).data),
    closeEvent: async (id, remarks) => unwrap((await api.post(`/compliance/events/${id}/close`, { remarks })).data)
};
