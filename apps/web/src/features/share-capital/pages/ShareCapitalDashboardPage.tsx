import type { ReactElement } from "react";
import { useQuery } from "@tanstack/react-query";

import { PageTitle } from "../../../components/common/PageTitle";
import { StatCard } from "../../../components/common/StatCard";
import { shareCapitalApi } from "../services/shareCapitalApi";

export const ShareCapitalDashboardPage = (): ReactElement => {
  const { data } = useQuery({
    queryKey: ["share-capital", "dashboard"],
    queryFn: shareCapitalApi.getDashboardSummary
  });

  return (
    <div className="space-y-6">
      <PageTitle title="Share Capital Dashboard" subtitle="Member Capital Oversight" />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total Members" value={data?.totalMembers ?? 0} />
        <StatCard label="Active Members" value={data?.activeMembers ?? 0} />
        <StatCard label="Total Share Capital" value={data?.totalShareCapital ?? 0} />
        <StatCard label="Pending Dividend" value={data?.pendingDividendAmount ?? 0} />
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard label="KYC Deficient" value={data?.kycDeficientMembers ?? 0} />
        <StatCard label="Frozen Members" value={data?.frozenMembers ?? 0} />
      </div>
    </div>
  );
};
