import type { ReactElement } from "react";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { DataTablePlaceholder } from "../../../components/common/DataTablePlaceholder";
import { PageTitle } from "../../../components/common/PageTitle";
import { branchApi } from "../../branches/services/branchApi";
import { stationeryApi } from "../services/stationeryApi";

export const StockTransferPage = (): ReactElement => {
  const queryClient = useQueryClient();
  const [itemId, setItemId] = useState("");
  const [fromBranchId, setFromBranchId] = useState("");
  const [toBranchId, setToBranchId] = useState("");
  const [quantity, setQuantity] = useState("1");
  const [transferDate, setTransferDate] = useState("");
  const { data: items = [] } = useQuery({ queryKey: ["stationery", "items"], queryFn: stationeryApi.listItems });
  const { data: branches = [] } = useQuery({ queryKey: ["branches"], queryFn: branchApi.list });
  const { data: transfers = [] } = useQuery({ queryKey: ["stationery", "transfers"], queryFn: stationeryApi.listTransfers });

  const mutation = useMutation({
    mutationFn: () => stationeryApi.createTransfer({ itemId, fromBranchId, toBranchId, quantity: Number(quantity), transferDate }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["stationery", "transfers"] });
    }
  });

  return (
    <div className="space-y-6">
      <PageTitle title="Stock Transfer" subtitle="Branch to Branch Transfer" />
      <div className="grid gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-panel md:grid-cols-2 xl:grid-cols-5">
        <select className="rounded-xl border border-slate-200 px-4 py-3" value={itemId} onChange={(event) => setItemId(event.target.value)}>
          <option value="">Select Item</option>
          {items.map((item) => <option key={item.id} value={item.id}>{item.itemCode}</option>)}
        </select>
        <select className="rounded-xl border border-slate-200 px-4 py-3" value={fromBranchId} onChange={(event) => setFromBranchId(event.target.value)}>
          <option value="">From Branch</option>
          {branches.map((branch) => <option key={branch.id} value={branch.id}>{branch.name}</option>)}
        </select>
        <select className="rounded-xl border border-slate-200 px-4 py-3" value={toBranchId} onChange={(event) => setToBranchId(event.target.value)}>
          <option value="">To Branch</option>
          {branches.map((branch) => <option key={branch.id} value={branch.id}>{branch.name}</option>)}
        </select>
        <input className="rounded-xl border border-slate-200 px-4 py-3" type="number" value={quantity} onChange={(event) => setQuantity(event.target.value)} />
        <input className="rounded-xl border border-slate-200 px-4 py-3" type="date" value={transferDate} onChange={(event) => setTransferDate(event.target.value)} />
      </div>
      <button className="rounded-lg bg-brand-500 px-4 py-2 text-sm font-medium text-white" onClick={() => mutation.mutate()}>
        Create Transfer
      </button>
      <DataTablePlaceholder columns={["transferNo", "quantity", "transferDate"]} rows={transfers.map((row) => ({ transferNo: String(row.transferNo ?? ""), quantity: String(row.quantity ?? ""), transferDate: String(row.transferDate ?? "") }))} />
    </div>
  );
};
