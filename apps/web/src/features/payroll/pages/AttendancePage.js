import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useMutation, useQuery } from "@tanstack/react-query";
import { DataTablePlaceholder } from "../../../components/common/DataTablePlaceholder";
import { PageTitle } from "../../../components/common/PageTitle";
import { payrollApi } from "../services/payrollApi";
export const AttendancePage = () => {
    const { data = [] } = useQuery({
        queryKey: ["payroll", "attendance"],
        queryFn: payrollApi.listAttendance
    });
    const mutation = useMutation({
        mutationFn: () => payrollApi.bulkAttendance({
            records: []
        })
    });
    const canSubmitTemplatePayload = false;
    return (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsx(PageTitle, { title: "Attendance", subtitle: "Monthly Attendance Intake" }), _jsx("button", { className: "rounded-lg bg-brand-500 px-4 py-2 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-50", disabled: !canSubmitTemplatePayload || mutation.isPending, onClick: () => mutation.mutate(), children: "Bulk Upload Template Payload" })] }), _jsx("p", { className: "text-sm text-slate-600", children: "Bulk upload needs at least one valid attendance record with employee, branch, date, and status, so the placeholder button stays disabled until that flow is wired." }), _jsx(DataTablePlaceholder, { columns: ["attendanceDate", "employeeCode", "fullName", "status"], rows: data.map((row) => ({
                    attendanceDate: row.attendanceDate,
                    employeeCode: row.employee.employeeCode,
                    fullName: row.employee.fullName,
                    status: row.status
                })) })] }));
};
