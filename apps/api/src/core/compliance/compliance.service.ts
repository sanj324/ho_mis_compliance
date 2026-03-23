import { StatusCodes } from "http-status-codes";

import { AppError } from "../../common/errors/app-error.js";
import { complianceRepository } from "./compliance.repository.js";
import { complianceEngineService } from "./compliance-engine.service.js";

export class ComplianceService {
  listEvents(filters?: { status?: string; moduleName?: string; branchId?: string }) {
    return complianceRepository.listEvents(filters);
  }

  getCalendar(branchId?: string) {
    return complianceRepository.getCalendar(branchId);
  }

  async dashboardSummary() {
    const [openEvents, highSeverityOpen, overdueCalendarItems, upcomingCalendarItems, moduleSummary] =
      await complianceRepository.dashboardSummary();

    return {
      openEvents,
      highSeverityOpen,
      overdueCalendarItems,
      upcomingCalendarItems,
      byModule: moduleSummary.map((item) => ({
        moduleName: item.moduleName,
        count: item._count._all
      }))
    };
  }

  runEvaluation(moduleName?: string) {
    return complianceEngineService.evaluateModule(moduleName);
  }

  async closeEvent(id: string, input: { remarks: string }, userId?: string | null) {
    const event = await complianceRepository.findEventById(id);
    if (!event) {
      throw new AppError("Compliance event not found", StatusCodes.NOT_FOUND);
    }

    return complianceRepository.closeEvent(id, userId ?? undefined, input.remarks);
  }
}

export const complianceService = new ComplianceService();
