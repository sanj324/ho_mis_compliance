import type { ReactElement } from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { DataTablePlaceholder } from "../../../components/common/DataTablePlaceholder";
import { PageTitle } from "../../../components/common/PageTitle";
import { investmentApi } from "../services/investmentApi";

export const InvestmentListPage = (): ReactElement => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const { data = [] } = useQuery({
    queryKey: ["investments", "list"],
    queryFn: investmentApi.listInvestments
  });

  const accrualMutation = useMutation({
    mutationFn: (id: string) => investmentApi.postAccrual(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["investments", "list"] });
    }
  });

  const filtered = data.filter(
    (item) =>
      item.investmentCode.toLowerCase().includes(search.toLowerCase()) ||
      item.securityName.toLowerCase().includes(search.toLowerCase()) ||
      item.classification.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <PageTitle title="Investments" subtitle="Portfolio Register" />
        <button className="rounded-lg bg-brand-500 px-4 py-2 text-sm font-medium text-white" onClick={() => navigate("/investments/new")}>
          Add Investment
        </button>
      </div>
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-panel">
        <div className="flex flex-col gap-4 lg:flex-row">
          <input
            className="w-full rounded-xl border border-slate-200 px-4 py-3"
            placeholder="Search by code, security, or classification"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
          <button
            className="rounded-xl border border-slate-300 px-4 py-3 text-sm font-medium text-slate-700"
            onClick={() => {
              const target = filtered[0];
              if (target) {
                accrualMutation.mutate(target.id);
              }
            }}
          >
            Post Accrual For First Visible Row
          </button>
        </div>
      </div>
      <DataTablePlaceholder
        columns={["investmentCode", "securityName", "classification", "rating", "approvalState", "bookValue", "actions"]}
        rows={filtered.map((row) => ({
          investmentCode: row.investmentCode,
          securityName: row.securityName,
          classification: row.classification,
          rating: row.rating ?? "-",
          approvalState: row.approvalState,
          bookValue: row.bookValue.toFixed(2),
          actions: (
            <div className="flex items-center gap-2">
              <button
                className="rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-700"
                onClick={() => navigate(`/investments/${row.id}`)}
              >
                Edit
              </button>
              <button
                className="rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-700 disabled:cursor-not-allowed disabled:opacity-60"
                disabled={accrualMutation.isPending}
                onClick={() => accrualMutation.mutate(row.id)}
              >
                Accrual
              </button>
            </div>
          )
        }))}
      />
    </div>
  );
};
