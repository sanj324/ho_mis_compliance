import { AttendanceStatus, ModuleName, PrismaClient, RoleCode } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const permissionSeeds = [
  ["dashboard.read", ModuleName.DASHBOARD, "read", "Read dashboard"],
  ["users.read", ModuleName.USERS, "read", "Read users"],
  ["users.create", ModuleName.USERS, "create", "Create users"],
  ["users.update", ModuleName.USERS, "update", "Update users"],
  ["users.delete", ModuleName.USERS, "delete", "Delete users"],
  ["branches.read", ModuleName.BRANCHES, "read", "Read branches"],
  ["branches.create", ModuleName.BRANCHES, "create", "Create branches"],
  ["branches.update", ModuleName.BRANCHES, "update", "Update branches"],
  ["branches.delete", ModuleName.BRANCHES, "delete", "Delete branches"],
  ["departments.read", ModuleName.PAYROLL, "read", "Read departments"],
  ["departments.create", ModuleName.PAYROLL, "create", "Create departments"],
  ["departments.update", ModuleName.PAYROLL, "update", "Update departments"],
  ["departments.delete", ModuleName.PAYROLL, "delete", "Delete departments"],
  ["designations.read", ModuleName.PAYROLL, "read", "Read designations"],
  ["designations.create", ModuleName.PAYROLL, "create", "Create designations"],
  ["designations.update", ModuleName.PAYROLL, "update", "Update designations"],
  ["designations.delete", ModuleName.PAYROLL, "delete", "Delete designations"],
  ["costCenters.read", ModuleName.PAYROLL, "read", "Read cost centers"],
  ["costCenters.create", ModuleName.PAYROLL, "create", "Create cost centers"],
  ["costCenters.update", ModuleName.PAYROLL, "update", "Update cost centers"],
  ["costCenters.delete", ModuleName.PAYROLL, "delete", "Delete cost centers"],
  ["auditLogs.read", ModuleName.AUDIT, "read", "Read audit logs"],
  ["payroll.read", ModuleName.PAYROLL, "read", "Read payroll data"],
  ["payroll.create", ModuleName.PAYROLL, "create", "Create payroll records"],
  ["payroll.finalize", ModuleName.PAYROLL, "finalize", "Finalize payroll runs"],
  ["payroll.reports", ModuleName.PAYROLL, "reports", "Read payroll reports"],
  ["investments.read", ModuleName.INVESTMENTS, "read", "Read investments"],
  ["investments.create", ModuleName.INVESTMENTS, "create", "Create investments"],
  ["investments.update", ModuleName.INVESTMENTS, "update", "Update investments"],
  ["investments.reports", ModuleName.INVESTMENTS, "reports", "Read investment reports"],
  ["investments.exposure", ModuleName.INVESTMENTS, "exposure", "Read exposure checks"],
  ["assets.read", ModuleName.ASSETS, "read", "Read assets"],
  ["assets.create", ModuleName.ASSETS, "create", "Create assets"],
  ["assets.update", ModuleName.ASSETS, "update", "Update assets"],
  ["assets.depreciation", ModuleName.ASSETS, "depreciation", "Run asset depreciation"],
  ["assets.reports", ModuleName.ASSETS, "reports", "Read asset reports"],
  ["stationery.read", ModuleName.STATIONERY, "read", "Read stationery items"],
  ["stationery.create", ModuleName.STATIONERY, "create", "Create stationery records"],
  ["stationery.update", ModuleName.STATIONERY, "update", "Update stationery records"],
  ["stationery.issue", ModuleName.STATIONERY, "issue", "Issue stationery stock"],
  ["stationery.reports", ModuleName.STATIONERY, "reports", "Read stationery reports"],
  ["shareCapital.read", ModuleName.SHARE_CAPITAL, "read", "Read share capital data"],
  ["shareCapital.create", ModuleName.SHARE_CAPITAL, "create", "Create share capital records"],
  ["shareCapital.update", ModuleName.SHARE_CAPITAL, "update", "Update share capital records"],
  ["shareCapital.reports", ModuleName.SHARE_CAPITAL, "reports", "Read share capital reports"],
  ["shareCapital.dividend", ModuleName.SHARE_CAPITAL, "dividend", "Declare dividends"],
  ["compliance.read", ModuleName.COMPLIANCE, "read", "Read compliance events"],
  ["compliance.close", ModuleName.COMPLIANCE, "close", "Close compliance events"],
  ["notifications.read", ModuleName.NOTIFICATIONS, "read", "Read notifications"],
  ["documents.read", ModuleName.DOCUMENTS, "read", "Read documents"],
  ["ledger.read", ModuleName.LEDGER, "read", "Read vouchers and ledger accounts"],
  ["reports.read", ModuleName.REPORTING, "read", "Read report definitions"],
  ["approvals.read", ModuleName.APPROVALS, "read", "Read approval inbox"]
] as const;

const upsertRoleLinks = async (client: PrismaClient, roleId: string, permissionIds: string[]) => {
  await Promise.all(
    permissionIds.map((permissionId) =>
      client.rolePermission.upsert({
        where: { roleId_permissionId: { roleId, permissionId } },
        update: {},
        create: { roleId, permissionId }
      })
    )
  );
};

export const seedDatabase = async (client: PrismaClient = prisma): Promise<void> => {
  const [adminPasswordHash, managerPasswordHash, operatorPasswordHash] = await Promise.all([
    bcrypt.hash("Admin@123", 10),
    bcrypt.hash("Manager@123", 10),
    bcrypt.hash("DataEntry@123", 10)
  ]);

  const [headOffice, puneBranch] = await Promise.all([
    client.branch.upsert({
      where: { code: "HO001" },
      update: { name: "Head Office", city: "Mumbai", state: "Maharashtra", isHeadOffice: true },
      create: { code: "HO001", name: "Head Office", city: "Mumbai", state: "Maharashtra", isHeadOffice: true }
    }),
    client.branch.upsert({
      where: { code: "BR001" },
      update: { name: "Pune Branch", city: "Pune", state: "Maharashtra", isHeadOffice: false },
      create: { code: "BR001", name: "Pune Branch", city: "Pune", state: "Maharashtra", isHeadOffice: false }
    })
  ]);

  const permissions = await Promise.all(
    permissionSeeds.map(([code, moduleName, action, description]) =>
      client.permission.upsert({ where: { code }, update: { moduleName, action, description }, create: { code, moduleName, action, description } })
    )
  );

  const [hoAdminRole, branchManagerRole, branchDataEntryRole] = await Promise.all([
    client.role.upsert({ where: { code: RoleCode.HO_ADMIN }, update: { name: "Head Office Admin" }, create: { code: RoleCode.HO_ADMIN, name: "Head Office Admin" } }),
    client.role.upsert({ where: { code: RoleCode.BRANCH_MANAGER }, update: { name: "Branch Manager" }, create: { code: RoleCode.BRANCH_MANAGER, name: "Branch Manager" } }),
    client.role.upsert({ where: { code: RoleCode.BRANCH_DATA_ENTRY }, update: { name: "Branch Data Entry" }, create: { code: RoleCode.BRANCH_DATA_ENTRY, name: "Branch Data Entry" } })
  ]);

  await upsertRoleLinks(client, hoAdminRole.id, permissions.map((permission) => permission.id));
  await upsertRoleLinks(
    client,
    branchManagerRole.id,
    permissions.filter((permission) => ["dashboard.read", "users.read", "branches.read", "payroll.read", "investments.read", "compliance.read"].includes(permission.code)).map((permission) => permission.id)
  );
  await upsertRoleLinks(
    client,
    branchDataEntryRole.id,
    permissions.filter((permission) => ["dashboard.read", "users.read", "branches.read"].includes(permission.code)).map((permission) => permission.id)
  );

  const [adminUser, branchManager] = await Promise.all([
    client.user.upsert({
      where: { username: "admin.ho" },
      update: { fullName: "HO Administrator", email: "admin.ho@example.com", passwordHash: adminPasswordHash, branchId: headOffice.id },
      create: { username: "admin.ho", fullName: "HO Administrator", email: "admin.ho@example.com", passwordHash: adminPasswordHash, branchId: headOffice.id }
    }),
    client.user.upsert({
      where: { username: "manager.br001" },
      update: { fullName: "Pune Branch Manager", email: "manager.br001@example.com", passwordHash: managerPasswordHash, branchId: puneBranch.id },
      create: { username: "manager.br001", fullName: "Pune Branch Manager", email: "manager.br001@example.com", passwordHash: managerPasswordHash, branchId: puneBranch.id }
    })
  ]);

  const branchOperator = await client.user.upsert({
    where: { username: "operator.br001" },
    update: { fullName: "Pune Data Entry Operator", email: "operator.br001@example.com", passwordHash: operatorPasswordHash, branchId: puneBranch.id },
    create: { username: "operator.br001", fullName: "Pune Data Entry Operator", email: "operator.br001@example.com", passwordHash: operatorPasswordHash, branchId: puneBranch.id }
  });

  await Promise.all([
    client.userRole.upsert({ where: { userId_roleId: { userId: adminUser.id, roleId: hoAdminRole.id } }, update: {}, create: { userId: adminUser.id, roleId: hoAdminRole.id } }),
    client.userRole.upsert({ where: { userId_roleId: { userId: branchManager.id, roleId: branchManagerRole.id } }, update: {}, create: { userId: branchManager.id, roleId: branchManagerRole.id } }),
    client.userRole.upsert({ where: { userId_roleId: { userId: branchOperator.id, roleId: branchDataEntryRole.id } }, update: {}, create: { userId: branchOperator.id, roleId: branchDataEntryRole.id } })
  ]);

  const [department, opsDepartment, designation, seniorDesignation, costCenter, treasuryCenter] = await Promise.all([
    client.department.upsert({ where: { code: "HR-HO" }, update: { name: "HR Department", branchId: headOffice.id }, create: { code: "HR-HO", name: "HR Department", branchId: headOffice.id } }),
    client.department.upsert({ where: { code: "OPS-HO" }, update: { name: "Operations Department", branchId: headOffice.id }, create: { code: "OPS-HO", name: "Operations Department", branchId: headOffice.id } }),
    client.designation.upsert({ where: { code: "OFFICER" }, update: { name: "Officer", branchId: headOffice.id }, create: { code: "OFFICER", name: "Officer", branchId: headOffice.id } }),
    client.designation.upsert({ where: { code: "SENIOR-OFFICER" }, update: { name: "Senior Officer", branchId: headOffice.id }, create: { code: "SENIOR-OFFICER", name: "Senior Officer", branchId: headOffice.id } }),
    client.costCenter.upsert({ where: { code: "CC-HO-01" }, update: { name: "Head Office Operations", branchId: headOffice.id }, create: { code: "CC-HO-01", name: "Head Office Operations", branchId: headOffice.id } }),
    client.costCenter.upsert({ where: { code: "CC-HO-02" }, update: { name: "Treasury Desk", branchId: headOffice.id }, create: { code: "CC-HO-02", name: "Treasury Desk", branchId: headOffice.id } })
  ]);

  const [employeeOne, employeeTwo] = await Promise.all([
    client.employee.upsert({
      where: { employeeCode: "EMP001" },
      update: { fullName: "Anita Sharma", joiningDate: new Date("2024-04-01"), branchId: headOffice.id, departmentId: department.id, designationId: designation.id, costCenterId: costCenter.id, panNo: "ABCDE1234F", aadhaarNo: "111122223333", uanNo: "100200300400", bankAccountNo: "123456789012", ifscCode: "SBIN0000123", kycStatus: "COMPLETED", approvalState: "APPROVED" },
      create: { employeeCode: "EMP001", fullName: "Anita Sharma", joiningDate: new Date("2024-04-01"), branchId: headOffice.id, departmentId: department.id, designationId: designation.id, costCenterId: costCenter.id, panNo: "ABCDE1234F", aadhaarNo: "111122223333", uanNo: "100200300400", bankAccountNo: "123456789012", ifscCode: "SBIN0000123", kycStatus: "COMPLETED", approvalState: "APPROVED" }
    }),
    client.employee.upsert({
      where: { employeeCode: "EMP002" },
      update: { fullName: "Rahul Verma", joiningDate: new Date("2025-01-15"), branchId: headOffice.id, departmentId: opsDepartment.id, designationId: seniorDesignation.id, costCenterId: treasuryCenter.id, panNo: "XYZAB1234C", aadhaarNo: "777788889999", uanNo: "200300400500", bankAccountNo: "987654321000", ifscCode: "HDFC0000123", kycStatus: "PENDING", approvalState: "APPROVED" },
      create: { employeeCode: "EMP002", fullName: "Rahul Verma", joiningDate: new Date("2025-01-15"), branchId: headOffice.id, departmentId: opsDepartment.id, designationId: seniorDesignation.id, costCenterId: treasuryCenter.id, panNo: "XYZAB1234C", aadhaarNo: "777788889999", uanNo: "200300400500", bankAccountNo: "987654321000", ifscCode: "HDFC0000123", kycStatus: "PENDING", approvalState: "APPROVED" }
    })
  ]);

  await Promise.all([
    client.employeeKyc.upsert({ where: { employeeId: employeeOne.id }, update: { panVerified: true, aadhaarVerified: true, bankVerified: true }, create: { employeeId: employeeOne.id, panVerified: true, aadhaarVerified: true, bankVerified: true } }),
    client.employeeKyc.upsert({ where: { employeeId: employeeTwo.id }, update: { panVerified: true, aadhaarVerified: false, bankVerified: true, remarks: "Aadhaar validation pending" }, create: { employeeId: employeeTwo.id, panVerified: true, aadhaarVerified: false, bankVerified: true, remarks: "Aadhaar validation pending" } })
  ]);

  await client.salaryStructure.deleteMany({ where: { employeeId: { in: [employeeOne.id, employeeTwo.id] } } });
  await client.salaryStructure.createMany({ data: [
    { employeeId: employeeOne.id, effectiveFrom: new Date("2025-04-01"), basicPay: 30000, hra: 12000, specialAllowance: 5000, conveyanceAllowance: 2000, otherAllowance: 1000 },
    { employeeId: employeeTwo.id, effectiveFrom: new Date("2025-04-01"), basicPay: 42000, hra: 16800, specialAllowance: 6000, conveyanceAllowance: 2000, otherAllowance: 1500 }
  ] });
  await client.statutorySetup.deleteMany({ where: { branchId: headOffice.id } });
  await client.statutorySetup.create({ data: { branchId: headOffice.id, effectiveFrom: new Date("2025-04-01") } });
  await client.attendanceRecord.deleteMany({ where: { employeeId: { in: [employeeOne.id, employeeTwo.id] } } });
  await client.attendanceRecord.createMany({ data: [
    ...Array.from({ length: 5 }).map((_, index) => ({ employeeId: employeeOne.id, branchId: headOffice.id, attendanceDate: new Date(`2026-03-0${index + 1}`), status: AttendanceStatus.PRESENT })),
    ...Array.from({ length: 5 }).map((_, index) => ({ employeeId: employeeTwo.id, branchId: headOffice.id, attendanceDate: new Date(`2026-03-0${index + 1}`), status: index === 2 ? AttendanceStatus.ABSENT : AttendanceStatus.PRESENT }))
  ] });
  await client.leaveRecord.deleteMany({ where: { employeeId: { in: [employeeOne.id, employeeTwo.id] } } });
  await client.leaveRecord.create({ data: { employeeId: employeeOne.id, leaveType: "CASUAL_LEAVE", startDate: new Date("2026-03-21"), endDate: new Date("2026-03-21"), totalDays: 1, status: "APPROVED", remarks: "Seeded approved leave for UAT" } });
  const pendingLeave = await client.leaveRecord.create({ data: { employeeId: employeeTwo.id, leaveType: "SICK_LEAVE", startDate: new Date("2026-03-24"), endDate: new Date("2026-03-25"), totalDays: 2, status: "PENDING", remarks: "Seeded pending leave for approval inbox" } });

  const payrollMonth = await client.payrollMonth.upsert({ where: { branchId_month_year: { branchId: headOffice.id, month: 3, year: 2026 } }, update: { isLocked: false, approvalState: "APPROVED" }, create: { branchId: headOffice.id, month: 3, year: 2026, isLocked: false, approvalState: "APPROVED" } });
  const payrollRun = await client.payrollRun.upsert({ where: { runCode: "PR-2026-03-HO" }, update: { branchId: headOffice.id, payrollMonthId: payrollMonth.id, status: "CALCULATED", approvalState: "PENDING_APPROVAL", totalGross: 117300, totalDeductions: 16614, totalNet: 100686 }, create: { branchId: headOffice.id, payrollMonthId: payrollMonth.id, runCode: "PR-2026-03-HO", status: "CALCULATED", approvalState: "PENDING_APPROVAL", totalGross: 117300, totalDeductions: 16614, totalNet: 100686 } });
  await client.payrollRunItem.deleteMany({ where: { payrollRunId: payrollRun.id } });
  await client.payrollRunItem.createMany({ data: [
    { payrollRunId: payrollRun.id, employeeId: employeeOne.id, grossPay: 50000, pfDeduction: 3600, ptDeduction: 200, tdsDeduction: 2500, totalDeductions: 6300, netPay: 43700, exceptionCount: 0 },
    { payrollRunId: payrollRun.id, employeeId: employeeTwo.id, grossPay: 67300, pfDeduction: 5040, ptDeduction: 200, tdsDeduction: 5074, totalDeductions: 10314, netPay: 56986, exceptionCount: 1 }
  ] });
  await client.payrollException.deleteMany({ where: { payrollRunId: payrollRun.id } });
  await client.payrollException.create({ data: { payrollRunId: payrollRun.id, employeeId: employeeTwo.id, exceptionCode: "PAYROLL_KYC_DEFICIENT", exceptionMessage: "Employee KYC is incomplete for payroll processing.", severity: "HIGH" } });

  const [securityTypeGsec, securityTypeBond, issuerGoi, issuerNabard, counterpartyRbi, counterpartySbi, brokerOne, brokerTwo] = await Promise.all([
    client.securityType.upsert({ where: { code: "GSEC" }, update: { name: "Government Security", category: "SOVEREIGN", slrEligible: true }, create: { code: "GSEC", name: "Government Security", category: "SOVEREIGN", slrEligible: true } }),
    client.securityType.upsert({ where: { code: "BOND" }, update: { name: "Corporate Bond", category: "NON_SLR", slrEligible: false }, create: { code: "BOND", name: "Corporate Bond", category: "NON_SLR", slrEligible: false } }),
    client.issuer.upsert({ where: { code: "GOI" }, update: { name: "Government of India", issuerType: "SOVEREIGN", riskLimit: 1000000000 }, create: { code: "GOI", name: "Government of India", issuerType: "SOVEREIGN", riskLimit: 1000000000 } }),
    client.issuer.upsert({ where: { code: "NABARD" }, update: { name: "NABARD", issuerType: "PSU", riskLimit: 250000000 }, create: { code: "NABARD", name: "NABARD", issuerType: "PSU", riskLimit: 250000000 } }),
    client.counterparty.upsert({ where: { code: "RBI" }, update: { name: "Reserve Bank of India", exposureLimit: 1000000000 }, create: { code: "RBI", name: "Reserve Bank of India", exposureLimit: 1000000000 } }),
    client.counterparty.upsert({ where: { code: "SBI" }, update: { name: "State Bank of India", exposureLimit: 300000000 }, create: { code: "SBI", name: "State Bank of India", exposureLimit: 300000000 } }),
    client.broker.upsert({ where: { code: "BRK001" }, update: { name: "Primary Dealer One", registrationNo: "SEBI-PD-001" }, create: { code: "BRK001", name: "Primary Dealer One", registrationNo: "SEBI-PD-001" } }),
    client.broker.upsert({ where: { code: "BRK002" }, update: { name: "Treasury Desk Partner", registrationNo: "SEBI-PD-002" }, create: { code: "BRK002", name: "Treasury Desk Partner", registrationNo: "SEBI-PD-002" } })
  ]);

  const [investmentOne, investmentTwo] = await Promise.all([
    client.investment.upsert({ where: { investmentCode: "INV001" }, update: { securityName: "7.10% GOI 2034", isin: "IN0020240010", branchId: headOffice.id, securityTypeId: securityTypeGsec.id, issuerId: issuerGoi.id, counterpartyId: counterpartyRbi.id, brokerId: brokerOne.id, classification: "HTM", purchaseDate: new Date("2025-04-15"), maturityDate: new Date("2034-04-15"), couponRate: 7.1, faceValue: 5000000, bookValue: 4975000, marketValue: 5032000, yieldRate: 7.18, rating: "SOV", approvalState: "APPROVED", policyLimit: 7000000 }, create: { investmentCode: "INV001", securityName: "7.10% GOI 2034", isin: "IN0020240010", branchId: headOffice.id, securityTypeId: securityTypeGsec.id, issuerId: issuerGoi.id, counterpartyId: counterpartyRbi.id, brokerId: brokerOne.id, classification: "HTM", purchaseDate: new Date("2025-04-15"), maturityDate: new Date("2034-04-15"), couponRate: 7.1, faceValue: 5000000, bookValue: 4975000, marketValue: 5032000, yieldRate: 7.18, rating: "SOV", approvalState: "APPROVED", policyLimit: 7000000 } }),
    client.investment.upsert({ where: { investmentCode: "INV002" }, update: { securityName: "NABARD 7.45% 2029", isin: "IN0099990002", branchId: headOffice.id, securityTypeId: securityTypeBond.id, issuerId: issuerNabard.id, counterpartyId: counterpartySbi.id, brokerId: brokerTwo.id, classification: "AFS", purchaseDate: new Date("2025-09-01"), maturityDate: new Date("2029-09-01"), couponRate: 7.45, faceValue: 7500000, bookValue: 7450000, marketValue: 7560000, yieldRate: 7.38, rating: "AAA", approvalState: "APPROVED", policyLimit: 6500000 }, create: { investmentCode: "INV002", securityName: "NABARD 7.45% 2029", isin: "IN0099990002", branchId: headOffice.id, securityTypeId: securityTypeBond.id, issuerId: issuerNabard.id, counterpartyId: counterpartySbi.id, brokerId: brokerTwo.id, classification: "AFS", purchaseDate: new Date("2025-09-01"), maturityDate: new Date("2029-09-01"), couponRate: 7.45, faceValue: 7500000, bookValue: 7450000, marketValue: 7560000, yieldRate: 7.38, rating: "AAA", approvalState: "APPROVED", policyLimit: 6500000 } })
  ]);

  await client.investmentAccrual.deleteMany({ where: { investmentId: { in: [investmentOne.id, investmentTwo.id] } } });
  await client.investmentAccrual.createMany({ data: [
    { investmentId: investmentOne.id, accrualDate: new Date("2026-03-31"), accrualAmount: 29458.9 },
    { investmentId: investmentTwo.id, accrualDate: new Date("2026-03-31"), accrualAmount: 46250 }
  ] });
  await client.investmentTransaction.deleteMany({ where: { investmentId: { in: [investmentOne.id, investmentTwo.id] } } });
  await client.investmentTransaction.createMany({ data: [
    { investmentId: investmentOne.id, transactionType: "PURCHASE", transactionDate: new Date("2025-04-15"), amount: 4975000 },
    { investmentId: investmentTwo.id, transactionType: "PURCHASE", transactionDate: new Date("2025-09-01"), amount: 7450000 }
  ] });
  await client.investmentExposureSnapshot.deleteMany({ where: { branchId: headOffice.id } });
  await client.investmentExposureSnapshot.createMany({ data: [
    { branchId: headOffice.id, investmentId: investmentOne.id, snapshotDate: new Date("2026-03-31"), issuerExposure: 4975000, counterpartyExposure: 4975000, totalExposure: 4975000 },
    { branchId: headOffice.id, investmentId: investmentTwo.id, snapshotDate: new Date("2026-03-31"), issuerExposure: 7450000, counterpartyExposure: 7450000, totalExposure: 7450000 }
  ] });
  await client.investmentException.deleteMany({ where: { investmentId: investmentTwo.id } });
  await client.investmentException.create({ data: { investmentId: investmentTwo.id, exceptionCode: "INVESTMENT_POLICY_LIMIT", exceptionMessage: "Investment exceeds the policy monitoring threshold.", severity: "MEDIUM" } });

  const [assetCategory, depreciationMethod] = await Promise.all([
    client.assetCategory.upsert({ where: { code: "IT-EQP" }, update: { name: "IT Equipment", usefulLifeMonths: 60 }, create: { code: "IT-EQP", name: "IT Equipment", usefulLifeMonths: 60 } }),
    client.depreciationMethod.upsert({ where: { code: "SLM" }, update: { name: "Straight Line Method", calculationType: "STRAIGHT_LINE" }, create: { code: "SLM", name: "Straight Line Method", calculationType: "STRAIGHT_LINE" } })
  ]);
  const [asset, disposedAsset] = await Promise.all([
    client.asset.upsert({ where: { assetCode: "AST001" }, update: { assetName: "Core Banking Application Server", assetCategoryId: assetCategory.id, depreciationMethodId: depreciationMethod.id, branchId: headOffice.id, departmentId: department.id, costCenterId: costCenter.id, purchaseDate: new Date("2025-01-10"), capitalizationDate: new Date("2025-01-15"), originalCost: 1200000, usefulLifeMonths: 60, depreciationRate: 20, salvageValue: 60000, accumulatedDepreciation: 40000, netBookValue: 1160000, insurancePolicyNo: "POL-2025-0001", insuranceExpiryDate: new Date("2026-01-31"), warrantyExpiryDate: new Date("2028-01-31"), currentStatus: "ACTIVE", currentHolder: "IT Team", barcodeOrTagNo: "TAG-AST001", approvalState: "APPROVED" }, create: { assetCode: "AST001", assetName: "Core Banking Application Server", assetCategoryId: assetCategory.id, depreciationMethodId: depreciationMethod.id, branchId: headOffice.id, departmentId: department.id, costCenterId: costCenter.id, purchaseDate: new Date("2025-01-10"), capitalizationDate: new Date("2025-01-15"), originalCost: 1200000, usefulLifeMonths: 60, depreciationRate: 20, salvageValue: 60000, accumulatedDepreciation: 40000, netBookValue: 1160000, insurancePolicyNo: "POL-2025-0001", insuranceExpiryDate: new Date("2026-01-31"), warrantyExpiryDate: new Date("2028-01-31"), currentStatus: "ACTIVE", currentHolder: "IT Team", barcodeOrTagNo: "TAG-AST001", approvalState: "APPROVED" } }),
    client.asset.upsert({ where: { assetCode: "AST002" }, update: { assetName: "Branch Teller Workstation", assetCategoryId: assetCategory.id, depreciationMethodId: depreciationMethod.id, branchId: puneBranch.id, departmentId: opsDepartment.id, costCenterId: treasuryCenter.id, purchaseDate: new Date("2024-07-01"), capitalizationDate: new Date("2024-07-05"), originalCost: 85000, usefulLifeMonths: 36, depreciationRate: 33.33, salvageValue: 5000, accumulatedDepreciation: 30000, netBookValue: 55000, insurancePolicyNo: "POL-2024-0020", insuranceExpiryDate: new Date("2025-06-30"), warrantyExpiryDate: new Date("2027-06-30"), currentStatus: "DISPOSED", currentHolder: "Branch Operations", barcodeOrTagNo: "TAG-AST002", approvalState: "APPROVED" }, create: { assetCode: "AST002", assetName: "Branch Teller Workstation", assetCategoryId: assetCategory.id, depreciationMethodId: depreciationMethod.id, branchId: puneBranch.id, departmentId: opsDepartment.id, costCenterId: treasuryCenter.id, purchaseDate: new Date("2024-07-01"), capitalizationDate: new Date("2024-07-05"), originalCost: 85000, usefulLifeMonths: 36, depreciationRate: 33.33, salvageValue: 5000, accumulatedDepreciation: 30000, netBookValue: 55000, insurancePolicyNo: "POL-2024-0020", insuranceExpiryDate: new Date("2025-06-30"), warrantyExpiryDate: new Date("2027-06-30"), currentStatus: "DISPOSED", currentHolder: "Branch Operations", barcodeOrTagNo: "TAG-AST002", approvalState: "APPROVED" } })
  ]);
  await Promise.all([
    client.assetInsurance.upsert({ where: { policyNo: "POL-2025-0001" }, update: { assetId: asset.id, insurerName: "New India Assurance", startDate: new Date("2025-02-01"), expiryDate: new Date("2026-01-31"), insuredValue: 1200000, premiumAmount: 24000 }, create: { assetId: asset.id, policyNo: "POL-2025-0001", insurerName: "New India Assurance", startDate: new Date("2025-02-01"), expiryDate: new Date("2026-01-31"), insuredValue: 1200000, premiumAmount: 24000 } }),
    client.assetInsurance.upsert({ where: { policyNo: "POL-2024-0020" }, update: { assetId: disposedAsset.id, insurerName: "Oriental Insurance", startDate: new Date("2024-07-05"), expiryDate: new Date("2025-06-30"), insuredValue: 85000, premiumAmount: 3200 }, create: { assetId: disposedAsset.id, policyNo: "POL-2024-0020", insurerName: "Oriental Insurance", startDate: new Date("2024-07-05"), expiryDate: new Date("2025-06-30"), insuredValue: 85000, premiumAmount: 3200 } })
  ]);
  await Promise.all([
    client.assetDepreciationRun.upsert({ where: { assetId_runMonth_runYear: { assetId: asset.id, runMonth: 2, runYear: 2025 } }, update: { depreciationAmount: 19000, accumulatedDepreciation: 59000, closingNetBookValue: 1141000 }, create: { assetId: asset.id, runMonth: 2, runYear: 2025, depreciationAmount: 19000, accumulatedDepreciation: 59000, closingNetBookValue: 1141000 } }),
    client.assetDepreciationRun.upsert({ where: { assetId_runMonth_runYear: { assetId: disposedAsset.id, runMonth: 2, runYear: 2026 } }, update: { depreciationAmount: 2361, accumulatedDepreciation: 32361, closingNetBookValue: 52639 }, create: { assetId: disposedAsset.id, runMonth: 2, runYear: 2026, depreciationAmount: 2361, accumulatedDepreciation: 32361, closingNetBookValue: 52639 } })
  ]);
  await client.assetTransfer.deleteMany({ where: { assetId: asset.id } });
  await client.assetTransfer.create({ data: { assetId: asset.id, fromBranchId: headOffice.id, toBranchId: puneBranch.id, transferDate: new Date("2026-03-16"), reason: "Seeded DR handover for branch infrastructure testing", approvalState: "APPROVED" } });
  await client.assetVerification.deleteMany({ where: { assetId: { in: [asset.id, disposedAsset.id] } } });
  await client.assetVerification.createMany({ data: [
    { assetId: asset.id, verificationDate: new Date("2026-03-18"), status: "VERIFIED", varianceRemarks: "Verified in branch server room after transfer." },
    { assetId: disposedAsset.id, verificationDate: new Date("2026-03-19"), status: "VARIANCE", varianceRemarks: "Asset moved to disposal yard pending final sign-off." }
  ] });
  await client.assetDisposal.deleteMany({ where: { assetId: disposedAsset.id } });
  const assetDisposal = await client.assetDisposal.create({ data: { assetId: disposedAsset.id, disposalDate: new Date("2026-03-20"), disposalValue: 48000, netBookValueAtDisposal: 52639, gainLossAmount: -4639, reason: "Replacement under branch hardware refresh cycle", approvalState: "PENDING_APPROVAL" } });
  await client.assetException.deleteMany({ where: { assetId: { in: [asset.id, disposedAsset.id] } } });
  await client.assetException.createMany({ data: [
    { assetId: asset.id, exceptionCode: "INSURANCE_RENEWAL_PENDING", exceptionMessage: "Core server insurance expired and requires immediate renewal.", severity: "HIGH" },
    { assetId: disposedAsset.id, exceptionCode: "DISPOSAL_APPROVAL_PENDING", exceptionMessage: "Disposed workstation is awaiting final approval and accounting closure.", severity: "MEDIUM" }
  ] });

  const [itemCategory, vendor] = await Promise.all([
    client.itemCategory.upsert({ where: { code: "PAPER" }, update: { name: "Paper Products" }, create: { code: "PAPER", name: "Paper Products" } }),
    client.vendor.upsert({ where: { code: "VEND001" }, update: { name: "Office Supplies India", gstNo: "27ABCDE1234F1Z5", contactPerson: "Rakesh Jain", phoneNo: "9876543210" }, create: { code: "VEND001", name: "Office Supplies India", gstNo: "27ABCDE1234F1Z5", contactPerson: "Rakesh Jain", phoneNo: "9876543210" } })
  ]);
  const [paperItem, fileItem] = await Promise.all([
    client.stationeryItem.upsert({ where: { itemCode: "ITEM001" }, update: { itemName: "A4 Copier Paper", itemCategoryId: itemCategory.id, unitOfMeasure: "REAM", reorderLevel: 25, maxLevel: 200, gstRate: 12 }, create: { itemCode: "ITEM001", itemName: "A4 Copier Paper", itemCategoryId: itemCategory.id, unitOfMeasure: "REAM", reorderLevel: 25, maxLevel: 200, gstRate: 12 } }),
    client.stationeryItem.upsert({ where: { itemCode: "ITEM002" }, update: { itemName: "Record File Cover", itemCategoryId: itemCategory.id, unitOfMeasure: "NOS", reorderLevel: 100, maxLevel: 500, gstRate: 12 }, create: { itemCode: "ITEM002", itemName: "Record File Cover", itemCategoryId: itemCategory.id, unitOfMeasure: "NOS", reorderLevel: 100, maxLevel: 500, gstRate: 12 } })
  ]);
  await client.stockLedger.deleteMany({ where: { itemId: { in: [paperItem.id, fileItem.id] } } });
  await client.stockLedger.createMany({ data: [
    { itemId: paperItem.id, branchId: headOffice.id, transactionType: "RECEIPT", quantity: 100, transactionDate: new Date("2026-03-01"), referenceType: "OPENING", referenceId: paperItem.id, remarks: "Opening stock" },
    { itemId: paperItem.id, branchId: headOffice.id, transactionType: "ISSUE", quantity: 15, transactionDate: new Date("2026-03-10"), referenceType: "USAGE", referenceId: paperItem.id, remarks: "Branch usage" },
    { itemId: fileItem.id, branchId: headOffice.id, transactionType: "RECEIPT", quantity: 250, transactionDate: new Date("2026-03-05"), referenceType: "OPENING", referenceId: fileItem.id, remarks: "Opening stock" }
  ] });
  const requisition = await client.requisition.upsert({ where: { requisitionNo: "REQ-2026-0001" }, update: { branchId: headOffice.id, vendorId: vendor.id, requisitionDate: new Date("2026-03-08"), status: "APPROVED", approvalState: "APPROVED", remarks: "Seeded stationery replenishment" }, create: { requisitionNo: "REQ-2026-0001", branchId: headOffice.id, vendorId: vendor.id, requisitionDate: new Date("2026-03-08"), status: "APPROVED", approvalState: "APPROVED", remarks: "Seeded stationery replenishment" } });
  await client.requisitionItem.deleteMany({ where: { requisitionId: requisition.id } });
  await client.requisitionItem.createMany({ data: [ { requisitionId: requisition.id, itemId: paperItem.id, quantity: 50 }, { requisitionId: requisition.id, itemId: fileItem.id, quantity: 100 } ] });
  const stockIssue = await client.stockIssue.upsert({ where: { issueNo: "ISS-2026-0001" }, update: { branchId: headOffice.id, issueDate: new Date("2026-03-12"), issueReason: "Monthly branch stationery issue", approvalState: "APPROVED" }, create: { issueNo: "ISS-2026-0001", branchId: headOffice.id, issueDate: new Date("2026-03-12"), issueReason: "Monthly branch stationery issue", approvalState: "APPROVED" } });
  await client.stockIssueItem.deleteMany({ where: { stockIssueId: stockIssue.id } });
  await client.stockIssueItem.createMany({ data: [ { stockIssueId: stockIssue.id, itemId: paperItem.id, quantity: 10 } ] });
  await client.stockTransfer.upsert({ where: { transferNo: "TRF-2026-0001" }, update: { itemId: paperItem.id, fromBranchId: headOffice.id, toBranchId: puneBranch.id, quantity: 5, transferDate: new Date("2026-03-18"), approvalState: "APPROVED" }, create: { transferNo: "TRF-2026-0001", itemId: paperItem.id, fromBranchId: headOffice.id, toBranchId: puneBranch.id, quantity: 5, transferDate: new Date("2026-03-18"), approvalState: "APPROVED" } });
  await client.stationeryException.deleteMany({ where: { itemId: paperItem.id } });
  await client.stationeryException.create({ data: { itemId: paperItem.id, branchId: headOffice.id, exceptionCode: "LOW_STOCK_ALERT", exceptionMessage: "A4 Copier Paper is approaching reorder level.", severity: "LOW" } });

  const shareClass = await client.shareClass.upsert({ where: { code: "REG-A" }, update: { name: "Regular Member Share", faceValue: 100, dividendRate: 8 }, create: { code: "REG-A", name: "Regular Member Share", faceValue: 100, dividendRate: 8 } });
  const [memberOne, memberTwo] = await Promise.all([
    client.member.upsert({ where: { memberCode: "MEM001" }, update: { memberName: "Pragati Thara", branchId: headOffice.id, panNo: "AAACP1234K", aadhaarNo: "444455556666", kycStatus: "COMPLETED", memberStatus: "ACTIVE", freezeStatus: false, lienStatus: false, registrarRefNo: "REG-2026-001" }, create: { memberCode: "MEM001", memberName: "Pragati Thara", branchId: headOffice.id, panNo: "AAACP1234K", aadhaarNo: "444455556666", kycStatus: "COMPLETED", memberStatus: "ACTIVE", freezeStatus: false, lienStatus: false, registrarRefNo: "REG-2026-001" } }),
    client.member.upsert({ where: { memberCode: "MEM002" }, update: { memberName: "Sanjay Kulkarni", branchId: puneBranch.id, panNo: "AAACT4321L", aadhaarNo: "999900001111", kycStatus: "COMPLETED", memberStatus: "ACTIVE", freezeStatus: false, lienStatus: false, registrarRefNo: "REG-2026-002" }, create: { memberCode: "MEM002", memberName: "Sanjay Kulkarni", branchId: puneBranch.id, panNo: "AAACT4321L", aadhaarNo: "999900001111", kycStatus: "COMPLETED", memberStatus: "ACTIVE", freezeStatus: false, lienStatus: false, registrarRefNo: "REG-2026-002" } })
  ]);
  await Promise.all([
    client.memberKyc.upsert({ where: { memberId: memberOne.id }, update: { panVerified: true, aadhaarVerified: true }, create: { memberId: memberOne.id, panVerified: true, aadhaarVerified: true } }),
    client.memberKyc.upsert({ where: { memberId: memberTwo.id }, update: { panVerified: true, aadhaarVerified: true }, create: { memberId: memberTwo.id, panVerified: true, aadhaarVerified: true } })
  ]);
  const allotment = await client.shareAllotment.upsert({ where: { shareCertificateNo: "SC-0001" }, update: { memberId: memberOne.id, shareClassId: shareClass.id, allotmentDate: new Date("2026-03-01"), noOfShares: 250, paidUpValue: 25000, approvalState: "APPROVED" }, create: { memberId: memberOne.id, shareClassId: shareClass.id, allotmentDate: new Date("2026-03-01"), noOfShares: 250, paidUpValue: 25000, shareCertificateNo: "SC-0001", approvalState: "APPROVED" } });
  await client.shareTransfer.deleteMany({ where: { fromMemberId: memberOne.id, toMemberId: memberTwo.id } });
  const shareTransfer = await client.shareTransfer.create({ data: { fromMemberId: memberOne.id, toMemberId: memberTwo.id, shareClassId: shareClass.id, transferDate: new Date("2026-03-20"), noOfShares: 25, approvalState: "APPROVED", remarks: "Seeded inter-member transfer" } });
  await client.shareRedemption.deleteMany({ where: { memberId: memberOne.id } });
  await client.shareRedemption.create({ data: { memberId: memberOne.id, shareClassId: shareClass.id, redemptionDate: new Date("2026-03-22"), noOfShares: 10, redemptionValue: 1000, approvalState: "APPROVED", remarks: "Seeded redemption sample" } });
  await client.dividendPayment.deleteMany({ where: { memberId: { in: [memberOne.id, memberTwo.id] } } });
  await client.dividendDeclaration.deleteMany({ where: { shareClassId: shareClass.id } });
  const dividendDeclaration = await client.dividendDeclaration.create({ data: { shareClassId: shareClass.id, declarationDate: new Date("2026-03-25"), dividendRate: 8, remarks: "FY 2025-26 interim dividend", approvalState: "APPROVED" } });
  await client.dividendPayment.createMany({ data: [
    { dividendDeclarationId: dividendDeclaration.id, memberId: memberOne.id, noOfShares: 240, dividendAmount: 1920, paymentDate: new Date("2026-03-28"), paymentStatus: "PAID" },
    { dividendDeclarationId: dividendDeclaration.id, memberId: memberTwo.id, noOfShares: 25, dividendAmount: 200, paymentDate: null, paymentStatus: "PENDING" }
  ] });
  await client.shareCapitalException.deleteMany({ where: { memberId: memberTwo.id } });
  await client.shareCapitalException.create({ data: { memberId: memberTwo.id, exceptionCode: "DIVIDEND_PAYMENT_PENDING", exceptionMessage: "Dividend payment is still pending for the transferred member holding.", severity: "LOW" } });

  const [salaryExpense, salaryPayable] = await Promise.all([
    client.ledgerAccount.upsert({ where: { accountCode: "500100" }, update: { accountName: "Staff Salary Expense", accountType: "EXPENSE", branchScoped: true }, create: { accountCode: "500100", accountName: "Staff Salary Expense", accountType: "EXPENSE", branchScoped: true } }),
    client.ledgerAccount.upsert({ where: { accountCode: "210100" }, update: { accountName: "Salary Payable", accountType: "LIABILITY", branchScoped: true }, create: { accountCode: "210100", accountName: "Salary Payable", accountType: "LIABILITY", branchScoped: true } })
  ]);
  await client.moduleLedgerMapping.upsert({ where: { moduleName_eventCode: { moduleName: ModuleName.PAYROLL, eventCode: "PAYROLL_RUN_FINALIZED" } }, update: { debitAccountId: salaryExpense.id, creditAccountId: salaryPayable.id, narrationTemplate: "Payroll posting for run {referenceId}" }, create: { moduleName: ModuleName.PAYROLL, eventCode: "PAYROLL_RUN_FINALIZED", debitAccountId: salaryExpense.id, creditAccountId: salaryPayable.id, narrationTemplate: "Payroll posting for run {referenceId}" } });
  const voucher = await client.voucher.upsert({ where: { voucherNo: "JV-2026-03-0001" }, update: { moduleName: ModuleName.PAYROLL, referenceType: "PayrollRun", referenceId: payrollRun.id, branchId: headOffice.id, postingDate: new Date("2026-03-31"), narration: "Payroll accrual for March 2026", status: "POSTED", totalAmount: 100686, postedById: adminUser.id }, create: { voucherNo: "JV-2026-03-0001", moduleName: ModuleName.PAYROLL, referenceType: "PayrollRun", referenceId: payrollRun.id, branchId: headOffice.id, postingDate: new Date("2026-03-31"), narration: "Payroll accrual for March 2026", status: "POSTED", totalAmount: 100686, postedById: adminUser.id } });
  await client.voucherLine.deleteMany({ where: { voucherId: voucher.id } });
  await client.voucherLine.createMany({ data: [ { voucherId: voucher.id, lineNo: 1, debitAccountId: salaryExpense.id, creditAccountId: salaryPayable.id, amount: 100686, description: "Seeded payroll accrual" } ] });

  await Promise.all([
    client.complianceRule.upsert({ where: { ruleCode: "PAYROLL_KYC_DEFICIENT" }, update: { ruleName: "Payroll KYC Deficiency", moduleName: ModuleName.PAYROLL, entityType: "Employee", severity: "HIGH", triggerType: "DATA_QUALITY", description: "Employee payroll cannot proceed with incomplete KYC" }, create: { ruleCode: "PAYROLL_KYC_DEFICIENT", ruleName: "Payroll KYC Deficiency", moduleName: ModuleName.PAYROLL, entityType: "Employee", severity: "HIGH", triggerType: "DATA_QUALITY", description: "Employee payroll cannot proceed with incomplete KYC" } }),
    client.complianceRule.upsert({ where: { ruleCode: "INVESTMENT_POLICY_LIMIT" }, update: { ruleName: "Investment Policy Limit", moduleName: ModuleName.INVESTMENTS, entityType: "Investment", severity: "MEDIUM", triggerType: "THRESHOLD", description: "Investment exposure has crossed the configured policy limit." }, create: { ruleCode: "INVESTMENT_POLICY_LIMIT", ruleName: "Investment Policy Limit", moduleName: ModuleName.INVESTMENTS, entityType: "Investment", severity: "MEDIUM", triggerType: "THRESHOLD", description: "Investment exposure has crossed the configured policy limit." } })
  ]);
  await client.complianceEvent.deleteMany({ where: { entityId: { in: [employeeTwo.id, investmentTwo.id] } } });
  await client.complianceEvent.createMany({ data: [
    { moduleName: ModuleName.PAYROLL, entityType: "Employee", entityId: employeeTwo.id, ruleCode: "PAYROLL_KYC_DEFICIENT", ruleDescription: "Employee payroll cannot proceed with incomplete KYC", severity: "HIGH", branchId: headOffice.id, status: "OPEN", dueDate: new Date("2026-03-31"), remarks: "Review KYC before payroll finalization" },
    { moduleName: ModuleName.INVESTMENTS, entityType: "Investment", entityId: investmentTwo.id, ruleCode: "INVESTMENT_POLICY_LIMIT", ruleDescription: "Investment exposure has crossed the configured policy limit.", severity: "MEDIUM", branchId: headOffice.id, status: "OPEN", dueDate: new Date("2026-04-05"), remarks: "Treasury monitoring required" }
  ] });
  await client.complianceCalendarItem.deleteMany({ where: { title: { in: ["Monthly PF Remittance", "Quarterly Investment Review"] } } });
  await client.complianceCalendarItem.createMany({ data: [
    { title: "Monthly PF Remittance", moduleName: ModuleName.PAYROLL, frequency: "MONTHLY", dueDate: new Date("2026-03-25"), branchId: headOffice.id, status: "UPCOMING", remarks: "Remit PF deductions" },
    { title: "Quarterly Investment Review", moduleName: ModuleName.INVESTMENTS, frequency: "QUARTERLY", dueDate: new Date("2026-03-31"), branchId: headOffice.id, status: "UPCOMING", remarks: "Board policy review support" }
  ] });

  await client.notification.deleteMany({ where: { title: { in: ["Seeded compliance reminder", "Payroll review pending", "Asset insurance renewal pending", "Stationery reorder alert"] } } });
  await client.notification.createMany({ data: [
    { userId: adminUser.id, branchId: headOffice.id, moduleName: ModuleName.COMPLIANCE, title: "Seeded compliance reminder", message: "Phase 5 seed data initialized successfully.", severity: "INFO" },
    { userId: branchManager.id, branchId: puneBranch.id, moduleName: ModuleName.PAYROLL, title: "Payroll review pending", message: "March payroll has a KYC exception awaiting review.", severity: "WARNING" },
    { userId: adminUser.id, branchId: headOffice.id, moduleName: ModuleName.ASSETS, title: "Asset insurance renewal pending", message: "AST001 insurance is expired and requires renewal before audit review.", severity: "HIGH" },
    { userId: branchManager.id, branchId: puneBranch.id, moduleName: ModuleName.STATIONERY, title: "Stationery reorder alert", message: "A4 Copier Paper is nearing reorder threshold for the branch demo cycle.", severity: "LOW" }
  ] });
  await client.documentAttachment.deleteMany({ where: { fileName: { in: ["salary-register-march-2026.csv", "investment-review-note.pdf", "asset-verification-sheet-ast001.pdf", "stationery-requisition-req-2026-0001.pdf"] } } });
  await client.documentAttachment.createMany({ data: [
    { moduleName: ModuleName.PAYROLL, entityType: "PayrollRun", entityId: payrollRun.id, documentType: "REPORT", fileName: "salary-register-march-2026.csv", filePath: "/seed-documents/payroll/salary-register-march-2026.csv", mimeType: "text/csv", branchId: headOffice.id, uploadedById: adminUser.id },
    { moduleName: ModuleName.INVESTMENTS, entityType: "Investment", entityId: investmentTwo.id, documentType: "BOARD_NOTE", fileName: "investment-review-note.pdf", filePath: "/seed-documents/investments/investment-review-note.pdf", mimeType: "application/pdf", branchId: headOffice.id, uploadedById: adminUser.id },
    { moduleName: ModuleName.ASSETS, entityType: "Asset", entityId: asset.id, documentType: "VERIFICATION_SHEET", fileName: "asset-verification-sheet-ast001.pdf", filePath: "/seed-documents/assets/asset-verification-sheet-ast001.pdf", mimeType: "application/pdf", branchId: headOffice.id, uploadedById: adminUser.id },
    { moduleName: ModuleName.STATIONERY, entityType: "Requisition", entityId: requisition.id, documentType: "REQUISITION_NOTE", fileName: "stationery-requisition-req-2026-0001.pdf", filePath: "/seed-documents/stationery/stationery-requisition-req-2026-0001.pdf", mimeType: "application/pdf", branchId: headOffice.id, uploadedById: branchManager.id }
  ] });

  const [payrollReportDefinition, complianceReportDefinition, assetReportDefinition, stationeryReportDefinition] = await Promise.all([
    client.reportDefinition.upsert({ where: { reportCode: "PAYROLL_SALARY_REGISTER" }, update: { reportName: "Payroll Salary Register", moduleName: ModuleName.REPORTING, description: "Monthly payroll salary register export", defaultFormat: "CSV", queryKey: "payroll.salary-register" }, create: { reportCode: "PAYROLL_SALARY_REGISTER", reportName: "Payroll Salary Register", moduleName: ModuleName.REPORTING, description: "Monthly payroll salary register export", defaultFormat: "CSV", queryKey: "payroll.salary-register" } }),
    client.reportDefinition.upsert({ where: { reportCode: "COMPLIANCE_EXCEPTION_REGISTER" }, update: { reportName: "Compliance Exception Register", moduleName: ModuleName.REPORTING, description: "Open compliance event register", defaultFormat: "CSV", queryKey: "compliance.events" }, create: { reportCode: "COMPLIANCE_EXCEPTION_REGISTER", reportName: "Compliance Exception Register", moduleName: ModuleName.REPORTING, description: "Open compliance event register", defaultFormat: "CSV", queryKey: "compliance.events" } }),
    client.reportDefinition.upsert({ where: { reportCode: "ASSET_REGISTER" }, update: { reportName: "Asset Register", moduleName: ModuleName.REPORTING, description: "Fixed asset register export", defaultFormat: "EXCEL", queryKey: "assets.register" }, create: { reportCode: "ASSET_REGISTER", reportName: "Asset Register", moduleName: ModuleName.REPORTING, description: "Fixed asset register export", defaultFormat: "EXCEL", queryKey: "assets.register" } }),
    client.reportDefinition.upsert({ where: { reportCode: "STATIONERY_STOCK_REGISTER" }, update: { reportName: "Stationery Stock Register", moduleName: ModuleName.REPORTING, description: "Stationery stock movement export", defaultFormat: "PDF", queryKey: "stationery.stock-register" }, create: { reportCode: "STATIONERY_STOCK_REGISTER", reportName: "Stationery Stock Register", moduleName: ModuleName.REPORTING, description: "Stationery stock movement export", defaultFormat: "PDF", queryKey: "stationery.stock-register" } })
  ]);
  await client.reportGeneration.deleteMany({ where: { outputFileName: { in: ["salary-register-seed.csv", "compliance-exception-register.csv", "asset-register-seed.xlsx", "stationery-stock-register-seed.pdf"] } } });
  await client.reportGeneration.createMany({ data: [
    { reportDefinitionId: payrollReportDefinition.id, format: "CSV", status: "GENERATED", outputFileName: "salary-register-seed.csv", outputMimeType: "text/csv", branchId: headOffice.id, generatedById: adminUser.id, filters: { month: 3, year: 2026 } },
    { reportDefinitionId: complianceReportDefinition.id, format: "CSV", status: "GENERATED", outputFileName: "compliance-exception-register.csv", outputMimeType: "text/csv", branchId: headOffice.id, generatedById: adminUser.id, filters: { status: "OPEN" } },
    { reportDefinitionId: assetReportDefinition.id, format: "EXCEL", status: "GENERATED", outputFileName: "asset-register-seed.xlsx", outputMimeType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", branchId: headOffice.id, generatedById: adminUser.id, filters: { status: "ACTIVE" } },
    { reportDefinitionId: stationeryReportDefinition.id, format: "PDF", status: "GENERATED", outputFileName: "stationery-stock-register-seed.pdf", outputMimeType: "application/pdf", branchId: headOffice.id, generatedById: branchManager.id, filters: { branchCode: "HO001" } }
  ] });

  await client.approvalHistory.deleteMany({});
  await client.approvalTask.deleteMany({ where: { title: { in: ["Approve share allotment SC-0001", "Approve payroll run PR-2026-03-HO", "Approve investment limit exception INV002", "Approve asset disposal AST002", "Approve leave request for EMP002"] } } });
  const [shareApprovalTask, payrollApprovalTask, investmentApprovalTask, assetApprovalTask, leaveApprovalTask] = await Promise.all([
    client.approvalTask.create({ data: { moduleName: ModuleName.SHARE_CAPITAL, entityType: "ShareAllotment", entityId: allotment.id, title: "Approve share allotment SC-0001", status: "PENDING", approvalState: "PENDING_APPROVAL", assignedRoleCode: "HO_ADMIN", assignedUserId: adminUser.id, branchId: headOffice.id, requestedBy: adminUser.id, reason: "Seeded approval task" } }),
    client.approvalTask.create({ data: { moduleName: ModuleName.PAYROLL, entityType: "PayrollRun", entityId: payrollRun.id, title: "Approve payroll run PR-2026-03-HO", status: "PENDING", approvalState: "PENDING_APPROVAL", assignedRoleCode: "HO_ADMIN", assignedUserId: adminUser.id, branchId: headOffice.id, requestedBy: branchManager.id, reason: "Seeded payroll approval task" } }),
    client.approvalTask.create({ data: { moduleName: ModuleName.INVESTMENTS, entityType: "InvestmentException", entityId: investmentTwo.id, title: "Approve investment limit exception INV002", status: "PENDING", approvalState: "PENDING_APPROVAL", assignedRoleCode: "HO_ADMIN", assignedUserId: adminUser.id, branchId: headOffice.id, requestedBy: branchManager.id, reason: "Seeded investment monitoring approval" } }),
    client.approvalTask.create({ data: { moduleName: ModuleName.ASSETS, entityType: "AssetDisposal", entityId: assetDisposal.id, title: "Approve asset disposal AST002", status: "PENDING", approvalState: "PENDING_APPROVAL", assignedRoleCode: "HO_ADMIN", assignedUserId: adminUser.id, branchId: puneBranch.id, requestedBy: branchManager.id, reason: "Seeded asset disposal approval" } }),
    client.approvalTask.create({ data: { moduleName: ModuleName.PAYROLL, entityType: "LeaveRecord", entityId: pendingLeave.id, title: "Approve leave request for EMP002", status: "PENDING", approvalState: "PENDING_APPROVAL", assignedRoleCode: "BRANCH_MANAGER", assignedUserId: branchManager.id, branchId: headOffice.id, requestedBy: branchOperator.id, reason: "Seeded leave request approval" } })
  ]);
  await client.approvalHistory.createMany({ data: [
    { approvalTaskId: shareApprovalTask.id, action: "SUBMITTED", actionById: adminUser.id, reason: "Seeded workflow submission" },
    { approvalTaskId: payrollApprovalTask.id, action: "SUBMITTED", actionById: branchManager.id, reason: "Payroll run moved to approval" },
    { approvalTaskId: investmentApprovalTask.id, action: "SUBMITTED", actionById: branchManager.id, reason: "Exposure exception moved to HO review" },
    { approvalTaskId: assetApprovalTask.id, action: "SUBMITTED", actionById: branchManager.id, reason: "Disposed asset sent for sign-off" },
    { approvalTaskId: leaveApprovalTask.id, action: "SUBMITTED", actionById: branchOperator.id, reason: "Employee leave application entered for manager approval" }
  ] });
  await client.auditLog.deleteMany({ where: { requestId: { in: ["seed-login-001", "seed-payroll-001", "seed-investment-001", "seed-asset-001", "seed-stationery-001", "seed-share-001"] } } });
  await client.auditLog.createMany({ data: [
    { moduleName: ModuleName.AUTH, entityName: "User", entityId: adminUser.id, action: "LOGIN", requestId: "seed-login-001", userId: adminUser.id, branchId: headOffice.id, newValues: { username: "admin.ho" } },
    { moduleName: ModuleName.PAYROLL, entityName: "PayrollRun", entityId: payrollRun.id, action: "CREATE", requestId: "seed-payroll-001", userId: branchManager.id, branchId: headOffice.id, newValues: { runCode: "PR-2026-03-HO", status: "CALCULATED" } },
    { moduleName: ModuleName.INVESTMENTS, entityName: "Investment", entityId: investmentTwo.id, action: "UPDATE", requestId: "seed-investment-001", userId: adminUser.id, branchId: headOffice.id, oldValues: { policyLimit: 6500000 }, newValues: { totalExposure: 7450000 } },
    { moduleName: ModuleName.ASSETS, entityName: "AssetDisposal", entityId: assetDisposal.id, action: "CREATE", requestId: "seed-asset-001", userId: branchManager.id, branchId: puneBranch.id, newValues: { assetCode: "AST002", disposalValue: 48000 } },
    { moduleName: ModuleName.STATIONERY, entityName: "StockIssue", entityId: stockIssue.id, action: "CREATE", requestId: "seed-stationery-001", userId: branchOperator.id, branchId: headOffice.id, newValues: { issueNo: "ISS-2026-0001" } },
    { moduleName: ModuleName.SHARE_CAPITAL, entityName: "ShareTransfer", entityId: shareTransfer.id, action: "CREATE", requestId: "seed-share-001", userId: adminUser.id, branchId: puneBranch.id, newValues: { fromMember: "MEM001", toMember: "MEM002", shares: 25 } }
  ] });
};

const main = async (): Promise<void> => {
  await seedDatabase(prisma);
};

main()
  .then(async () => prisma.$disconnect())
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
