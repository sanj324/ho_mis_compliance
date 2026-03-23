import type { ReactElement } from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

import { DataTablePlaceholder } from "../../../components/common/DataTablePlaceholder";
import { PageTitle } from "../../../components/common/PageTitle";
import { payrollApi } from "../services/payrollApi";

export const EmployeeListPage = (): ReactElement => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const { data = [] } = useQuery({
    queryKey: ["payroll", "employees"],
    queryFn: payrollApi.listEmployees
  });

  const filtered = data.filter(
    (item) =>
      item.employeeCode.toLowerCase().includes(search.toLowerCase()) ||
      item.fullName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <PageTitle title="Employees" subtitle="Payroll Master" />
        <button className="rounded-lg bg-brand-500 px-4 py-2 text-sm font-medium text-white" onClick={() => navigate("/payroll/employees/new")}>
          Add Employee
        </button>
      </div>
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-panel">
        <input
          className="w-full rounded-xl border border-slate-200 px-4 py-3"
          placeholder="Search by employee code or name"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />
      </div>
      <DataTablePlaceholder
        columns={["employeeCode", "fullName", "kycStatus", "activeStatus", "actions"]}
        rows={filtered.map((row) => ({
          employeeCode: row.employeeCode,
          fullName: row.fullName,
          kycStatus: row.kycStatus,
          activeStatus: row.activeStatus ? "Active" : "Inactive",
          actions: (
            <button
              className="rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-700"
              onClick={() => navigate(`/payroll/employees/${row.id}`)}
            >
              Edit
            </button>
          )
        }))}
      />
    </div>
  );
};
