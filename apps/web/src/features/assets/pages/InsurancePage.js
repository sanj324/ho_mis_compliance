import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { DataTablePlaceholder } from "../../../components/common/DataTablePlaceholder";
import { PageTitle } from "../../../components/common/PageTitle";
import { assetApi } from "../services/assetApi";
export const InsurancePage = () => {
    const queryClient = useQueryClient();
    const [assetId, setAssetId] = useState("");
    const [policyNo, setPolicyNo] = useState("");
    const [insurerName, setInsurerName] = useState("");
    const [startDate, setStartDate] = useState("");
    const [expiryDate, setExpiryDate] = useState("");
    const [insuredValue, setInsuredValue] = useState("");
    const { data: assets = [] } = useQuery({ queryKey: ["assets", "list"], queryFn: assetApi.listAssets });
    const { data = [] } = useQuery({ queryKey: ["assets", "insurances"], queryFn: assetApi.listInsurances });
    const mutation = useMutation({
        mutationFn: () => assetApi.createInsurance({
            assetId,
            policyNo,
            insurerName,
            startDate,
            expiryDate,
            insuredValue: Number(insuredValue)
        }),
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ["assets", "insurances"] });
        }
    });
    return (_jsxs("div", { className: "space-y-6", children: [_jsx(PageTitle, { title: "Insurance", subtitle: "Asset Insurance Tracking" }), _jsxs("div", { className: "grid gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-panel md:grid-cols-3 xl:grid-cols-6", children: [_jsxs("select", { className: "rounded-xl border border-slate-200 px-4 py-3", value: assetId, onChange: (event) => setAssetId(event.target.value), children: [_jsx("option", { value: "", children: "Select Asset" }), assets.map((asset) => _jsx("option", { value: asset.id, children: asset.assetCode }, asset.id))] }), _jsx("input", { className: "rounded-xl border border-slate-200 px-4 py-3", placeholder: "Policy No", value: policyNo, onChange: (event) => setPolicyNo(event.target.value) }), _jsx("input", { className: "rounded-xl border border-slate-200 px-4 py-3", placeholder: "Insurer", value: insurerName, onChange: (event) => setInsurerName(event.target.value) }), _jsx("input", { className: "rounded-xl border border-slate-200 px-4 py-3", type: "date", value: startDate, onChange: (event) => setStartDate(event.target.value) }), _jsx("input", { className: "rounded-xl border border-slate-200 px-4 py-3", type: "date", value: expiryDate, onChange: (event) => setExpiryDate(event.target.value) }), _jsx("input", { className: "rounded-xl border border-slate-200 px-4 py-3", type: "number", placeholder: "Insured Value", value: insuredValue, onChange: (event) => setInsuredValue(event.target.value) })] }), _jsx("button", { className: "rounded-xl bg-brand-500 px-4 py-3 text-sm font-medium text-white", onClick: () => mutation.mutate(), children: "Add Insurance" }), _jsx(DataTablePlaceholder, { columns: ["policyNo", "insurerName", "expiryDate"], rows: data.map((row) => ({
                    policyNo: String(row.policyNo ?? ""),
                    insurerName: String(row.insurerName ?? ""),
                    expiryDate: String(row.expiryDate ?? "")
                })) })] }));
};
