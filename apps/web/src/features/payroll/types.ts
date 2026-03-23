export type PayrollDashboardSummary = {
  employeeCount: number;
  activeEmployeeCount: number;
  pendingPayrollCount: number;
  latestRunCode: string | null;
  latestRunNetAmount: number;
  exceptionCount: number;
};

export type PayrollEmployee = {
  id: string;
  employeeCode: string;
  fullName: string;
  branchId: string;
  kycStatus: string;
  activeStatus: boolean;
  panNo: string | null;
  aadhaarNo: string | null;
  bankAccountNo: string | null;
  ifscCode: string | null;
};

export type AttendanceRecordItem = {
  id: string;
  attendanceDate: string;
  status: string;
  employee: {
    employeeCode: string;
    fullName: string;
  };
};

export type SalaryStructureItem = {
  id: string;
  effectiveFrom: string;
  basicPay: number;
  hra: number;
  specialAllowance: number;
  employee: {
    employeeCode: string;
    fullName: string;
  };
};

export type PayrollRunItem = {
  id: string;
  runCode: string;
  status: string;
  totalGross: number;
  totalNet: number;
  createdAt: string;
};
