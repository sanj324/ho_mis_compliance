import type { ReactElement } from "react";
import { useQuery } from "@tanstack/react-query";

import { PageTitle } from "../../../components/common/PageTitle";
import { StatCard } from "../../../components/common/StatCard";
import { dashboardApi } from "../services/dashboardApi";

export const HODashboardPage = (): ReactElement => {
  const { data } = useQuery({
    queryKey: ["dashboard", "ho-summary"],
    queryFn: dashboardApi.getSummary
  });

  return (
    <div className="space-y-6">
      <PageTitle title="HO Dashboard" subtitle="Executive Summary" />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        <StatCard label="Total Branches" value={data?.totalBranches ?? 0} />
        <StatCard label="Total Users" value={data?.totalUsers ?? 0} />
        <StatCard label="Active Users" value={data?.activeUsers ?? 0} />
        <StatCard label="Pending Approvals" value={data?.pendingUserApprovals ?? 0} />
        <StatCard label="Audit Events Today" value={data?.auditEventsToday ?? 0} />
      </div>
    </div>
  );
};
