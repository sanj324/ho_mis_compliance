import type { ReactElement } from "react";
import { useQuery } from "@tanstack/react-query";

import { DataTablePlaceholder } from "../../../components/common/DataTablePlaceholder";
import { PageTitle } from "../../../components/common/PageTitle";
import { complianceApi } from "../services/complianceApi";

export const ComplianceCalendarPage = (): ReactElement => {
  const { data } = useQuery({
    queryKey: ["compliance", "calendar"],
    queryFn: complianceApi.getCalendar
  });

  return (
    <div className="space-y-6">
      <PageTitle title="Compliance Calendar" subtitle="Due Dates and Filing Calendar" />
      <DataTablePlaceholder
        columns={["Title", "Module", "Frequency", "Due Date", "Status"]}
        rows={(data ?? []).map((item) => ({
          Title: item.title,
          Module: item.moduleName,
          Frequency: item.frequency,
          "Due Date": new Date(item.dueDate).toLocaleDateString(),
          Status: item.status
        }))}
      />
    </div>
  );
};
