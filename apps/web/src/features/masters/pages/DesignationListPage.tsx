import type { ReactElement } from "react";

import { MasterCrudPage } from "../components/MasterCrudPage";
import { masterApi } from "../services/masterApi";

export const DesignationListPage = (): ReactElement => (
  <MasterCrudPage
    entityLabel="Designation"
    subtitle="Designation Master"
    queryKey="designations"
    listQuery={masterApi.listDesignations}
    createMutation={masterApi.createDesignation}
    updateMutation={masterApi.updateDesignation}
    deleteMutation={masterApi.deleteDesignation}
  />
);
