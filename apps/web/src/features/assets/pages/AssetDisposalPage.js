import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { DataTablePlaceholder } from "../../../components/common/DataTablePlaceholder";
import { PageTitle } from "../../../components/common/PageTitle";
import { assetApi } from "../services/assetApi";
export const AssetDisposalPage = () => {
    const queryClient = useQueryClient();
    const [assetId, setAssetId] = useState("");
    const [disposalDate, setDisposalDate] = useState("");
    const [disposalValue, setDisposalValue] = useState("");
    const [reason, setReason] = useState("");
    const { data: assets = [] } = useQuery({ queryKey: ["assets", "list"], queryFn: assetApi.listAssets });
    const { data = [] } = useQuery({ queryKey: ["assets", "disposals"], queryFn: assetApi.listDisposals });
    const mutation = useMutation({
        mutationFn: () => assetApi.createDisposal({ assetId, disposalDate, disposalValue: Number(disposalValue), reason }),
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ["assets", "disposals"] });
        }
    });
    return (_jsxs("div", { className: "space-y-6", children: [_jsx(PageTitle, { title: "Asset Disposal", subtitle: "Disposal Gain or Loss Tracking" }), _jsxs("div", { className: "grid gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-panel md:grid-cols-4", children: [_jsxs("select", { className: "rounded-xl border border-slate-200 px-4 py-3", value: assetId, onChange: (event) => setAssetId(event.target.value), children: [_jsx("option", { value: "", children: "Select Asset" }), assets.map((asset) => _jsx("option", { value: asset.id, children: asset.assetCode }, asset.id))] }), _jsx("input", { className: "rounded-xl border border-slate-200 px-4 py-3", type: "date", value: disposalDate, onChange: (event) => setDisposalDate(event.target.value) }), _jsx("input", { className: "rounded-xl border border-slate-200 px-4 py-3", type: "number", placeholder: "Disposal Value", value: disposalValue, onChange: (event) => setDisposalValue(event.target.value) }), _jsx("input", { className: "rounded-xl border border-slate-200 px-4 py-3", placeholder: "Reason", value: reason, onChange: (event) => setReason(event.target.value) })] }), _jsx("button", { className: "rounded-xl bg-brand-500 px-4 py-3 text-sm font-medium text-white", onClick: () => mutation.mutate(), children: "Record Disposal" }), _jsx(DataTablePlaceholder, { columns: ["disposalDate", "disposalValue", "gainLossAmount"], rows: data.map((row) => ({ disposalDate: String(row.disposalDate ?? ""), disposalValue: String(row.disposalValue ?? ""), gainLossAmount: String(row.gainLossAmount ?? "") })) })] }));
};
