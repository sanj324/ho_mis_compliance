import type { ReactElement } from "react";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { DataTablePlaceholder } from "../../../components/common/DataTablePlaceholder";
import { PageTitle } from "../../../components/common/PageTitle";
import { assetApi } from "../services/assetApi";

export const AssetCategoryPage = (): ReactElement => {
  const queryClient = useQueryClient();
  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [usefulLifeMonths, setUsefulLifeMonths] = useState("60");
  const { data = [] } = useQuery({ queryKey: ["assets", "categories"], queryFn: assetApi.listCategories });

  const mutation = useMutation({
    mutationFn: () => assetApi.createCategory({ code, name, usefulLifeMonths: Number(usefulLifeMonths) }),
    onSuccess: async () => {
      setCode("");
      setName("");
      await queryClient.invalidateQueries({ queryKey: ["assets", "categories"] });
    }
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <PageTitle title="Asset Categories" subtitle="Fixed Asset Masters" />
        <button
          className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700"
          onClick={() => {
            setCode("");
            setName("");
            setUsefulLifeMonths("60");
          }}
        >
          Reset Form
        </button>
      </div>
      <div className="grid gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-panel md:grid-cols-4">
        <input className="rounded-xl border border-slate-200 px-4 py-3" placeholder="Code" value={code} onChange={(event) => setCode(event.target.value)} />
        <input className="rounded-xl border border-slate-200 px-4 py-3" placeholder="Name" value={name} onChange={(event) => setName(event.target.value)} />
        <input className="rounded-xl border border-slate-200 px-4 py-3" type="number" placeholder="Useful Life Months" value={usefulLifeMonths} onChange={(event) => setUsefulLifeMonths(event.target.value)} />
        <button className="rounded-xl bg-brand-500 px-4 py-3 text-sm font-medium text-white" onClick={() => mutation.mutate()}>
          Add Category
        </button>
      </div>
      <DataTablePlaceholder columns={["code", "name"]} rows={data.map((row) => ({ code: row.code, name: row.name }))} />
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-panel">
        <div className="space-y-3">
          {data.map((row) => (
            <div key={row.id} className="flex items-center justify-between rounded-xl border border-slate-200 px-4 py-3">
              <div>
                <p className="font-medium text-slate-900">{row.name}</p>
                <p className="text-sm text-slate-500">{row.code}</p>
              </div>
              <button
                className="rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-700"
                onClick={() => {
                  setCode("");
                  setName(row.name);
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
