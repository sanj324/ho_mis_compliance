import { StatusCodes } from "http-status-codes";
import { PrismaClient } from "@prisma/client";

import { AppError } from "../../../common/errors/app-error.js";
import { AuditActionEnum } from "../../../common/enums/audit-action.enum.js";
import { exposureService } from "../exposure/exposure.service.js";
import { maturityService } from "../maturity/maturity.service.js";
import { investmentRepository } from "./investment.repository.js";
import type { InvestmentFilters, InvestmentInput } from "./investment.types.js";

const prisma = new PrismaClient();

export class InvestmentService {
  list(filters: InvestmentFilters) {
    return investmentRepository.findMany(filters);
  }

  async create(
    input: InvestmentInput,
    context: { requestId: string; userId: string | null; branchId: string | null }
  ) {
    const investment = await investmentRepository.create({
      investmentCode: input.investmentCode,
      securityName: input.securityName,
      ...(input.isin ? { isin: input.isin } : {}),
      branch: { connect: { id: input.branchId } },
      securityType: { connect: { id: input.securityTypeId } },
      ...(input.issuerId ? { issuer: { connect: { id: input.issuerId } } } : {}),
      ...(input.counterpartyId ? { counterparty: { connect: { id: input.counterpartyId } } } : {}),
      ...(input.brokerId ? { broker: { connect: { id: input.brokerId } } } : {}),
      classification: input.classification,
      purchaseDate: new Date(input.purchaseDate),
      ...(input.maturityDate ? { maturityDate: new Date(input.maturityDate) } : {}),
      ...(input.couponRate !== undefined ? { couponRate: input.couponRate } : {}),
      faceValue: input.faceValue,
      bookValue: input.bookValue,
      ...(input.marketValue !== undefined ? { marketValue: input.marketValue } : {}),
      ...(input.yieldRate !== undefined ? { yieldRate: input.yieldRate } : {}),
      ...(input.rating ? { rating: input.rating } : {}),
      ...(input.policyLimit !== undefined ? { policyLimit: input.policyLimit } : {}),
      approvalState: "PENDING_APPROVAL"
    });

    const checks = await exposureService.checks(input.branchId);
    const breaches = checks.exceptions.filter(
      (item) => String(item.investmentCode) === input.investmentCode
    );

    for (const breach of breaches) {
      await investmentRepository.createException({
        investment: { connect: { id: investment.id } },
        exceptionCode: String(breach.exceptionCode),
        exceptionMessage: String(breach.message),
        severity: String(breach.severity)
      });
    }

    await prisma.auditLog.create({
      data: {
        moduleName: "INVESTMENTS",
        entityName: "Investment",
        entityId: investment.id,
        action: AuditActionEnum.CREATE,
        requestId: context.requestId,
        ...(context.userId ? { user: { connect: { id: context.userId } } } : {}),
        ...(context.branchId ? { branch: { connect: { id: context.branchId } } } : {}),
        newValues: investment
      }
    });

    return investmentRepository.findById(investment.id);
  }

  async update(
    id: string,
    input: Partial<InvestmentInput>,
    context: { requestId: string; userId: string | null; branchId: string | null }
  ) {
    const existing = await investmentRepository.findById(id);
    if (!existing) {
      throw new AppError("Investment not found", StatusCodes.NOT_FOUND);
    }

    const investment = await investmentRepository.update(id, {
      ...(input.securityName !== undefined ? { securityName: input.securityName } : {}),
      ...(input.securityTypeId ? { securityType: { connect: { id: input.securityTypeId } } } : {}),
      ...(input.issuerId !== undefined
        ? input.issuerId
          ? { issuer: { connect: { id: input.issuerId } } }
          : { issuer: { disconnect: true } }
        : {}),
      ...(input.counterpartyId !== undefined
        ? input.counterpartyId
          ? { counterparty: { connect: { id: input.counterpartyId } } }
          : { counterparty: { disconnect: true } }
        : {}),
      ...(input.brokerId !== undefined
        ? input.brokerId
          ? { broker: { connect: { id: input.brokerId } } }
          : { broker: { disconnect: true } }
        : {}),
      ...(input.classification !== undefined ? { classification: input.classification } : {}),
      ...(input.purchaseDate ? { purchaseDate: new Date(input.purchaseDate) } : {}),
      ...(input.maturityDate !== undefined
        ? input.maturityDate
          ? { maturityDate: new Date(input.maturityDate) }
          : { maturityDate: null }
        : {}),
      ...(input.couponRate !== undefined ? { couponRate: input.couponRate } : {}),
      ...(input.faceValue !== undefined ? { faceValue: input.faceValue } : {}),
      ...(input.bookValue !== undefined ? { bookValue: input.bookValue } : {}),
      ...(input.marketValue !== undefined ? { marketValue: input.marketValue } : {}),
      ...(input.yieldRate !== undefined ? { yieldRate: input.yieldRate } : {}),
      ...(input.rating !== undefined ? { rating: input.rating } : {}),
      ...(input.policyLimit !== undefined ? { policyLimit: input.policyLimit } : {}),
      approvalState: "PENDING_APPROVAL"
    });

    if (input.classification && input.classification !== existing.classification) {
      await investmentRepository.createException({
        investment: { connect: { id } },
        exceptionCode: "CLASSIFICATION_CHANGED",
        exceptionMessage: `Classification changed from ${existing.classification} to ${input.classification}`,
        severity: "LOW"
      });
    }

    await prisma.auditLog.create({
      data: {
        moduleName: "INVESTMENTS",
        entityName: "Investment",
        entityId: investment.id,
        action: AuditActionEnum.UPDATE,
        requestId: context.requestId,
        ...(context.userId ? { user: { connect: { id: context.userId } } } : {}),
        ...(context.branchId ? { branch: { connect: { id: context.branchId } } } : {}),
        oldValues: existing,
        newValues: investment
      }
    });

    return investmentRepository.findById(investment.id);
  }

  async getById(id: string) {
    const investment = await investmentRepository.findById(id);
    if (!investment) {
      throw new AppError("Investment not found", StatusCodes.NOT_FOUND);
    }

    return {
      ...investment,
      maturityBucket: maturityService.getBucket(investment.maturityDate)
    };
  }
}

export const investmentService = new InvestmentService();
