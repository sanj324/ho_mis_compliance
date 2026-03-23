import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { PageTitle } from "../../../components/common/PageTitle";
import { branchApi } from "../../branches/services/branchApi";
import { stationeryApi } from "../services/stationeryApi";
export const RequisitionPage = () => {
    const [branchId, setBranchId] = useState("");
    const [vendorId, setVendorId] = useState("");
    const [requisitionDate, setRequisitionDate] = useState("");
    const [itemId, setItemId] = useState("");
    const [quantity, setQuantity] = useState("1");
    const { data: branches = [] } = useQuery({ queryKey: ["branches"], queryFn: branchApi.list });
    const { data: vendors = [] } = useQuery({ queryKey: ["stationery", "vendors"], queryFn: stationeryApi.listVendors });
    const { data: items = [] } = useQuery({ queryKey: ["stationery", "items"], queryFn: stationeryApi.listItems });
    const mutation = useMutation({
        mutationFn: () => stationeryApi.createRequisition({
            branchId,
            vendorId: vendorId || undefined,
            requisitionDate,
            items: [{ itemId, quantity: Number(quantity) }]
        })
    });
    return (_jsxs("div", { className: "space-y-6", children: [_jsx(PageTitle, { title: "Requisition", subtitle: "Branch Purchase Request" }), _jsxs("div", { className: "grid gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-panel md:grid-cols-2 xl:grid-cols-5", children: [_jsxs("select", { className: "rounded-xl border border-slate-200 px-4 py-3", value: branchId, onChange: (event) => setBranchId(event.target.value), children: [_jsx("option", { value: "", children: "Select Branch" }), branches.map((branch) => _jsx("option", { value: branch.id, children: branch.name }, branch.id))] }), _jsxs("select", { className: "rounded-xl border border-slate-200 px-4 py-3", value: vendorId, onChange: (event) => setVendorId(event.target.value), children: [_jsx("option", { value: "", children: "Select Vendor" }), vendors.map((vendor) => _jsx("option", { value: String(vendor.id), children: String(vendor.name) }, String(vendor.id)))] }), _jsx("input", { className: "rounded-xl border border-slate-200 px-4 py-3", type: "date", value: requisitionDate, onChange: (event) => setRequisitionDate(event.target.value) }), _jsxs("select", { className: "rounded-xl border border-slate-200 px-4 py-3", value: itemId, onChange: (event) => setItemId(event.target.value), children: [_jsx("option", { value: "", children: "Select Item" }), items.map((item) => _jsxs("option", { value: item.id, children: [item.itemCode, " - ", item.itemName] }, item.id))] }), _jsx("input", { className: "rounded-xl border border-slate-200 px-4 py-3", type: "number", value: quantity, onChange: (event) => setQuantity(event.target.value) })] }), _jsx("button", { className: "rounded-lg bg-brand-500 px-4 py-2 text-sm font-medium text-white", onClick: () => mutation.mutate(), children: "Create Requisition" })] }));
};
