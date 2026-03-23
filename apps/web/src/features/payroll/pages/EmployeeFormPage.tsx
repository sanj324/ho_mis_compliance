import type { ReactElement } from "react";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";

import { PageTitle } from "../../../components/common/PageTitle";
import { payrollApi } from "../services/payrollApi";

export const EmployeeFormPage = (): ReactElement => {
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
    mutationFn: async () =>
      isEdit && id
        ? payrollApi.updateEmployee(id, formState)
        : payrollApi.createEmployee(formState)
  });

  return (
    <div className="space-y-6">
      <PageTitle title={isEdit ? "Edit Employee" : "Create Employee"} subtitle="Payroll Onboarding" />
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-panel">
        <div className="grid gap-4 md:grid-cols-2">
          {[
            { key: "employeeCode", label: "Employee Code" },
            { key: "fullName", label: "Full Name" },
            { key: "branchId", label: "Branch Id" },
            { key: "panNo", label: "PAN No" },
            { key: "aadhaarNo", label: "Aadhaar No" },
            { key: "bankAccountNo", label: "Bank Account" },
            { key: "ifscCode", label: "IFSC" }
          ].map((field) => (
            <label key={field.key} className="text-sm text-slate-700">
              <span className="mb-2 block">{field.label}</span>
              <input
                className="w-full rounded-xl border border-slate-200 px-4 py-3"
                value={formState[field.key as keyof typeof formState]}
                onChange={(event) =>
                  setFormState((current) => ({
                    ...current,
                    [field.key]: event.target.value
                  }))
                }
              />
            </label>
          ))}
        </div>
        <div className="mt-6 flex gap-3">
          <button
            className="rounded-lg bg-brand-500 px-4 py-2 text-sm font-medium text-white"
            onClick={async () => {
              await mutation.mutateAsync();
              navigate("/payroll/employees");
            }}
          >
            Save
          </button>
          <button className="rounded-lg border border-slate-200 px-4 py-2 text-sm" onClick={() => navigate("/payroll/employees")}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};
