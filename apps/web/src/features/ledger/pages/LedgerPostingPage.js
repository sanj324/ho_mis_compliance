import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { PageTitle } from "../../../components/common/PageTitle";
import { ledgerApi } from "../services/ledgerApi";
export const LedgerPostingPage = () => {
    const [formState, setFormState] = useState({
        module: "payroll",
        referenceId: ""
    });
    const mutation = useMutation({
        mutationFn: async () => {
            switch (formState.module) {
                case "payroll":
                    return ledgerApi.postPayroll(formState.referenceId);
                case "investment":
                    return ledgerApi.postInvestment(formState.referenceId);
                case "asset":
                    return ledgerApi.postAsset(formState.referenceId);
                case "stationery":
                    return ledgerApi.postStationery(formState.referenceId);
                default:
                    return ledgerApi.postShareCapital(formState.referenceId);
            }
        }
    });
    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormState((current) => ({ ...current, [name]: value }));
    };
    return (_jsxs("div", { className: "space-y-6", children: [_jsx(PageTitle, { title: "Ledger Posting", subtitle: "Generic Posting Engine Trigger" }), _jsxs("div", { className: "grid gap-4 rounded-2xl border border-slate-200 bg-white p-6 md:grid-cols-2", children: [_jsxs("select", { className: "rounded-xl border border-slate-300 px-3 py-2", name: "module", value: formState.module, onChange: handleChange, children: [_jsx("option", { value: "payroll", children: "Payroll" }), _jsx("option", { value: "investment", children: "Investment" }), _jsx("option", { value: "asset", children: "Asset" }), _jsx("option", { value: "stationery", children: "Stationery" }), _jsx("option", { value: "share-capital", children: "Share Capital" })] }), _jsx("input", { className: "rounded-xl border border-slate-300 px-3 py-2", name: "referenceId", value: formState.referenceId, onChange: handleChange, placeholder: "Reference id" })] }), _jsx("button", { className: "rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white", onClick: () => mutation.mutate(), type: "button", children: "Post Voucher" })] }));
};
