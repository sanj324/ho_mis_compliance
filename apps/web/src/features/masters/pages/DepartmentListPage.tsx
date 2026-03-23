import type { ReactElement } from "react";

import { MasterCrudPage } from "../components/MasterCrudPage";
import { masterApi } from "../services/masterApi";

export const DepartmentListPage = (): ReactElement => (
  <MasterCrudPage
    entityLabel="Department"
    subtitle="Department Master"
    queryKey="departments"
    listQuery={masterApi.listDepartments}
    createMutation={masterApi.createDepartment}
    updateMutation={masterApi.updateDepartment}
    deleteMutation={masterApi.deleteDepartment}
  />
);
