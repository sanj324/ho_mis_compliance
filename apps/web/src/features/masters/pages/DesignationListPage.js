import { jsx as _jsx } from "react/jsx-runtime";
import { MasterCrudPage } from "../components/MasterCrudPage";
import { masterApi } from "../services/masterApi";
export const DesignationListPage = () => (_jsx(MasterCrudPage, { entityLabel: "Designation", subtitle: "Designation Master", queryKey: "designations", listQuery: masterApi.listDesignations, createMutation: masterApi.createDesignation, updateMutation: masterApi.updateDesignation, deleteMutation: masterApi.deleteDesignation }));
