export type EmployeeListFilters = {
  branchId?: string;
  departmentId?: string;
  activeStatus?: boolean;
};

export type EmployeeCreateInput = {
  employeeCode: string;
  fullName: string;
  dob?: string;
  joiningDate: string;
  branchId: string;
  departmentId?: string;
  designationId?: string;
  costCenterId?: string;
  panNo?: string;
  aadhaarNo?: string;
  uanNo?: string;
  esiNo?: string;
  bankAccountNo?: string;
  ifscCode?: string;
  activeStatus?: boolean;
  kycStatus?: string;
};
