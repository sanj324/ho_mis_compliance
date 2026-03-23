import { StatusCodes } from "http-status-codes";
import { PrismaClient } from "@prisma/client";

import { AppError } from "../../../common/errors/app-error.js";
import { AuditActionEnum } from "../../../common/enums/audit-action.enum.js";
import { AssetExceptionSeverityEnum } from "../../../common/enums/asset.enum.js";
import { assetRepository } from "./asset.repository.js";
import type { AssetFilters, AssetInput } from "./asset.types.js";

const prisma = new PrismaClient();

const getDepreciationBase = (originalCost: number, salvageValue: number): number =>
  Math.max(originalCost - salvageValue, 0);

export class AssetService {
  list(filters: AssetFilters) {
    return assetRepository.findMany(filters);
  }

  async getById(id: string) {
    const asset = await assetRepository.findById(id);
    if (!asset) {
      throw new AppError("Asset not found", StatusCodes.NOT_FOUND);
    }
    return asset;
  }

  private async captureExceptions(assetId: string, insuranceExpiryDate?: string | null) {
    if (!insuranceExpiryDate) {
      await assetRepository.createException({
        asset: { connect: { id: assetId } },
        exceptionCode: "INSURANCE_MISSING",
        exceptionMessage: "Insurance expiry date is not available for the asset",
        severity: AssetExceptionSeverityEnum.MEDIUM
      });
      return;
    }

    const daysToExpiry = Math.ceil((new Date(insuranceExpiryDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
    if (daysToExpiry <= 30) {
      await assetRepository.createException({
        asset: { connect: { id: assetId } },
        exceptionCode: "INSURANCE_EXPIRING",
        exceptionMessage: "Insurance expiry falls within the next 30 days",
        severity: AssetExceptionSeverityEnum.HIGH
      });
    }
  }

  async create(input: AssetInput, context: { requestId: string; userId: string | null; branchId: string | null }) {
    const salvageValue = input.salvageValue ?? 0;
    const asset = await assetRepository.create({
      assetCode: input.assetCode,
      assetName: input.assetName,
      assetCategory: { connect: { id: input.assetCategoryId } },
      depreciationMethod: { connect: { id: input.depreciationMethodId } },
      branch: { connect: { id: input.branchId } },
      ...(input.departmentId ? { department: { connect: { id: input.departmentId } } } : {}),
      ...(input.costCenterId ? { costCenter: { connect: { id: input.costCenterId } } } : {}),
      purchaseDate: new Date(input.purchaseDate),
      capitalizationDate: new Date(input.capitalizationDate),
      originalCost: input.originalCost,
      usefulLifeMonths: input.usefulLifeMonths,
      depreciationRate: input.depreciationRate,
      salvageValue,
      accumulatedDepreciation: 0,
      netBookValue: getDepreciationBase(input.originalCost, salvageValue),
      ...(input.insurancePolicyNo ? { insurancePolicyNo: input.insurancePolicyNo } : {}),
      ...(input.insuranceExpiryDate ? { insuranceExpiryDate: new Date(input.insuranceExpiryDate) } : {}),
      ...(input.warrantyExpiryDate ? { warrantyExpiryDate: new Date(input.warrantyExpiryDate) } : {}),
      ...(input.currentStatus ? { currentStatus: input.currentStatus } : {}),
      ...(input.currentHolder ? { currentHolder: input.currentHolder } : {}),
      ...(input.barcodeOrTagNo ? { barcodeOrTagNo: input.barcodeOrTagNo } : {}),
      approvalState: "PENDING_APPROVAL"
    });

    await this.captureExceptions(asset.id, input.insuranceExpiryDate);

    await prisma.auditLog.create({
      data: {
        moduleName: "ASSETS",
        entityName: "Asset",
        entityId: asset.id,
        action: AuditActionEnum.CREATE,
        requestId: context.requestId,
        ...(context.userId ? { user: { connect: { id: context.userId } } } : {}),
        ...(context.branchId ? { branch: { connect: { id: context.branchId } } } : {}),
        newValues: asset
      }
    });
    return asset;
  }

  async update(
    id: string,
    input: Partial<AssetInput>,
    context: { requestId: string; userId: string | null; branchId: string | null }
  ) {
    const existing = await this.getById(id);
    const salvageValue = input.salvageValue ?? Number(existing.salvageValue);
    const originalCost = input.originalCost ?? Number(existing.originalCost);

    const asset = await assetRepository.update(id, {
      ...(input.assetName !== undefined ? { assetName: input.assetName } : {}),
      ...(input.assetCategoryId ? { assetCategory: { connect: { id: input.assetCategoryId } } } : {}),
      ...(input.depreciationMethodId ? { depreciationMethod: { connect: { id: input.depreciationMethodId } } } : {}),
      ...(input.branchId ? { branch: { connect: { id: input.branchId } } } : {}),
      ...(input.departmentId !== undefined
        ? input.departmentId
          ? { department: { connect: { id: input.departmentId } } }
          : { department: { disconnect: true } }
        : {}),
      ...(input.costCenterId !== undefined
        ? input.costCenterId
          ? { costCenter: { connect: { id: input.costCenterId } } }
          : { costCenter: { disconnect: true } }
        : {}),
      ...(input.purchaseDate ? { purchaseDate: new Date(input.purchaseDate) } : {}),
      ...(input.capitalizationDate ? { capitalizationDate: new Date(input.capitalizationDate) } : {}),
      ...(input.originalCost !== undefined ? { originalCost: input.originalCost } : {}),
      ...(input.usefulLifeMonths !== undefined ? { usefulLifeMonths: input.usefulLifeMonths } : {}),
      ...(input.depreciationRate !== undefined ? { depreciationRate: input.depreciationRate } : {}),
      ...(input.salvageValue !== undefined ? { salvageValue } : {}),
      netBookValue: getDepreciationBase(originalCost, salvageValue) - Number(existing.accumulatedDepreciation),
      ...(input.insurancePolicyNo !== undefined ? { insurancePolicyNo: input.insurancePolicyNo } : {}),
      ...(input.insuranceExpiryDate !== undefined
        ? input.insuranceExpiryDate
          ? { insuranceExpiryDate: new Date(input.insuranceExpiryDate) }
          : { insuranceExpiryDate: null }
        : {}),
      ...(input.warrantyExpiryDate !== undefined
        ? input.warrantyExpiryDate
          ? { warrantyExpiryDate: new Date(input.warrantyExpiryDate) }
          : { warrantyExpiryDate: null }
        : {}),
      ...(input.currentStatus !== undefined ? { currentStatus: input.currentStatus } : {}),
      ...(input.currentHolder !== undefined ? { currentHolder: input.currentHolder } : {}),
      ...(input.barcodeOrTagNo !== undefined ? { barcodeOrTagNo: input.barcodeOrTagNo } : {}),
      approvalState: "PENDING_APPROVAL"
    });

    if (input.insuranceExpiryDate !== undefined) {
      await this.captureExceptions(asset.id, input.insuranceExpiryDate);
    }

    await prisma.auditLog.create({
      data: {
        moduleName: "ASSETS",
        entityName: "Asset",
        entityId: asset.id,
        action: AuditActionEnum.UPDATE,
        requestId: context.requestId,
        ...(context.userId ? { user: { connect: { id: context.userId } } } : {}),
        ...(context.branchId ? { branch: { connect: { id: context.branchId } } } : {}),
        oldValues: existing,
        newValues: asset
      }
    });
    return asset;
  }
}

export const assetService = new AssetService();
