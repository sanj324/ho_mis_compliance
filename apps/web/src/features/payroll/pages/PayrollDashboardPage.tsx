import type { ReactElement } from "react";
import { useQuery } from "@tanstack/react-query";

import { PageTitle } from "../../../components/common/PageTitle";
import { StatCard } from "../../../components/common/StatCard";
import { payrollApi } from "../services/payrollApi";

export const PayrollDashboardPage = (): ReactElement => {
  const { data } = useQuery({
    queryKey: ["payroll", "dashboard"],
    queryFn: payrollApi.getDashboardSummary
  });

  return (
    <div className="space-y-6">
      <PageTitle title="Payroll Dashboard" subtitle="Payroll Control View" />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <StatCard label="Employees" value={data?.employeeCount ?? 0} />
        <StatCard label="Active Employees" value={data?.activeEmployeeCount ?? 0} />
        <StatCard label="Pending Runs" value={data?.pendingPayrollCount ?? 0} />
        <StatCard label="Latest Run" value={data?.latestRunCode ?? "-"} />
        <StatCard label="Latest Net Amount" value={data?.latestRunNetAmount ?? 0} />
        <StatCard label="Exceptions" value={data?.exceptionCount ?? 0} />
      </div>
    </div>
  );
};
