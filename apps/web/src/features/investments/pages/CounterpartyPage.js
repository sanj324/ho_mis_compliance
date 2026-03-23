import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { DataTablePlaceholder } from "../../../components/common/DataTablePlaceholder";
import { PageTitle } from "../../../components/common/PageTitle";
import { investmentApi } from "../services/investmentApi";
export const CounterpartyPage = () => {
    const queryClient = useQueryClient();
    const [code, setCode] = useState("");
    const [name, setName] = useState("");
    const trimmedCode = code.trim();
    const trimmedName = name.trim();
    const canSubmit = trimmedCode.length >= 2 && trimmedName.length >= 3;
    const { data = [] } = useQuery({
        queryKey: ["investments", "counterparties"],
        queryFn: investmentApi.listCounterparties
    });
    const mutation = useMutation({
        mutationFn: () => investmentApi.createCounterparty({ code: trimmedCode, name: trimmedName }),
        onSuccess: async () => {
            setCode("");
            setName("");
            await queryClient.invalidateQueries({ queryKey: ["investments", "counterparties"] });
        }
    });
    return (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsx(PageTitle, { title: "Counterparties", subtitle: "Investment Masters" }), _jsx("button", { className: "rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700", onClick: () => { setCode(""); setName(""); }, children: "Reset Form" })] }), _jsxs("div", { className: "rounded-2xl border border-slate-200 bg-white p-4 shadow-panel", children: [_jsxs("div", { className: "grid gap-4 md:grid-cols-3", children: [_jsx("input", { className: "rounded-xl border border-slate-200 px-4 py-3", placeholder: "Code", value: code, onChange: (event) => setCode(event.target.value) }), _jsx("input", { className: "rounded-xl border border-slate-200 px-4 py-3", placeholder: "Name", value: name, onChange: (event) => setName(event.target.value) }), _jsx("button", { className: "rounded-xl bg-brand-500 px-4 py-3 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-50", disabled: !canSubmit || mutation.isPending, onClick: () => mutation.mutate(), children: "Add Counterparty" })] }), _jsx("p", { className: "mt-3 text-sm text-slate-600", children: "Enter at least 2 characters for code and 3 for name before adding a counterparty." })] }), _jsx(DataTablePlaceholder, { columns: ["code", "name", "activeStatus", "actions"], rows: data.map((row) => ({
                    code: row.code,
                    name: row.name,
                    activeStatus: row.activeStatus ? "Active" : "Inactive",
                    actions: _jsx("button", { className: "rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-700", onClick: () => { setCode(""); setName(row.name); }, children: "Use As Template" })
                })) })] }));
};
