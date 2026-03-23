import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { DataTablePlaceholder } from "../../../components/common/DataTablePlaceholder";
import { PageTitle } from "../../../components/common/PageTitle";
import { investmentApi } from "../services/investmentApi";
export const InvestmentListPage = () => {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const [search, setSearch] = useState("");
    const { data = [] } = useQuery({
        queryKey: ["investments", "list"],
        queryFn: investmentApi.listInvestments
    });
    const accrualMutation = useMutation({
        mutationFn: (id) => investmentApi.postAccrual(id),
        onSuccess: () => {
            void queryClient.invalidateQueries({ queryKey: ["investments", "list"] });
        }
    });
    const filtered = data.filter((item) => item.investmentCode.toLowerCase().includes(search.toLowerCase()) ||
        item.securityName.toLowerCase().includes(search.toLowerCase()) ||
        item.classification.toLowerCase().includes(search.toLowerCase()));
    return (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsx(PageTitle, { title: "Investments", subtitle: "Portfolio Register" }), _jsx("button", { className: "rounded-lg bg-brand-500 px-4 py-2 text-sm font-medium text-white", onClick: () => navigate("/investments/new"), children: "Add Investment" })] }), _jsx("div", { className: "rounded-2xl border border-slate-200 bg-white p-4 shadow-panel", children: _jsxs("div", { className: "flex flex-col gap-4 lg:flex-row", children: [_jsx("input", { className: "w-full rounded-xl border border-slate-200 px-4 py-3", placeholder: "Search by code, security, or classification", value: search, onChange: (event) => setSearch(event.target.value) }), _jsx("button", { className: "rounded-xl border border-slate-300 px-4 py-3 text-sm font-medium text-slate-700", onClick: () => {
                                const target = filtered[0];
                                if (target) {
                                    accrualMutation.mutate(target.id);
                                }
                            }, children: "Post Accrual For First Visible Row" })] }) }), _jsx(DataTablePlaceholder, { columns: ["investmentCode", "securityName", "classification", "rating", "approvalState", "bookValue", "actions"], rows: filtered.map((row) => ({
                    investmentCode: row.investmentCode,
                    securityName: row.securityName,
                    classification: row.classification,
                    rating: row.rating ?? "-",
                    approvalState: row.approvalState,
                    bookValue: row.bookValue.toFixed(2),
                    actions: _jsxs("div", { className: "flex items-center gap-2", children: [_jsx("button", { className: "rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-700", onClick: () => navigate(`/investments/${row.id}`), children: "Edit" }), _jsx("button", { className: "rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-700 disabled:cursor-not-allowed disabled:opacity-60", disabled: accrualMutation.isPending, onClick: () => accrualMutation.mutate(row.id), children: "Accrual" })] })
                })) })] }));
};
