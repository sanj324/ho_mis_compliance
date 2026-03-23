import type { ReactElement } from "react";
import { useQuery } from "@tanstack/react-query";

import { PageTitle } from "../../../components/common/PageTitle";
import { StatCard } from "../../../components/common/StatCard";
import { assetApi } from "../services/assetApi";

export const AssetDashboardPage = (): ReactElement => {
  const { data } = useQuery({
    queryKey: ["assets", "dashboard"],
    queryFn: assetApi.getDashboardSummary
  });

  return (
    <div className="space-y-6">
      <PageTitle title="Asset Dashboard" subtitle="Fixed Asset Control View" />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total Assets" value={data?.totalAssets ?? 0} />
        <StatCard label="Original Cost" value={data?.totalOriginalCost ?? 0} />
        <StatCard label="Net Book Value" value={data?.totalNetBookValue ?? 0} />
        <StatCard label="Insurance Expiring" value={data?.insuranceExpiring ?? 0} />
      </div>
    </div>
  );
};
