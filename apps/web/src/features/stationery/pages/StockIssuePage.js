import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { PageTitle } from "../../../components/common/PageTitle";
import { branchApi } from "../../branches/services/branchApi";
import { stationeryApi } from "../services/stationeryApi";
export const StockIssuePage = () => {
    const [branchId, setBranchId] = useState("");
    const [issueDate, setIssueDate] = useState("");
    const [issueReason, setIssueReason] = useState("");
    const [itemId, setItemId] = useState("");
    const [quantity, setQuantity] = useState("1");
    const { data: branches = [] } = useQuery({ queryKey: ["branches"], queryFn: branchApi.list });
    const { data: items = [] } = useQuery({ queryKey: ["stationery", "items"], queryFn: stationeryApi.listItems });
    const mutation = useMutation({
        mutationFn: () => stationeryApi.createIssue({
            branchId,
            issueDate,
            issueReason,
            items: [{ itemId, quantity: Number(quantity) }]
        })
    });
    return (_jsxs("div", { className: "space-y-6", children: [_jsx(PageTitle, { title: "Stock Issue", subtitle: "Branch Consumption Entry" }), _jsxs("div", { className: "grid gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-panel md:grid-cols-2 xl:grid-cols-5", children: [_jsxs("select", { className: "rounded-xl border border-slate-200 px-4 py-3", value: branchId, onChange: (event) => setBranchId(event.target.value), children: [_jsx("option", { value: "", children: "Select Branch" }), branches.map((branch) => _jsx("option", { value: branch.id, children: branch.name }, branch.id))] }), _jsx("input", { className: "rounded-xl border border-slate-200 px-4 py-3", type: "date", value: issueDate, onChange: (event) => setIssueDate(event.target.value) }), _jsx("input", { className: "rounded-xl border border-slate-200 px-4 py-3", placeholder: "Issue Reason", value: issueReason, onChange: (event) => setIssueReason(event.target.value) }), _jsxs("select", { className: "rounded-xl border border-slate-200 px-4 py-3", value: itemId, onChange: (event) => setItemId(event.target.value), children: [_jsx("option", { value: "", children: "Select Item" }), items.map((item) => _jsxs("option", { value: item.id, children: [item.itemCode, " - ", item.itemName] }, item.id))] }), _jsx("input", { className: "rounded-xl border border-slate-200 px-4 py-3", type: "number", value: quantity, onChange: (event) => setQuantity(event.target.value) })] }), _jsx("button", { className: "rounded-lg bg-brand-500 px-4 py-2 text-sm font-medium text-white", onClick: () => mutation.mutate(), children: "Post Issue" })] }));
};
