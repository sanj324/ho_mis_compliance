import type { ChangeEvent, ReactElement } from "react";
import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";

import { DataTablePlaceholder } from "../../../components/common/DataTablePlaceholder";
import { PageTitle } from "../../../components/common/PageTitle";
import { shareCapitalApi } from "../services/shareCapitalApi";

export const DividendPage = (): ReactElement => {
  const [formState, setFormState] = useState({
    shareClassId: "",
    declarationDate: "",
    dividendRate: "",
    remarks: ""
  });
  const { data: shareClasses } = useQuery({ queryKey: ["share-capital", "share-classes"], queryFn: shareCapitalApi.listShareClasses });
  const { data: declarations, refetch } = useQuery({ queryKey: ["share-capital", "dividends"], queryFn: shareCapitalApi.listDividends });

  const mutation = useMutation({
    mutationFn: () =>
      shareCapitalApi.declareDividend({
        ...formState,
        dividendRate: Number(formState.dividendRate),
        declarationDate: new Date(formState.declarationDate).toISOString()
      }),
    onSuccess: () => {
      setFormState({ shareClassId: "", declarationDate: "", dividendRate: "", remarks: "" });
      void refetch();
    }
  });

  const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = event.target;
    setFormState((current) => ({ ...current, [name]: value }));
  };

  return (
    <div className="space-y-6">
      <PageTitle title="Dividend Declaration" subtitle="Declare and Review Member Dividend" />
      <div className="grid gap-4 rounded-2xl border border-slate-200 bg-white p-6 md:grid-cols-2">
        <select className="rounded-xl border border-slate-300 px-3 py-2" name="shareClassId" value={formState.shareClassId} onChange={handleChange}>
          <option value="">Share class</option>
          {(shareClasses ?? []).map((shareClass) => (
            <option key={shareClass.id} value={shareClass.id}>{shareClass.name}</option>
          ))}
        </select>
        <input className="rounded-xl border border-slate-300 px-3 py-2" name="declarationDate" type="date" value={formState.declarationDate} onChange={handleChange} />
        <input className="rounded-xl border border-slate-300 px-3 py-2" name="dividendRate" placeholder="Dividend rate %" value={formState.dividendRate} onChange={handleChange} />
        <input className="rounded-xl border border-slate-300 px-3 py-2" name="remarks" placeholder="Remarks" value={formState.remarks} onChange={handleChange} />
      </div>
      <button className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white" onClick={() => mutation.mutate()} type="button">
        Declare Dividend
      </button>
      <DataTablePlaceholder
        columns={["Declaration Date", "Rate", "Status"]}
        rows={(declarations ?? []).map((item) => ({
          "Declaration Date": new Date(item.declarationDate).toLocaleDateString(),
          Rate: String(item.dividendRate),
          Status: item.approvalState
        }))}
      />
    </div>
  );
};
