import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { DataTablePlaceholder } from "../../../components/common/DataTablePlaceholder";
import { PageTitle } from "../../../components/common/PageTitle";
import { assetApi } from "../services/assetApi";
export const AssetListPage = () => {
    const navigate = useNavigate();
    const [search, setSearch] = useState("");
    const { data = [] } = useQuery({
        queryKey: ["assets", "list"],
        queryFn: assetApi.listAssets
    });
    const filtered = data.filter((item) => item.assetCode.toLowerCase().includes(search.toLowerCase()) ||
        item.assetName.toLowerCase().includes(search.toLowerCase()));
    return (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsx(PageTitle, { title: "Assets", subtitle: "Fixed Asset Register" }), _jsx("button", { className: "rounded-lg bg-brand-500 px-4 py-2 text-sm font-medium text-white", onClick: () => navigate("/assets/new"), children: "Add Asset" })] }), _jsx("div", { className: "rounded-2xl border border-slate-200 bg-white p-4 shadow-panel", children: _jsx("input", { className: "w-full rounded-xl border border-slate-200 px-4 py-3", placeholder: "Search by asset code or name", value: search, onChange: (event) => setSearch(event.target.value) }) }), _jsx(DataTablePlaceholder, { columns: ["assetCode", "assetName", "status", "originalCost", "netBookValue", "actions"], rows: filtered.map((row) => ({
                    assetCode: row.assetCode,
                    assetName: row.assetName,
                    status: row.currentStatus,
                    originalCost: row.originalCost.toFixed(2),
                    netBookValue: row.netBookValue.toFixed(2),
                    actions: _jsx("button", { className: "rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-700", onClick: () => navigate(`/assets/${row.id}`), children: "Edit" })
                })) })] }));
};
