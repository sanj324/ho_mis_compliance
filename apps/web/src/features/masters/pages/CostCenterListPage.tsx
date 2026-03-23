import type { ReactElement } from "react";

import { MasterCrudPage } from "../components/MasterCrudPage";
import { masterApi } from "../services/masterApi";

export const CostCenterListPage = (): ReactElement => (
  <MasterCrudPage
    entityLabel="Cost Center"
    subtitle="Cost Center Master"
    queryKey="cost-centers"
    listQuery={masterApi.listCostCenters}
    createMutation={masterApi.createCostCenter}
    updateMutation={masterApi.updateCostCenter}
    deleteMutation={masterApi.deleteCostCenter}
  />
);
