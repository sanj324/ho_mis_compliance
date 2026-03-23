import type { Request, Response } from "express";

import { sendSuccess } from "../../common/utils/response.js";
import { ledgerService } from "./ledger.service.js";

export class LedgerController {
  async listAccounts(_request: Request, response: Response) {
    const accounts = await ledgerService.listAccounts();
    sendSuccess(response, "Ledger accounts fetched successfully", accounts);
  }

  async listVouchers(_request: Request, response: Response) {
    const vouchers = await ledgerService.listVouchers();
    sendSuccess(response, "Vouchers fetched successfully", vouchers);
  }

  async postPayroll(request: Request, response: Response) {
    const voucher = await ledgerService.postPayroll(
      typeof request.params.runId === "string" ? request.params.runId : "",
      request.context.userId
    );
    sendSuccess(response, "Payroll voucher posted successfully", voucher);
  }

  async postInvestment(request: Request, response: Response) {
    const voucher = await ledgerService.postInvestment(
      typeof request.params.id === "string" ? request.params.id : "",
      request.context.userId
    );
    sendSuccess(response, "Investment voucher posted successfully", voucher);
  }

  async postAsset(request: Request, response: Response) {
    const voucher = await ledgerService.postAsset(
      typeof request.params.id === "string" ? request.params.id : "",
      request.context.userId
    );
    sendSuccess(response, "Asset voucher posted successfully", voucher);
  }

  async postStationery(request: Request, response: Response) {
    const voucher = await ledgerService.postStationery(
      typeof request.params.id === "string" ? request.params.id : "",
      request.context.userId
    );
    sendSuccess(response, "Stationery voucher posted successfully", voucher);
  }

  async postShareCapital(request: Request, response: Response) {
    const voucher = await ledgerService.postShareCapital(
      typeof request.params.id === "string" ? request.params.id : "",
      request.context.userId
    );
    sendSuccess(response, "Share capital voucher posted successfully", voucher);
  }
}

export const ledgerController = new LedgerController();
