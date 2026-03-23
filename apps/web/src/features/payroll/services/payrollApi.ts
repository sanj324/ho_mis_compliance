import { api } from "../../../lib/api";
import type {
  AttendanceRecordItem,
  PayrollDashboardSummary,
  PayrollEmployee,
  PayrollRunItem,
  SalaryStructureItem
} from "../types";

const unwrap = <T>(payload: { success: true; data: T }): T => payload.data;

export const payrollApi = {
  getDashboardSummary: async (): Promise<PayrollDashboardSummary> =>
    unwrap((await api.get<{ success: true; data: PayrollDashboardSummary }>("/payroll/dashboard/summary")).data),
  listEmployees: async (): Promise<PayrollEmployee[]> =>
    unwrap((await api.get<{ success: true; data: PayrollEmployee[] }>("/payroll/employees")).data),
  getEmployee: async (id: string): Promise<PayrollEmployee> =>
    unwrap((await api.get<{ success: true; data: PayrollEmployee }>(`/payroll/employees/${id}`)).data),
  createEmployee: async (payload: Record<string, unknown>): Promise<PayrollEmployee> =>
    unwrap((await api.post<{ success: true; data: PayrollEmployee }>("/payroll/employees", payload)).data),
  updateEmployee: async (id: string, payload: Record<string, unknown>): Promise<PayrollEmployee> =>
    unwrap((await api.patch<{ success: true; data: PayrollEmployee }>(`/payroll/employees/${id}`, payload)).data),
  listAttendance: async (): Promise<AttendanceRecordItem[]> =>
    unwrap((await api.get<{ success: true; data: AttendanceRecordItem[] }>("/payroll/attendance")).data),
  bulkAttendance: async (payload: Record<string, unknown>) =>
    unwrap((await api.post<{ success: true; data: AttendanceRecordItem[] }>("/payroll/attendance/bulk", payload)).data),
  listSalaryStructures: async (): Promise<SalaryStructureItem[]> =>
    unwrap((await api.get<{ success: true; data: SalaryStructureItem[] }>("/payroll/salary-structures")).data),
  createSalaryStructure: async (payload: Record<string, unknown>) =>
    unwrap((await api.post<{ success: true; data: SalaryStructureItem }>("/payroll/salary-structures", payload)).data),
  listRuns: async (): Promise<PayrollRunItem[]> =>
    unwrap((await api.get<{ success: true; data: PayrollRunItem[] }>("/payroll/runs")).data),
  calculateRun: async (payload: Record<string, unknown>) =>
    unwrap((await api.post<{ success: true; data: PayrollRunItem }>("/payroll/runs/calculate", payload)).data),
  finalizeRun: async (payload: Record<string, unknown>) =>
    unwrap((await api.post<{ success: true; data: PayrollRunItem }>("/payroll/runs/finalize", payload)).data),
  salaryRegister: async () =>
    unwrap((await api.get<{ success: true; data: Array<Record<string, unknown>> }>("/payroll/reports/salary-register")).data),
  statutoryDeductions: async () =>
    unwrap((await api.get<{ success: true; data: Array<Record<string, unknown>> }>("/payroll/reports/statutory-deductions")).data),
  employeeExceptions: async () =>
    unwrap((await api.get<{ success: true; data: Array<Record<string, unknown>> }>("/payroll/reports/employee-exceptions")).data)
};
