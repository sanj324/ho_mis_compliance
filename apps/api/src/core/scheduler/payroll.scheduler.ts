import { logger } from "../../config/logger.js";
import { complianceEngineService } from "../compliance/compliance-engine.service.js";

let payrollSchedulerStarted = false;

export const registerPayrollScheduler = () => {
  if (payrollSchedulerStarted) {
    return;
  }
  payrollSchedulerStarted = true;
  setInterval(() => {
    void complianceEngineService.evaluateModule("PAYROLL").catch((error) => {
      logger.error({ error }, "Payroll scheduler run failed");
    });
  }, 4 * 60 * 60 * 1000);
};
