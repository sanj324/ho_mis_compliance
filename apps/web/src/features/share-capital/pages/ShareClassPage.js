import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { DataTablePlaceholder } from "../../../components/common/DataTablePlaceholder";
import { PageTitle } from "../../../components/common/PageTitle";
import { shareCapitalApi } from "../services/shareCapitalApi";
export const ShareClassPage = () => {
    const [formState, setFormState] = useState({
        code: "",
        name: "",
        faceValue: "",
        dividendRate: ""
    });
    const { data, refetch } = useQuery({
        queryKey: ["share-capital", "share-classes"],
        queryFn: shareCapitalApi.listShareClasses
    });
    const mutation = useMutation({
        mutationFn: () => shareCapitalApi.createShareClass({
            code: formState.code,
            name: formState.name,
            faceValue: Number(formState.faceValue),
            dividendRate: formState.dividendRate ? Number(formState.dividendRate) : undefined
        }),
        onSuccess: () => {
            setFormState({ code: "", name: "", faceValue: "", dividendRate: "" });
            void refetch();
        }
    });
    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormState((current) => ({ ...current, [name]: value }));
    };
    return (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsx(PageTitle, { title: "Share Classes", subtitle: "Share Instrument Master" }), _jsx("button", { className: "rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700", onClick: () => setFormState({ code: "", name: "", faceValue: "", dividendRate: "" }), type: "button", children: "Reset Form" })] }), _jsxs("div", { className: "grid gap-4 rounded-2xl border border-slate-200 bg-white p-6 md:grid-cols-4", children: [_jsx("input", { className: "rounded-xl border border-slate-300 px-3 py-2", name: "code", placeholder: "Code", value: formState.code, onChange: handleChange }), _jsx("input", { className: "rounded-xl border border-slate-300 px-3 py-2", name: "name", placeholder: "Name", value: formState.name, onChange: handleChange }), _jsx("input", { className: "rounded-xl border border-slate-300 px-3 py-2", name: "faceValue", placeholder: "Face value", value: formState.faceValue, onChange: handleChange }), _jsx("input", { className: "rounded-xl border border-slate-300 px-3 py-2", name: "dividendRate", placeholder: "Dividend rate", value: formState.dividendRate, onChange: handleChange }), _jsx("button", { className: "rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white md:col-span-4", onClick: () => mutation.mutate(), type: "button", children: "Add Share Class" })] }), _jsx(DataTablePlaceholder, { columns: ["Code", "Name", "Face Value", "Dividend Rate", "Status", "Actions"], rows: (data ?? []).map((item) => ({
                    Code: item.code,
                    Name: item.name,
                    "Face Value": String(item.faceValue),
                    "Dividend Rate": String(item.dividendRate ?? "-"),
                    Status: item.isActive ? "ACTIVE" : "INACTIVE",
                    Actions: _jsx("button", { className: "rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-700", onClick: () => setFormState({ code: "", name: item.name, faceValue: String(item.faceValue), dividendRate: item.dividendRate === null ? "" : String(item.dividendRate) }), type: "button", children: "Use As Template" })
                })) })] }));
};
