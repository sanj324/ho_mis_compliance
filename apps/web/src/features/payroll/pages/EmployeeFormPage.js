import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";
import { PageTitle } from "../../../components/common/PageTitle";
import { payrollApi } from "../services/payrollApi";
export const EmployeeFormPage = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const isEdit = Boolean(id);
    const { data } = useQuery({
        queryKey: ["payroll", "employee", id],
        queryFn: () => payrollApi.getEmployee(String(id)),
        enabled: isEdit
    });
    const [formState, setFormState] = useState({
        employeeCode: data?.employeeCode ?? "",
        fullName: data?.fullName ?? "",
        joiningDate: new Date().toISOString(),
        branchId: data?.branchId ?? "",
        panNo: data?.panNo ?? "",
        aadhaarNo: data?.aadhaarNo ?? "",
        bankAccountNo: data?.bankAccountNo ?? "",
        ifscCode: data?.ifscCode ?? ""
    });
    const mutation = useMutation({
        mutationFn: async () => isEdit && id
            ? payrollApi.updateEmployee(id, formState)
            : payrollApi.createEmployee(formState)
    });
    return (_jsxs("div", { className: "space-y-6", children: [_jsx(PageTitle, { title: isEdit ? "Edit Employee" : "Create Employee", subtitle: "Payroll Onboarding" }), _jsxs("div", { className: "rounded-2xl border border-slate-200 bg-white p-6 shadow-panel", children: [_jsx("div", { className: "grid gap-4 md:grid-cols-2", children: [
                            { key: "employeeCode", label: "Employee Code" },
                            { key: "fullName", label: "Full Name" },
                            { key: "branchId", label: "Branch Id" },
                            { key: "panNo", label: "PAN No" },
                            { key: "aadhaarNo", label: "Aadhaar No" },
                            { key: "bankAccountNo", label: "Bank Account" },
                            { key: "ifscCode", label: "IFSC" }
                        ].map((field) => (_jsxs("label", { className: "text-sm text-slate-700", children: [_jsx("span", { className: "mb-2 block", children: field.label }), _jsx("input", { className: "w-full rounded-xl border border-slate-200 px-4 py-3", value: formState[field.key], onChange: (event) => setFormState((current) => ({
                                        ...current,
                                        [field.key]: event.target.value
                                    })) })] }, field.key))) }), _jsxs("div", { className: "mt-6 flex gap-3", children: [_jsx("button", { className: "rounded-lg bg-brand-500 px-4 py-2 text-sm font-medium text-white", onClick: async () => {
                                    await mutation.mutateAsync();
                                    navigate("/payroll/employees");
                                }, children: "Save" }), _jsx("button", { className: "rounded-lg border border-slate-200 px-4 py-2 text-sm", onClick: () => navigate("/payroll/employees"), children: "Cancel" })] })] })] }));
};
