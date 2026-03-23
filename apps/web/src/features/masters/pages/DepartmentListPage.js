import { jsx as _jsx } from "react/jsx-runtime";
import { MasterCrudPage } from "../components/MasterCrudPage";
import { masterApi } from "../services/masterApi";
export const DepartmentListPage = () => (_jsx(MasterCrudPage, { entityLabel: "Department", subtitle: "Department Master", queryKey: "departments", listQuery: masterApi.listDepartments, createMutation: masterApi.createDepartment, updateMutation: masterApi.updateDepartment, deleteMutation: masterApi.deleteDepartment }));
