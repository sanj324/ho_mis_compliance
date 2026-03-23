import { api } from "../../../lib/api";
const unwrap = (payload) => payload.data;
export const documentApi = {
    upload: async (payload) => unwrap((await api.post("/documents/upload", payload)).data),
    list: async () => unwrap((await api.get("/documents")).data),
    getById: async (id) => unwrap((await api.get(`/documents/${id}`)).data)
};
