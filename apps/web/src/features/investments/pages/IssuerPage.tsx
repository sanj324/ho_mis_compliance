import type { ReactElement } from "react";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { DataTablePlaceholder } from "../../../components/common/DataTablePlaceholder";
import { PageTitle } from "../../../components/common/PageTitle";
import { investmentApi } from "../services/investmentApi";

export const IssuerPage = (): ReactElement => {
  const queryClient = useQueryClient();
  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [issuerType, setIssuerType] = useState("GENERAL");
  const { data = [] } = useQuery({
    queryKey: ["investments", "issuers"],
    queryFn: investmentApi.listIssuers
  });

  const mutation = useMutation({
    mutationFn: () => investmentApi.createIssuer({ code, name, issuerType }),
    onSuccess: async () => {
      setCode("");
      setName("");
      setIssuerType("GENERAL");
      await queryClient.invalidateQueries({ queryKey: ["investments", "issuers"] });
    }
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <PageTitle title="Issuers" subtitle="Investment Masters" />
        <button
          className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700"
          onClick={() => {
            setCode("");
            setName("");
            setIssuerType("GENERAL");
          }}
        >
          Reset Form
        </button>
      </div>
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-panel">
        <div className="grid gap-4 md:grid-cols-4">
          <input className="rounded-xl border border-slate-200 px-4 py-3" placeholder="Code" value={code} onChange={(event) => setCode(event.target.value)} />
          <input className="rounded-xl border border-slate-200 px-4 py-3" placeholder="Name" value={name} onChange={(event) => setName(event.target.value)} />
          <input className="rounded-xl border border-slate-200 px-4 py-3" placeholder="Issuer Type" value={issuerType} onChange={(event) => setIssuerType(event.target.value)} />
          <button className="rounded-xl bg-brand-500 px-4 py-3 text-sm font-medium text-white" onClick={() => mutation.mutate()}>
            Add Issuer
          </button>
        </div>
      </div>
      <DataTablePlaceholder
        columns={["code", "name", "activeStatus"]}
        rows={data.map((row) => ({
          code: row.code,
          name: row.name,
          activeStatus: row.activeStatus ? "Active" : "Inactive"
        }))}
      />
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-panel">
        <div className="space-y-3">
          {data.map((row) => (
            <div key={row.id} className="flex items-center justify-between rounded-xl border border-slate-200 px-4 py-3">
              <div>
                <p className="font-medium text-slate-900">{row.name}</p>
                <p className="text-sm text-slate-500">{row.code} | {row.activeStatus ? "Active" : "Inactive"}</p>
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
