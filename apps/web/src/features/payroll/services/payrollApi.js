import { api } from "../../../lib/api";
const unwrap = (payload) => payload.data;
export const payrollApi = {
    getDashboardSummary: async () => unwrap((await api.get("/payroll/dashboard/summary")).data),
    listEmployees: async () => unwrap((await api.get("/payroll/employees")).data),
    getEmployee: async (id) => unwrap((await api.get(`/payroll/employees/${id}`)).data),
    createEmployee: async (payload) => unwrap((await api.post("/payroll/employees", payload)).data),
    updateEmployee: async (id, payload) => unwrap((await api.patch(`/payroll/employees/${id}`, payload)).data),
    listAttendance: async () => unwrap((await api.get("/payroll/attendance")).data),
    bulkAttendance: async (payload) => unwrap((await api.post("/payroll/attendance/bulk", payload)).data),
    listSalaryStructures: async () => unwrap((await api.get("/payroll/salary-structures")).data),
    createSalaryStructure: async (payload) => unwrap((await api.post("/payroll/salary-structures", payload)).data),
    listRuns: async () => unwrap((await api.get("/payroll/runs")).data),
    calculateRun: async (payload) => unwrap((await api.post("/payroll/runs/calculate", payload)).data),
    finalizeRun: async (payload) => unwrap((await api.post("/payroll/runs/finalize", payload)).data),
    salaryRegister: async () => unwrap((await api.get("/payroll/reports/salary-register")).data),
    statutoryDeductions: async () => unwrap((await api.get("/payroll/reports/statutory-deductions")).data),
    employeeExceptions: async () => unwrap((await api.get("/payroll/reports/employee-exceptions")).data)
};
