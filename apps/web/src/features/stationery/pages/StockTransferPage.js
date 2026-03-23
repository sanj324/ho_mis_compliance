import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { DataTablePlaceholder } from "../../../components/common/DataTablePlaceholder";
import { PageTitle } from "../../../components/common/PageTitle";
import { branchApi } from "../../branches/services/branchApi";
import { stationeryApi } from "../services/stationeryApi";
export const StockTransferPage = () => {
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
    return (_jsxs("div", { className: "space-y-6", children: [_jsx(PageTitle, { title: "Stock Transfer", subtitle: "Branch to Branch Transfer" }), _jsxs("div", { className: "grid gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-panel md:grid-cols-2 xl:grid-cols-5", children: [_jsxs("select", { className: "rounded-xl border border-slate-200 px-4 py-3", value: itemId, onChange: (event) => setItemId(event.target.value), children: [_jsx("option", { value: "", children: "Select Item" }), items.map((item) => _jsx("option", { value: item.id, children: item.itemCode }, item.id))] }), _jsxs("select", { className: "rounded-xl border border-slate-200 px-4 py-3", value: fromBranchId, onChange: (event) => setFromBranchId(event.target.value), children: [_jsx("option", { value: "", children: "From Branch" }), branches.map((branch) => _jsx("option", { value: branch.id, children: branch.name }, branch.id))] }), _jsxs("select", { className: "rounded-xl border border-slate-200 px-4 py-3", value: toBranchId, onChange: (event) => setToBranchId(event.target.value), children: [_jsx("option", { value: "", children: "To Branch" }), branches.map((branch) => _jsx("option", { value: branch.id, children: branch.name }, branch.id))] }), _jsx("input", { className: "rounded-xl border border-slate-200 px-4 py-3", type: "number", value: quantity, onChange: (event) => setQuantity(event.target.value) }), _jsx("input", { className: "rounded-xl border border-slate-200 px-4 py-3", type: "date", value: transferDate, onChange: (event) => setTransferDate(event.target.value) })] }), _jsx("button", { className: "rounded-lg bg-brand-500 px-4 py-2 text-sm font-medium text-white", onClick: () => mutation.mutate(), children: "Create Transfer" }), _jsx(DataTablePlaceholder, { columns: ["transferNo", "quantity", "transferDate"], rows: transfers.map((row) => ({ transferNo: String(row.transferNo ?? ""), quantity: String(row.quantity ?? ""), transferDate: String(row.transferDate ?? "") })) })] }));
};
