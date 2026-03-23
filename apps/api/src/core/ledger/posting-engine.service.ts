import { StatusCodes } from "http-status-codes";

import { AppError } from "../../common/errors/app-error.js";
import { ledgerRepository } from "./ledger.repository.js";

export class PostingEngineService {
  async post(input: {
    moduleName: "PAYROLL" | "INVESTMENTS" | "ASSETS" | "STATIONERY" | "SHARE_CAPITAL";
    eventCode: string;
    referenceType: string;
    referenceId: string;
    branchId?: string | null;
    postingDate: Date;
    amount: number;
    narration: string;
    postedById?: string | null;
  }) {
    const mapping = await ledgerRepository.findMapping(input.moduleName, input.eventCode);
    if (!mapping) {
      throw new AppError(`Ledger mapping not found for ${input.moduleName}/${input.eventCode}`, StatusCodes.BAD_REQUEST);
    }

    const voucherNo = `VCH-${input.moduleName.slice(0, 3)}-${Date.now()}`;
    return ledgerRepository.createVoucher({
      voucherNo,
      moduleName: input.moduleName,
      referenceType: input.referenceType,
      referenceId: input.referenceId,
      ...(input.branchId ? { branch: { connect: { id: input.branchId } } } : {}),
      postingDate: input.postingDate,
      narration: input.narration,
      status: "POSTED",
      totalAmount: input.amount,
      ...(input.postedById ? { postedBy: { connect: { id: input.postedById } } } : {}),
      lines: {
        create: [
          {
            lineNo: 1,
            debitAccount: { connect: { id: mapping.debitAccountId } },
            creditAccount: { connect: { id: mapping.creditAccountId } },
            amount: input.amount,
            description: input.narration
          }
        ]
      }
    });
  }
}

export const postingEngineService = new PostingEngineService();
