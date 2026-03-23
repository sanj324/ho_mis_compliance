import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { DataTablePlaceholder } from "../../../components/common/DataTablePlaceholder";
import { PageTitle } from "../../../components/common/PageTitle";
import { stationeryApi } from "../services/stationeryApi";
export const VendorPage = () => {
    const queryClient = useQueryClient();
    const [code, setCode] = useState("");
    const [name, setName] = useState("");
    const [gstNo, setGstNo] = useState("");
    const { data = [] } = useQuery({ queryKey: ["stationery", "vendors"], queryFn: stationeryApi.listVendors });
    const mutation = useMutation({
        mutationFn: () => stationeryApi.createVendor({ code, name, gstNo }),
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ["stationery", "vendors"] });
            setCode("");
            setName("");
            setGstNo("");
        }
    });
    return (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsx(PageTitle, { title: "Vendors", subtitle: "Inventory Vendor Master" }), _jsx("button", { className: "rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700", onClick: () => { setCode(""); setName(""); setGstNo(""); }, children: "Reset Form" })] }), _jsxs("div", { className: "grid gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-panel md:grid-cols-4", children: [_jsx("input", { className: "rounded-xl border border-slate-200 px-4 py-3", placeholder: "Code", value: code, onChange: (event) => setCode(event.target.value) }), _jsx("input", { className: "rounded-xl border border-slate-200 px-4 py-3", placeholder: "Name", value: name, onChange: (event) => setName(event.target.value) }), _jsx("input", { className: "rounded-xl border border-slate-200 px-4 py-3", placeholder: "GST No", value: gstNo, onChange: (event) => setGstNo(event.target.value) }), _jsx("button", { className: "rounded-xl bg-brand-500 px-4 py-3 text-sm font-medium text-white", onClick: () => mutation.mutate(), children: "Add Vendor" })] }), _jsx(DataTablePlaceholder, { columns: ["code", "name", "gstNo", "actions"], rows: data.map((row) => ({ code: String(row.code ?? ""), name: String(row.name ?? ""), gstNo: String(row.gstNo ?? ""), actions: _jsx("button", { className: "rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-700", onClick: () => { setCode(""); setName(String(row.name ?? "")); setGstNo(String(row.gstNo ?? "")); }, children: "Use As Template" }) })) })] }));
};
