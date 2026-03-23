import type { ReactElement } from "react";
import { useQuery } from "@tanstack/react-query";

import { PageTitle } from "../../../components/common/PageTitle";
import { StatCard } from "../../../components/common/StatCard";
import { stationeryApi } from "../services/stationeryApi";

export const StationeryDashboardPage = (): ReactElement => {
  const { data } = useQuery({
    queryKey: ["stationery", "dashboard"],
    queryFn: stationeryApi.getDashboardSummary
  });

  return (
    <div className="space-y-6">
      <PageTitle title="Stationery Dashboard" subtitle="Inventory Control View" />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total Items" value={data?.totalItems ?? 0} />
        <StatCard label="Low Stock" value={data?.lowStockCount ?? 0} />
        <StatCard label="Total Issued" value={data?.totalIssued ?? 0} />
        <StatCard label="Open Exceptions" value={data?.exceptionCount ?? 0} />
      </div>
    </div>
  );
};
