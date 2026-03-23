import { StatusCodes } from "http-status-codes";

import { AppError } from "../../common/errors/app-error.js";
import { mapAssetPosting } from "./posting-mappers/assets.mapper.js";
import { mapInvestmentPosting } from "./posting-mappers/investments.mapper.js";
import { mapPayrollPosting } from "./posting-mappers/payroll.mapper.js";
import { mapShareCapitalPosting } from "./posting-mappers/shareCapital.mapper.js";
import { mapStationeryPosting } from "./posting-mappers/stationery.mapper.js";
import { ledgerRepository } from "./ledger.repository.js";
import { postingEngineService } from "./posting-engine.service.js";

export class LedgerService {
  listAccounts() {
    return ledgerRepository.listAccounts();
  }

  listVouchers() {
    return ledgerRepository.listVouchers();
  }

  async postPayroll(runId: string, userId?: string | null) {
    const payload = await mapPayrollPosting(runId);
    if (!payload) {
      throw new AppError("Payroll run not found", StatusCodes.NOT_FOUND);
    }
    return postingEngineService.post({ ...payload, ...(userId !== undefined ? { postedById: userId } : {}) });
  }

  async postInvestment(id: string, userId?: string | null) {
    const payload = await mapInvestmentPosting(id);
    if (!payload) {
      throw new AppError("Investment not found", StatusCodes.NOT_FOUND);
    }
    return postingEngineService.post({ ...payload, ...(userId !== undefined ? { postedById: userId } : {}) });
  }

  async postAsset(id: string, userId?: string | null) {
    const payload = await mapAssetPosting(id);
    if (!payload) {
      throw new AppError("Asset not found", StatusCodes.NOT_FOUND);
    }
    return postingEngineService.post({ ...payload, ...(userId !== undefined ? { postedById: userId } : {}) });
  }

  async postStationery(id: string, userId?: string | null) {
    const payload = await mapStationeryPosting(id);
    if (!payload) {
      throw new AppError("Stock issue not found", StatusCodes.NOT_FOUND);
    }
    return postingEngineService.post({ ...payload, ...(userId !== undefined ? { postedById: userId } : {}) });
  }

  async postShareCapital(id: string, userId?: string | null) {
    const payload = await mapShareCapitalPosting(id);
    if (!payload) {
      throw new AppError("Share allotment not found", StatusCodes.NOT_FOUND);
    }
    return postingEngineService.post({ ...payload, ...(userId !== undefined ? { postedById: userId } : {}) });
  }
}

export const ledgerService = new LedgerService();
