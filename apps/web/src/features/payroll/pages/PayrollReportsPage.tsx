import type { ReactElement } from "react";
import { useQuery } from "@tanstack/react-query";

import { DataTablePlaceholder } from "../../../components/common/DataTablePlaceholder";
import { PageTitle } from "../../../components/common/PageTitle";
import { payrollApi } from "../services/payrollApi";

export const PayrollReportsPage = (): ReactElement => {
  const { data: salaryRegister = [] } = useQuery({
    queryKey: ["payroll", "report", "salary-register"],
    queryFn: payrollApi.salaryRegister
  });

  return (
    <div className="space-y-6">
      <PageTitle title="Payroll Reports" subtitle="Salary Register and Exceptions" />
      <DataTablePlaceholder
        columns={["runCode", "employeeCode", "employeeName", "grossPay", "netPay"]}
        rows={salaryRegister.map((row) => ({
          runCode: String(row.runCode ?? ""),
          employeeCode: String(row.employeeCode ?? ""),
          employeeName: String(row.employeeName ?? ""),
          grossPay: String(row.grossPay ?? ""),
          netPay: String(row.netPay ?? "")
        }))}
      />
    </div>
  );
};
