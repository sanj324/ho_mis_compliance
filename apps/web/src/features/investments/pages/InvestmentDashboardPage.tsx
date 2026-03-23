import type { ReactElement } from "react";
import { useQuery } from "@tanstack/react-query";
import { Bar, BarChart, CartesianGrid, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import { PageTitle } from "../../../components/common/PageTitle";
import { StatCard } from "../../../components/common/StatCard";
import { investmentApi } from "../services/investmentApi";

export const InvestmentDashboardPage = (): ReactElement => {
  const { data } = useQuery({
    queryKey: ["investments", "dashboard"],
    queryFn: investmentApi.getDashboardSummary
  });

  return (
    <div className="space-y-6">
      <PageTitle title="Investment Dashboard" subtitle="Treasury Portfolio Control" />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total Investments" value={data?.totalCount ?? 0} />
        <StatCard label="Book Value" value={data?.totalBookValue ?? 0} />
        <StatCard label="Market Value" value={data?.totalMarketValue ?? 0} />
        <StatCard label="Rating Buckets" value={data?.byRating.length ?? 0} />
      </div>
      <div className="grid gap-6 xl:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-panel">
          <h3 className="text-sm font-semibold text-slate-900">Classification Mix</h3>
          <div className="mt-4 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data?.byClassification ?? []}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="classification" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="bookValue" fill="#0f4c81" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-panel">
          <h3 className="text-sm font-semibold text-slate-900">Maturity Buckets</h3>
          <div className="mt-4 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={data?.byMaturityBucket ?? []} dataKey="count" nameKey="bucket" outerRadius={100} fill="#0f4c81" label />
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
