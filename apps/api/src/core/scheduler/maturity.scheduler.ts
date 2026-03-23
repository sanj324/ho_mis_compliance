import { logger } from "../../config/logger.js";
import { complianceEngineService } from "../compliance/compliance-engine.service.js";

let maturitySchedulerStarted = false;

export const registerMaturityScheduler = () => {
  if (maturitySchedulerStarted) {
    return;
  }
  maturitySchedulerStarted = true;
  setInterval(() => {
    void complianceEngineService.evaluateModule("INVESTMENTS").catch((error) => {
      logger.error({ error }, "Maturity scheduler run failed");
    });
  }, 6 * 60 * 60 * 1000);
};
