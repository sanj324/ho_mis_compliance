import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useMutation, useQuery } from "@tanstack/react-query";
import { DataTablePlaceholder } from "../../../components/common/DataTablePlaceholder";
import { PageTitle } from "../../../components/common/PageTitle";
import { payrollApi } from "../services/payrollApi";
export const SalaryStructurePage = () => {
    const { data = [] } = useQuery({
        queryKey: ["payroll", "salary-structures"],
        queryFn: payrollApi.listSalaryStructures
    });
    const mutation = useMutation({
        mutationFn: () => payrollApi.createSalaryStructure({
            employeeId: "",
            effectiveFrom: new Date().toISOString(),
            basicPay: 0
        })
    });
    return (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsx(PageTitle, { title: "Salary Structures", subtitle: "Compensation Setup" }), _jsx("button", { className: "rounded-lg bg-brand-500 px-4 py-2 text-sm font-medium text-white", onClick: () => mutation.mutate(), children: "Create Default Structure" })] }), _jsx(DataTablePlaceholder, { columns: ["employeeCode", "fullName", "basicPay", "hra", "specialAllowance"], rows: data.map((row) => ({
                    employeeCode: row.employee.employeeCode,
                    fullName: row.employee.fullName,
                    basicPay: String(row.basicPay),
                    hra: String(row.hra),
                    specialAllowance: String(row.specialAllowance)
                })) })] }));
};
