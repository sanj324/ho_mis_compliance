import type { ReactElement } from "react";
import { useQuery } from "@tanstack/react-query";

import { DataTablePlaceholder } from "../../../components/common/DataTablePlaceholder";
import { PageTitle } from "../../../components/common/PageTitle";
import { auditApi } from "../services/auditApi";

export const AuditLogPage = (): ReactElement => {
  const { data = [] } = useQuery({
    queryKey: ["audit-logs"],
    queryFn: auditApi.list
  });

  return (
    <div className="space-y-6">
      <PageTitle title="Audit Trail" subtitle="Control Monitoring" />
      <DataTablePlaceholder
        columns={["moduleName", "entityName", "action", "requestId", "createdAt"]}
        rows={data.map((row) => ({
          moduleName: row.moduleName,
          entityName: row.entityName,
          action: row.action,
          requestId: row.requestId,
          createdAt: row.createdAt
        }))}
      />
    </div>
  );
};
