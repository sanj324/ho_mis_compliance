import { logger } from "../../config/logger.js";
import { complianceEngineService } from "../compliance/compliance-engine.service.js";

let insuranceSchedulerStarted = false;

export const registerInsuranceScheduler = () => {
  if (insuranceSchedulerStarted) {
    return;
  }
  insuranceSchedulerStarted = true;
  setInterval(() => {
    void complianceEngineService.evaluateModule("ASSETS").catch((error) => {
      logger.error({ error }, "Insurance scheduler run failed");
    });
  }, 6 * 60 * 60 * 1000);
};
