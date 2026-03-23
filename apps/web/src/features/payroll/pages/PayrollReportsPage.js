import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useQuery } from "@tanstack/react-query";
import { DataTablePlaceholder } from "../../../components/common/DataTablePlaceholder";
import { PageTitle } from "../../../components/common/PageTitle";
import { payrollApi } from "../services/payrollApi";
export const PayrollReportsPage = () => {
    const { data: salaryRegister = [] } = useQuery({
        queryKey: ["payroll", "report", "salary-register"],
        queryFn: payrollApi.salaryRegister
    });
    return (_jsxs("div", { className: "space-y-6", children: [_jsx(PageTitle, { title: "Payroll Reports", subtitle: "Salary Register and Exceptions" }), _jsx(DataTablePlaceholder, { columns: ["runCode", "employeeCode", "employeeName", "grossPay", "netPay"], rows: salaryRegister.map((row) => ({
                    runCode: String(row.runCode ?? ""),
                    employeeCode: String(row.employeeCode ?? ""),
                    employeeName: String(row.employeeName ?? ""),
                    grossPay: String(row.grossPay ?? ""),
                    netPay: String(row.netPay ?? "")
                })) })] }));
};
