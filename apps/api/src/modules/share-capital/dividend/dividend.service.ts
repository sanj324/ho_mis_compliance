import { StatusCodes } from "http-status-codes";
import { PrismaClient } from "@prisma/client";

import { AppError } from "../../../common/errors/app-error.js";
import { AuditActionEnum } from "../../../common/enums/audit-action.enum.js";
import {
  DividendPaymentStatusEnum,
  MemberKycStatusEnum,
  ShareCapitalExceptionSeverityEnum
} from "../../../common/enums/share-capital.enum.js";
import { memberService } from "../member/member.service.js";
import { shareClassRepository } from "../share-class/shareClass.repository.js";
import { dividendRepository } from "./dividend.repository.js";

const prisma = new PrismaClient();

type AuditContext = {
  requestId: string;
  userId: string | null;
  branchId: string | null;
};

export class DividendService {
  list() {
    return dividendRepository.listDeclarations();
  }

  async declare(
    input: { shareClassId: string; declarationDate: string; dividendRate: number; remarks?: string },
    context: AuditContext
  ) {
    const shareClass = await shareClassRepository.findById(input.shareClassId);
    if (!shareClass) {
      throw new AppError("Share class not found", StatusCodes.NOT_FOUND);
    }

    const declaration = await dividendRepository.createDeclaration({
      shareClass: { connect: { id: input.shareClassId } },
      declarationDate: new Date(input.declarationDate),
      dividendRate: input.dividendRate,
      ...(input.remarks ? { remarks: input.remarks } : {}),
      approvalState: "PENDING_APPROVAL"
    });

    const members = await prisma.member.findMany({
      include: { memberKyc: true }
    });

    const paymentRows: Array<{
      dividendDeclarationId: string;
      memberId: string;
      noOfShares: number;
      dividendAmount: number;
      paymentStatus: string;
    }> = [];

    for (const member of members) {
      const balance = await memberService.getShareBalance(member.id, input.shareClassId);
      if (balance <= 0) {
        continue;
      }

      const eligible = !member.freezeStatus && member.kycStatus === MemberKycStatusEnum.COMPLETED;
      const paymentStatus = eligible ? DividendPaymentStatusEnum.PENDING : DividendPaymentStatusEnum.HOLD;

      if (!eligible) {
        await prisma.shareCapitalException.create({
          data: {
            member: { connect: { id: member.id } },
            exceptionCode: "DIVIDEND_HOLD",
            exceptionMessage: "Dividend held due to freeze flag or deficient KYC",
            severity: ShareCapitalExceptionSeverityEnum.MEDIUM
          }
        });
      }

      paymentRows.push({
        dividendDeclarationId: declaration.id,
        memberId: member.id,
        noOfShares: balance,
        dividendAmount: Number(shareClass.faceValue) * balance * (input.dividendRate / 100),
        paymentStatus
      });
    }

    if (paymentRows.length > 0) {
      await dividendRepository.createPayments(paymentRows);
    }

    await prisma.auditLog.create({
      data: {
        moduleName: "SHARE_CAPITAL",
        entityName: "DividendDeclaration",
        entityId: declaration.id,
        action: AuditActionEnum.CREATE,
        requestId: context.requestId,
        ...(context.userId ? { user: { connect: { id: context.userId } } } : {}),
        ...(context.branchId ? { branch: { connect: { id: context.branchId } } } : {}),
        newValues: {
          declaration,
          paymentCount: paymentRows.length
        }
      }
    });

    return {
      declaration,
      paymentCount: paymentRows.length
    };
  }
}

export const dividendService = new DividendService();
