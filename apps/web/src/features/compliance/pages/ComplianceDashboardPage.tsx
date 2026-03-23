import type { ReactElement } from "react";
import { useQuery } from "@tanstack/react-query";

import { PageTitle } from "../../../components/common/PageTitle";
import { StatCard } from "../../../components/common/StatCard";
import { complianceApi } from "../services/complianceApi";

export const ComplianceDashboardPage = (): ReactElement => {
  const { data } = useQuery({
    queryKey: ["compliance", "summary"],
    queryFn: complianceApi.getDashboardSummary
  });

  return (
    <div className="space-y-6">
      <PageTitle title="Compliance Dashboard" subtitle="Central Compliance Monitoring" />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Open Events" value={data?.openEvents ?? 0} />
        <StatCard label="High Severity Open" value={data?.highSeverityOpen ?? 0} />
        <StatCard label="Overdue Items" value={data?.overdueCalendarItems ?? 0} />
        <StatCard label="Upcoming Due Dates" value={data?.upcomingCalendarItems ?? 0} />
      </div>
    </div>
  );
};
