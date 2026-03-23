import { api } from "../../../lib/api";
const unwrap = (payload) => payload.data;
const listMasters = async (path) => unwrap((await api.get(path)).data);
const createMaster = async (path, payload) => unwrap((await api.post(path, payload)).data);
const updateMaster = async (path, id, payload) => unwrap((await api.patch(`${path}/${id}`, payload)).data);
const deleteMaster = async (path, id) => {
    await api.delete(`${path}/${id}`);
};
export const masterApi = {
    listDepartments: async () => listMasters("/departments"),
    listDesignations: async () => listMasters("/designations"),
    listCostCenters: async () => listMasters("/cost-centers"),
    createDepartment: async (payload) => createMaster("/departments", payload),
    createDesignation: async (payload) => createMaster("/designations", payload),
    createCostCenter: async (payload) => createMaster("/cost-centers", payload),
    updateDepartment: async (id, payload) => updateMaster("/departments", id, payload),
    updateDesignation: async (id, payload) => updateMaster("/designations", id, payload),
    updateCostCenter: async (id, payload) => updateMaster("/cost-centers", id, payload),
    deleteDepartment: async (id) => deleteMaster("/departments", id),
    deleteDesignation: async (id) => deleteMaster("/designations", id),
    deleteCostCenter: async (id) => deleteMaster("/cost-centers", id)
};
