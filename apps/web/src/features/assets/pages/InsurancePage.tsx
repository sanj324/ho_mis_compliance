import type { ReactElement } from "react";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { DataTablePlaceholder } from "../../../components/common/DataTablePlaceholder";
import { PageTitle } from "../../../components/common/PageTitle";
import { assetApi } from "../services/assetApi";

export const InsurancePage = (): ReactElement => {
  const queryClient = useQueryClient();
  const [assetId, setAssetId] = useState("");
  const [policyNo, setPolicyNo] = useState("");
  const [insurerName, setInsurerName] = useState("");
  const [startDate, setStartDate] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [insuredValue, setInsuredValue] = useState("");
  const { data: assets = [] } = useQuery({ queryKey: ["assets", "list"], queryFn: assetApi.listAssets });
  const { data = [] } = useQuery({ queryKey: ["assets", "insurances"], queryFn: assetApi.listInsurances });

  const mutation = useMutation({
    mutationFn: () =>
      assetApi.createInsurance({
        assetId,
        policyNo,
        insurerName,
        startDate,
        expiryDate,
        insuredValue: Number(insuredValue)
      }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["assets", "insurances"] });
    }
  });

  return (
    <div className="space-y-6">
      <PageTitle title="Insurance" subtitle="Asset Insurance Tracking" />
      <div className="grid gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-panel md:grid-cols-3 xl:grid-cols-6">
        <select className="rounded-xl border border-slate-200 px-4 py-3" value={assetId} onChange={(event) => setAssetId(event.target.value)}>
          <option value="">Select Asset</option>
          {assets.map((asset) => <option key={asset.id} value={asset.id}>{asset.assetCode}</option>)}
        </select>
        <input className="rounded-xl border border-slate-200 px-4 py-3" placeholder="Policy No" value={policyNo} onChange={(event) => setPolicyNo(event.target.value)} />
        <input className="rounded-xl border border-slate-200 px-4 py-3" placeholder="Insurer" value={insurerName} onChange={(event) => setInsurerName(event.target.value)} />
        <input className="rounded-xl border border-slate-200 px-4 py-3" type="date" value={startDate} onChange={(event) => setStartDate(event.target.value)} />
        <input className="rounded-xl border border-slate-200 px-4 py-3" type="date" value={expiryDate} onChange={(event) => setExpiryDate(event.target.value)} />
        <input className="rounded-xl border border-slate-200 px-4 py-3" type="number" placeholder="Insured Value" value={insuredValue} onChange={(event) => setInsuredValue(event.target.value)} />
      </div>
      <button className="rounded-xl bg-brand-500 px-4 py-3 text-sm font-medium text-white" onClick={() => mutation.mutate()}>
        Add Insurance
      </button>
      <DataTablePlaceholder
        columns={["policyNo", "insurerName", "expiryDate"]}
        rows={data.map((row) => ({
          policyNo: String(row.policyNo ?? ""),
          insurerName: String(row.insurerName ?? ""),
          expiryDate: String(row.expiryDate ?? "")
        }))}
      />
    </div>
  );
};
