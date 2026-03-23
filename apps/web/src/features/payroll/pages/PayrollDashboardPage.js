import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useQuery } from "@tanstack/react-query";
import { PageTitle } from "../../../components/common/PageTitle";
import { StatCard } from "../../../components/common/StatCard";
import { payrollApi } from "../services/payrollApi";
export const PayrollDashboardPage = () => {
    const { data } = useQuery({
        queryKey: ["payroll", "dashboard"],
        queryFn: payrollApi.getDashboardSummary
    });
    return (_jsxs("div", { className: "space-y-6", children: [_jsx(PageTitle, { title: "Payroll Dashboard", subtitle: "Payroll Control View" }), _jsxs("div", { className: "grid gap-4 md:grid-cols-2 xl:grid-cols-3", children: [_jsx(StatCard, { label: "Employees", value: data?.employeeCount ?? 0 }), _jsx(StatCard, { label: "Active Employees", value: data?.activeEmployeeCount ?? 0 }), _jsx(StatCard, { label: "Pending Runs", value: data?.pendingPayrollCount ?? 0 }), _jsx(StatCard, { label: "Latest Run", value: data?.latestRunCode ?? "-" }), _jsx(StatCard, { label: "Latest Net Amount", value: data?.latestRunNetAmount ?? 0 }), _jsx(StatCard, { label: "Exceptions", value: data?.exceptionCount ?? 0 })] })] }));
};
