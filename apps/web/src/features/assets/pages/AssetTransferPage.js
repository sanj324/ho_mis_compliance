import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { DataTablePlaceholder } from "../../../components/common/DataTablePlaceholder";
import { PageTitle } from "../../../components/common/PageTitle";
import { branchApi } from "../../branches/services/branchApi";
import { assetApi } from "../services/assetApi";
export const AssetTransferPage = () => {
    const queryClient = useQueryClient();
    const [assetId, setAssetId] = useState("");
    const [fromBranchId, setFromBranchId] = useState("");
    const [toBranchId, setToBranchId] = useState("");
    const [transferDate, setTransferDate] = useState("");
    const [reason, setReason] = useState("");
    const { data: assets = [] } = useQuery({ queryKey: ["assets", "list"], queryFn: assetApi.listAssets });
    const { data: branches = [] } = useQuery({ queryKey: ["branches"], queryFn: branchApi.list });
    const { data = [] } = useQuery({ queryKey: ["assets", "transfers"], queryFn: assetApi.listTransfers });
    const mutation = useMutation({
        mutationFn: () => assetApi.createTransfer({ assetId, fromBranchId, toBranchId, transferDate, reason }),
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ["assets", "transfers"] });
        }
    });
    return (_jsxs("div", { className: "space-y-6", children: [_jsx(PageTitle, { title: "Asset Transfers", subtitle: "Branch Movement History" }), _jsxs("div", { className: "grid gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-panel md:grid-cols-5", children: [_jsxs("select", { className: "rounded-xl border border-slate-200 px-4 py-3", value: assetId, onChange: (event) => setAssetId(event.target.value), children: [_jsx("option", { value: "", children: "Select Asset" }), assets.map((asset) => _jsx("option", { value: asset.id, children: asset.assetCode }, asset.id))] }), _jsxs("select", { className: "rounded-xl border border-slate-200 px-4 py-3", value: fromBranchId, onChange: (event) => setFromBranchId(event.target.value), children: [_jsx("option", { value: "", children: "From Branch" }), branches.map((branch) => _jsx("option", { value: branch.id, children: branch.name }, branch.id))] }), _jsxs("select", { className: "rounded-xl border border-slate-200 px-4 py-3", value: toBranchId, onChange: (event) => setToBranchId(event.target.value), children: [_jsx("option", { value: "", children: "To Branch" }), branches.map((branch) => _jsx("option", { value: branch.id, children: branch.name }, branch.id))] }), _jsx("input", { className: "rounded-xl border border-slate-200 px-4 py-3", type: "date", value: transferDate, onChange: (event) => setTransferDate(event.target.value) }), _jsx("input", { className: "rounded-xl border border-slate-200 px-4 py-3", placeholder: "Reason", value: reason, onChange: (event) => setReason(event.target.value) })] }), _jsx("button", { className: "rounded-xl bg-brand-500 px-4 py-3 text-sm font-medium text-white", onClick: () => mutation.mutate(), children: "Create Transfer" }), _jsx(DataTablePlaceholder, { columns: ["reason", "transferDate"], rows: data.map((row) => ({ reason: String(row.reason ?? ""), transferDate: String(row.transferDate ?? "") })) })] }));
};
