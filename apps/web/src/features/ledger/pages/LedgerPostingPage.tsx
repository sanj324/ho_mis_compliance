import type { ChangeEvent, ReactElement } from "react";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";

import { PageTitle } from "../../../components/common/PageTitle";
import { ledgerApi } from "../services/ledgerApi";

export const LedgerPostingPage = (): ReactElement => {
  const [formState, setFormState] = useState({
    module: "payroll",
    referenceId: ""
  });

  const mutation = useMutation({
    mutationFn: async () => {
      switch (formState.module) {
        case "payroll":
          return ledgerApi.postPayroll(formState.referenceId);
        case "investment":
          return ledgerApi.postInvestment(formState.referenceId);
        case "asset":
          return ledgerApi.postAsset(formState.referenceId);
        case "stationery":
          return ledgerApi.postStationery(formState.referenceId);
        default:
          return ledgerApi.postShareCapital(formState.referenceId);
      }
    }
  });

  const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = event.target;
    setFormState((current) => ({ ...current, [name]: value }));
  };

  return (
    <div className="space-y-6">
      <PageTitle title="Ledger Posting" subtitle="Generic Posting Engine Trigger" />
      <div className="grid gap-4 rounded-2xl border border-slate-200 bg-white p-6 md:grid-cols-2">
        <select className="rounded-xl border border-slate-300 px-3 py-2" name="module" value={formState.module} onChange={handleChange}>
          <option value="payroll">Payroll</option>
          <option value="investment">Investment</option>
          <option value="asset">Asset</option>
          <option value="stationery">Stationery</option>
          <option value="share-capital">Share Capital</option>
        </select>
        <input className="rounded-xl border border-slate-300 px-3 py-2" name="referenceId" value={formState.referenceId} onChange={handleChange} placeholder="Reference id" />
      </div>
      <button className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white" onClick={() => mutation.mutate()} type="button">
        Post Voucher
      </button>
    </div>
  );
};
