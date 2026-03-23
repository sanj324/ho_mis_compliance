import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { DataTablePlaceholder } from "../../../components/common/DataTablePlaceholder";
import { PageTitle } from "../../../components/common/PageTitle";
import { assetApi } from "../services/assetApi";
export const DepreciationRunPage = () => {
    const [month, setMonth] = useState("3");
    const [year, setYear] = useState("2026");
    const mutation = useMutation({
        mutationFn: () => assetApi.runDepreciation({ month: Number(month), year: Number(year) })
    });
    return (_jsxs("div", { className: "space-y-6", children: [_jsx(PageTitle, { title: "Depreciation Run", subtitle: "Monthly Asset Depreciation" }), _jsxs("div", { className: "grid gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-panel md:grid-cols-3", children: [_jsx("input", { className: "rounded-xl border border-slate-200 px-4 py-3", type: "number", value: month, onChange: (event) => setMonth(event.target.value) }), _jsx("input", { className: "rounded-xl border border-slate-200 px-4 py-3", type: "number", value: year, onChange: (event) => setYear(event.target.value) }), _jsx("button", { className: "rounded-xl bg-brand-500 px-4 py-3 text-sm font-medium text-white", onClick: () => mutation.mutate(), children: "Run Depreciation" })] }), _jsx(DataTablePlaceholder, { columns: ["assetId", "runMonth", "runYear", "depreciationAmount"], rows: (mutation.data ?? []).map((row) => ({
                    assetId: String(row.assetId ?? ""),
                    runMonth: String(row.runMonth ?? ""),
                    runYear: String(row.runYear ?? ""),
                    depreciationAmount: String(row.depreciationAmount ?? "")
                })) })] }));
};
