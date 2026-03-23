import { Router } from "express";

import { authMiddleware } from "../../common/middleware/auth.middleware.js";
import { requirePermissions } from "../../core/rbac/rbac.middleware.js";
import { attendanceController } from "./attendance/attendance.controller.js";
import { bulkAttendanceSchema } from "./attendance/attendance.validator.js";
import { payrollDashboardController } from "./dashboard/payrollDashboard.controller.js";
import { employeeController } from "./employee/employee.controller.js";
import { createEmployeeSchema, updateEmployeeSchema } from "./employee/employee.validator.js";
import { leaveController } from "./leave/leave.controller.js";
import { createLeaveSchema } from "./leave/leave.validator.js";
import { payrollRunController } from "./payroll-run/payrollRun.controller.js";
import { calculatePayrollSchema, finalizePayrollSchema } from "./payroll-run/payrollRun.validator.js";
import { payrollReportController } from "./reports/payrollReport.controller.js";
import { salaryStructureController } from "./salary-structure/salaryStructure.controller.js";
import { createSalaryStructureSchema } from "./salary-structure/salaryStructure.validator.js";
import { statutoryController } from "./statutory/statutory.controller.js";
import { createStatutorySetupSchema } from "./statutory/statutory.validator.js";

export const payrollRoutes = Router();

payrollRoutes.use(authMiddleware);

payrollRoutes.get("/employees", requirePermissions("payroll.read"), async (request, response, next) => {
  try {
    await employeeController.list(request, response);
  } catch (error) {
    next(error);
  }
});
payrollRoutes.get("/employees/:id", requirePermissions("payroll.read"), async (request, response, next) => {
  try {
    await employeeController.getById(request, response);
  } catch (error) {
    next(error);
  }
});
payrollRoutes.post("/employees", requirePermissions("payroll.create"), async (request, response, next) => {
  try {
    request.body = createEmployeeSchema.parse(request.body);
    await employeeController.create(request, response);
  } catch (error) {
    next(error);
  }
});
payrollRoutes.patch("/employees/:id", requirePermissions("payroll.update"), async (request, response, next) => {
  try {
    request.body = updateEmployeeSchema.parse(request.body);
    await employeeController.update(request, response);
  } catch (error) {
    next(error);
  }
});

payrollRoutes.get("/attendance", requirePermissions("payroll.read"), async (request, response, next) => {
  try {
    await attendanceController.list(request, response);
  } catch (error) {
    next(error);
  }
});
payrollRoutes.post("/attendance/bulk", requirePermissions("payroll.create"), async (request, response, next) => {
  try {
    request.body = bulkAttendanceSchema.parse(request.body);
    await attendanceController.bulkUpsert(request, response);
  } catch (error) {
    next(error);
  }
});

payrollRoutes.get("/salary-structures", requirePermissions("payroll.read"), async (request, response, next) => {
  try {
    await salaryStructureController.list(request, response);
  } catch (error) {
    next(error);
  }
});
payrollRoutes.post("/salary-structures", requirePermissions("payroll.create"), async (request, response, next) => {
  try {
    request.body = createSalaryStructureSchema.parse(request.body);
    await salaryStructureController.create(request, response);
  } catch (error) {
    next(error);
  }
});

payrollRoutes.get("/leaves", requirePermissions("payroll.read"), async (request, response, next) => {
  try {
    await leaveController.list(request, response);
  } catch (error) {
    next(error);
  }
});
payrollRoutes.post("/leaves", requirePermissions("payroll.create"), async (request, response, next) => {
  try {
    request.body = createLeaveSchema.parse(request.body);
    await leaveController.create(request, response);
  } catch (error) {
    next(error);
  }
});

payrollRoutes.get("/runs", requirePermissions("payroll.read"), async (request, response, next) => {
  try {
    await payrollRunController.list(request, response);
  } catch (error) {
    next(error);
  }
});
payrollRoutes.get("/runs/:id", requirePermissions("payroll.read"), async (request, response, next) => {
  try {
    await payrollRunController.getById(request, response);
  } catch (error) {
    next(error);
  }
});
payrollRoutes.post("/runs/calculate", requirePermissions("payroll.create"), async (request, response, next) => {
  try {
    request.body = calculatePayrollSchema.parse(request.body);
    await payrollRunController.calculate(request, response);
  } catch (error) {
    next(error);
  }
});
payrollRoutes.post("/runs/finalize", requirePermissions("payroll.finalize"), async (request, response, next) => {
  try {
    request.body = finalizePayrollSchema.parse(request.body);
    await payrollRunController.finalize(request, response);
  } catch (error) {
    next(error);
  }
});

payrollRoutes.get("/dashboard/summary", requirePermissions("payroll.read"), async (request, response, next) => {
  try {
    await payrollDashboardController.summary(request, response);
  } catch (error) {
    next(error);
  }
});

payrollRoutes.get("/reports/salary-register", requirePermissions("payroll.reports"), async (request, response, next) => {
  try {
    await payrollReportController.salaryRegister(request, response);
  } catch (error) {
    next(error);
  }
});
payrollRoutes.get("/reports/statutory-deductions", requirePermissions("payroll.reports"), async (request, response, next) => {
  try {
    await payrollReportController.statutoryDeductions(request, response);
  } catch (error) {
    next(error);
  }
});
payrollRoutes.get("/reports/employee-exceptions", requirePermissions("payroll.reports"), async (request, response, next) => {
  try {
    await payrollReportController.employeeExceptions(request, response);
  } catch (error) {
    next(error);
  }
});

payrollRoutes.get("/statutory", requirePermissions("payroll.read"), async (request, response, next) => {
  try {
    await statutoryController.getCurrent(request, response);
  } catch (error) {
    next(error);
  }
});
payrollRoutes.post("/statutory", requirePermissions("payroll.create"), async (request, response, next) => {
  try {
    request.body = createStatutorySetupSchema.parse(request.body);
    await statutoryController.create(request, response);
  } catch (error) {
    next(error);
  }
});
