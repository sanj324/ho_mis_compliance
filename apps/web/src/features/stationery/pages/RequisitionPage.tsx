import type { ReactElement } from "react";
import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";

import { PageTitle } from "../../../components/common/PageTitle";
import { branchApi } from "../../branches/services/branchApi";
import { stationeryApi } from "../services/stationeryApi";

export const RequisitionPage = (): ReactElement => {
  const [branchId, setBranchId] = useState("");
  const [vendorId, setVendorId] = useState("");
  const [requisitionDate, setRequisitionDate] = useState("");
  const [itemId, setItemId] = useState("");
  const [quantity, setQuantity] = useState("1");
  const { data: branches = [] } = useQuery({ queryKey: ["branches"], queryFn: branchApi.list });
  const { data: vendors = [] } = useQuery({ queryKey: ["stationery", "vendors"], queryFn: stationeryApi.listVendors });
  const { data: items = [] } = useQuery({ queryKey: ["stationery", "items"], queryFn: stationeryApi.listItems });

  const mutation = useMutation({
    mutationFn: () =>
      stationeryApi.createRequisition({
        branchId,
        vendorId: vendorId || undefined,
        requisitionDate,
        items: [{ itemId, quantity: Number(quantity) }]
      })
  });

  return (
    <div className="space-y-6">
      <PageTitle title="Requisition" subtitle="Branch Purchase Request" />
      <div className="grid gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-panel md:grid-cols-2 xl:grid-cols-5">
        <select className="rounded-xl border border-slate-200 px-4 py-3" value={branchId} onChange={(event) => setBranchId(event.target.value)}>
          <option value="">Select Branch</option>
          {branches.map((branch) => <option key={branch.id} value={branch.id}>{branch.name}</option>)}
        </select>
        <select className="rounded-xl border border-slate-200 px-4 py-3" value={vendorId} onChange={(event) => setVendorId(event.target.value)}>
          <option value="">Select Vendor</option>
          {vendors.map((vendor) => <option key={String(vendor.id)} value={String(vendor.id)}>{String(vendor.name)}</option>)}
        </select>
        <input className="rounded-xl border border-slate-200 px-4 py-3" type="date" value={requisitionDate} onChange={(event) => setRequisitionDate(event.target.value)} />
        <select className="rounded-xl border border-slate-200 px-4 py-3" value={itemId} onChange={(event) => setItemId(event.target.value)}>
          <option value="">Select Item</option>
          {items.map((item) => <option key={item.id} value={item.id}>{item.itemCode} - {item.itemName}</option>)}
        </select>
        <input className="rounded-xl border border-slate-200 px-4 py-3" type="number" value={quantity} onChange={(event) => setQuantity(event.target.value)} />
      </div>
      <button className="rounded-lg bg-brand-500 px-4 py-2 text-sm font-medium text-white" onClick={() => mutation.mutate()}>
        Create Requisition
      </button>
    </div>
  );
};
