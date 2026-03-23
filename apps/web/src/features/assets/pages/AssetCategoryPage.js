import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { DataTablePlaceholder } from "../../../components/common/DataTablePlaceholder";
import { PageTitle } from "../../../components/common/PageTitle";
import { assetApi } from "../services/assetApi";
export const AssetCategoryPage = () => {
    const queryClient = useQueryClient();
    const [code, setCode] = useState("");
    const [name, setName] = useState("");
    const [usefulLifeMonths, setUsefulLifeMonths] = useState("60");
    const { data = [] } = useQuery({ queryKey: ["assets", "categories"], queryFn: assetApi.listCategories });
    const mutation = useMutation({
        mutationFn: () => assetApi.createCategory({ code, name, usefulLifeMonths: Number(usefulLifeMonths) }),
        onSuccess: async () => {
            setCode("");
            setName("");
            await queryClient.invalidateQueries({ queryKey: ["assets", "categories"] });
        }
    });
    return (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsx(PageTitle, { title: "Asset Categories", subtitle: "Fixed Asset Masters" }), _jsx("button", { className: "rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700", onClick: () => { setCode(""); setName(""); setUsefulLifeMonths("60"); }, children: "Reset Form" })] }), _jsxs("div", { className: "grid gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-panel md:grid-cols-4", children: [_jsx("input", { className: "rounded-xl border border-slate-200 px-4 py-3", placeholder: "Code", value: code, onChange: (event) => setCode(event.target.value) }), _jsx("input", { className: "rounded-xl border border-slate-200 px-4 py-3", placeholder: "Name", value: name, onChange: (event) => setName(event.target.value) }), _jsx("input", { className: "rounded-xl border border-slate-200 px-4 py-3", type: "number", placeholder: "Useful Life Months", value: usefulLifeMonths, onChange: (event) => setUsefulLifeMonths(event.target.value) }), _jsx("button", { className: "rounded-xl bg-brand-500 px-4 py-3 text-sm font-medium text-white", onClick: () => mutation.mutate(), children: "Add Category" })] }), _jsx(DataTablePlaceholder, { columns: ["code", "name", "actions"], rows: data.map((row) => ({ code: row.code, name: row.name, actions: _jsx("button", { className: "rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-700", onClick: () => { setCode(""); setName(row.name); }, children: "Use As Template" }) })) })] }));
};
