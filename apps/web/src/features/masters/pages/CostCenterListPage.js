import { jsx as _jsx } from "react/jsx-runtime";
import { MasterCrudPage } from "../components/MasterCrudPage";
import { masterApi } from "../services/masterApi";
export const CostCenterListPage = () => (_jsx(MasterCrudPage, { entityLabel: "Cost Center", subtitle: "Cost Center Master", queryKey: "cost-centers", listQuery: masterApi.listCostCenters, createMutation: masterApi.createCostCenter, updateMutation: masterApi.updateCostCenter, deleteMutation: masterApi.deleteCostCenter }));
