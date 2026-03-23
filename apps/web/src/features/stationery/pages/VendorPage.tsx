import type { ReactElement } from "react";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { DataTablePlaceholder } from "../../../components/common/DataTablePlaceholder";
import { PageTitle } from "../../../components/common/PageTitle";
import { stationeryApi } from "../services/stationeryApi";

export const VendorPage = (): ReactElement => {
  const queryClient = useQueryClient();
  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [gstNo, setGstNo] = useState("");
  const { data = [] } = useQuery({ queryKey: ["stationery", "vendors"], queryFn: stationeryApi.listVendors });

  const mutation = useMutation({
    mutationFn: () => stationeryApi.createVendor({ code, name, gstNo }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["stationery", "vendors"] });
      setCode("");
      setName("");
      setGstNo("");
    }
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <PageTitle title="Vendors" subtitle="Inventory Vendor Master" />
        <button
          className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700"
          onClick={() => {
            setCode("");
            setName("");
            setGstNo("");
          }}
        >
          Reset Form
        </button>
      </div>
      <div className="grid gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-panel md:grid-cols-4">
        <input className="rounded-xl border border-slate-200 px-4 py-3" placeholder="Code" value={code} onChange={(event) => setCode(event.target.value)} />
        <input className="rounded-xl border border-slate-200 px-4 py-3" placeholder="Name" value={name} onChange={(event) => setName(event.target.value)} />
        <input className="rounded-xl border border-slate-200 px-4 py-3" placeholder="GST No" value={gstNo} onChange={(event) => setGstNo(event.target.value)} />
        <button className="rounded-xl bg-brand-500 px-4 py-3 text-sm font-medium text-white" onClick={() => mutation.mutate()}>
          Add Vendor
        </button>
      </div>
      <DataTablePlaceholder columns={["code", "name", "gstNo"]} rows={data.map((row) => ({ code: String(row.code ?? ""), name: String(row.name ?? ""), gstNo: String(row.gstNo ?? "") }))} />
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-panel">
        <div className="space-y-3">
          {data.map((row, index) => (
            <div key={`${String(row.code ?? "")}-${index}`} className="flex items-center justify-between rounded-xl border border-slate-200 px-4 py-3">
              <div>
                <p className="font-medium text-slate-900">{String(row.name ?? "")}</p>
                <p className="text-sm text-slate-500">{String(row.code ?? "")} | GST {String(row.gstNo ?? "-")}</p>
              </div>
              <button
                className="rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-700"
                onClick={() => {
                  setCode("");
                  setName(String(row.name ?? ""));
                  setGstNo(String(row.gstNo ?? ""));
                }}
              >
                Use As Template
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
