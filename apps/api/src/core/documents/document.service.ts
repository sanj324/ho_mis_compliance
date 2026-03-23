import { StatusCodes } from "http-status-codes";
import { PrismaClient } from "@prisma/client";

import { AppError } from "../../common/errors/app-error.js";
import { AuditActionEnum } from "../../common/enums/audit-action.enum.js";
import { documentRepository } from "./document.repository.js";

const prisma = new PrismaClient();

export class DocumentService {
  list(filters?: { moduleName?: string; entityType?: string; entityId?: string }) {
    return documentRepository.list(filters);
  }

  async getById(id: string) {
    const document = await documentRepository.findById(id);
    if (!document) {
      throw new AppError("Document not found", StatusCodes.NOT_FOUND);
    }
    return document;
  }

  async upload(
    input: {
      moduleName: "DOCUMENTS" | "PAYROLL" | "INVESTMENTS" | "ASSETS" | "STATIONERY" | "SHARE_CAPITAL";
      entityType: string;
      entityId: string;
      documentType: string;
      fileName: string;
      filePath: string;
      mimeType?: string;
      fileSize?: number;
      branchId?: string;
    },
    context: { requestId: string; userId: string | null; branchId: string | null }
  ) {
    const document = await documentRepository.create({
      moduleName: input.moduleName,
      entityType: input.entityType,
      entityId: input.entityId,
      documentType: input.documentType,
      fileName: input.fileName,
      filePath: input.filePath,
      ...(input.mimeType ? { mimeType: input.mimeType } : {}),
      ...(input.fileSize !== undefined ? { fileSize: input.fileSize } : {}),
      ...(input.branchId ? { branch: { connect: { id: input.branchId } } } : {}),
      ...(context.userId ? { uploadedBy: { connect: { id: context.userId } } } : {})
    });

    await prisma.auditLog.create({
      data: {
        moduleName: "DOCUMENTS",
        entityName: "DocumentAttachment",
        entityId: document.id,
        action: AuditActionEnum.CREATE,
        requestId: context.requestId,
        ...(context.userId ? { user: { connect: { id: context.userId } } } : {}),
        ...(context.branchId ? { branch: { connect: { id: context.branchId } } } : {}),
        newValues: document
      }
    });

    return document;
  }
}

export const documentService = new DocumentService();
