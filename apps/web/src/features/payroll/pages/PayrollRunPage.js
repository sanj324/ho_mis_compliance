import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { DataTablePlaceholder } from "../../../components/common/DataTablePlaceholder";
import { PageTitle } from "../../../components/common/PageTitle";
import { payrollApi } from "../services/payrollApi";
export const PayrollRunPage = () => {
    const [branchId, setBranchId] = useState("");
    const [month, setMonth] = useState("4");
    const [year, setYear] = useState("2025");
    const branchIdPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    const { data = [] } = useQuery({
        queryKey: ["payroll", "runs"],
        queryFn: payrollApi.listRuns
    });
    const calculateMutation = useMutation({
        mutationFn: () => payrollApi.calculateRun({
            branchId,
            month: Number(month),
            year: Number(year)
        })
    });
    const finalizeMutation = useMutation({
        mutationFn: (payrollRunId) => payrollApi.finalizeRun({
            payrollRunId
        })
    });
    const canCalculate = branchIdPattern.test(branchId);
    return (_jsxs("div", { className: "space-y-6", children: [_jsx(PageTitle, { title: "Payroll Run", subtitle: "Calculation and Finalization" }), _jsxs("div", { className: "rounded-2xl border border-slate-200 bg-white p-4 shadow-panel", children: [_jsxs("div", { className: "grid gap-4 md:grid-cols-4", children: [_jsx("input", { className: "rounded-xl border border-slate-200 px-4 py-3", placeholder: "Branch Id", value: branchId, onChange: (event) => setBranchId(event.target.value) }), _jsx("input", { className: "rounded-xl border border-slate-200 px-4 py-3", placeholder: "Month", value: month, onChange: (event) => setMonth(event.target.value) }), _jsx("input", { className: "rounded-xl border border-slate-200 px-4 py-3", placeholder: "Year", value: year, onChange: (event) => setYear(event.target.value) }), _jsx("button", { className: "rounded-xl bg-brand-500 px-4 py-3 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-50", disabled: !canCalculate || calculateMutation.isPending, onClick: () => calculateMutation.mutate(), children: "Calculate Payroll" })] }), _jsx("p", { className: "mt-3 text-sm text-slate-600", children: "Enter a valid branch UUID before calculating a payroll run." })] }), _jsx(DataTablePlaceholder, { columns: ["runCode", "status", "totalGross", "totalNet", "createdAt"], rows: data.map((row) => ({
                    runCode: row.runCode,
                    status: row.status,
                    totalGross: String(row.totalGross),
                    totalNet: String(row.totalNet),
                    createdAt: row.createdAt
                })) }), _jsxs("div", { className: "rounded-2xl border border-slate-200 bg-white p-4 shadow-panel", children: [_jsx("p", { className: "text-sm text-slate-600", children: "Finalize the first available calculated run." }), _jsx("button", { className: "mt-3 rounded-lg border border-slate-200 px-4 py-2 text-sm", disabled: !data[0] || finalizeMutation.isPending, onClick: () => {
                            if (data[0]) {
                                finalizeMutation.mutate(data[0].id);
                            }
                        }, children: "Finalize Latest Run" })] })] }));
};
