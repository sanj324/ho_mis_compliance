import { logger } from "../../config/logger.js";
import { complianceEngineService } from "../compliance/compliance-engine.service.js";

let complianceSchedulerStarted = false;

export const registerComplianceScheduler = () => {
  if (complianceSchedulerStarted) {
    return;
  }
  complianceSchedulerStarted = true;
  setInterval(() => {
    void complianceEngineService.evaluateModule().catch((error) => {
      logger.error({ error }, "Compliance scheduler run failed");
    });
  }, 60 * 60 * 1000);
};
