import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { DataTablePlaceholder } from "../../../components/common/DataTablePlaceholder";
import { PageTitle } from "../../../components/common/PageTitle";
import { shareCapitalApi } from "../services/shareCapitalApi";
export const DividendPage = () => {
    const [formState, setFormState] = useState({
        shareClassId: "",
        declarationDate: "",
        dividendRate: "",
        remarks: ""
    });
    const { data: shareClasses } = useQuery({ queryKey: ["share-capital", "share-classes"], queryFn: shareCapitalApi.listShareClasses });
    const { data: declarations, refetch } = useQuery({ queryKey: ["share-capital", "dividends"], queryFn: shareCapitalApi.listDividends });
    const mutation = useMutation({
        mutationFn: () => shareCapitalApi.declareDividend({
            ...formState,
            dividendRate: Number(formState.dividendRate),
            declarationDate: new Date(formState.declarationDate).toISOString()
        }),
        onSuccess: () => {
            setFormState({ shareClassId: "", declarationDate: "", dividendRate: "", remarks: "" });
            void refetch();
        }
    });
    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormState((current) => ({ ...current, [name]: value }));
    };
    return (_jsxs("div", { className: "space-y-6", children: [_jsx(PageTitle, { title: "Dividend Declaration", subtitle: "Declare and Review Member Dividend" }), _jsxs("div", { className: "grid gap-4 rounded-2xl border border-slate-200 bg-white p-6 md:grid-cols-2", children: [_jsxs("select", { className: "rounded-xl border border-slate-300 px-3 py-2", name: "shareClassId", value: formState.shareClassId, onChange: handleChange, children: [_jsx("option", { value: "", children: "Share class" }), (shareClasses ?? []).map((shareClass) => (_jsx("option", { value: shareClass.id, children: shareClass.name }, shareClass.id)))] }), _jsx("input", { className: "rounded-xl border border-slate-300 px-3 py-2", name: "declarationDate", type: "date", value: formState.declarationDate, onChange: handleChange }), _jsx("input", { className: "rounded-xl border border-slate-300 px-3 py-2", name: "dividendRate", placeholder: "Dividend rate %", value: formState.dividendRate, onChange: handleChange }), _jsx("input", { className: "rounded-xl border border-slate-300 px-3 py-2", name: "remarks", placeholder: "Remarks", value: formState.remarks, onChange: handleChange })] }), _jsx("button", { className: "rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white", onClick: () => mutation.mutate(), type: "button", children: "Declare Dividend" }), _jsx(DataTablePlaceholder, { columns: ["Declaration Date", "Rate", "Status"], rows: (declarations ?? []).map((item) => ({
                    "Declaration Date": new Date(item.declarationDate).toLocaleDateString(),
                    Rate: String(item.dividendRate),
                    Status: item.approvalState
                })) })] }));
};
