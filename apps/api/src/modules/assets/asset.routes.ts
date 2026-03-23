import { Router } from "express";

import { authMiddleware } from "../../common/middleware/auth.middleware.js";
import { requirePermissions } from "../../core/rbac/rbac.middleware.js";
import { assetController } from "./asset/asset.controller.js";
import { createAssetSchema, updateAssetSchema } from "./asset/asset.validator.js";
import { assetCategoryController } from "./category/assetCategory.controller.js";
import { createAssetCategorySchema } from "./category/assetCategory.validator.js";
import { assetDashboardController } from "./dashboard/assetDashboard.controller.js";
import { depreciationController } from "./depreciation/depreciation.controller.js";
import { depreciationMethodController } from "./depreciation-method/depreciationMethod.controller.js";
import { createDepreciationMethodSchema } from "./depreciation-method/depreciationMethod.validator.js";
import { assetDisposalController } from "./disposal/assetDisposal.controller.js";
import { createAssetDisposalSchema } from "./disposal/assetDisposal.validator.js";
import { insuranceController } from "./insurance/insurance.controller.js";
import { createInsuranceSchema } from "./insurance/insurance.validator.js";
import { assetReportController } from "./reports/assetReport.controller.js";
import { assetReportExportController } from "./reports/assetReportExport.controller.js";
import { assetTransferController } from "./transfer/assetTransfer.controller.js";
import { createAssetTransferSchema } from "./transfer/assetTransfer.validator.js";

export const assetRoutes = Router();

assetRoutes.use(authMiddleware);

assetRoutes.get("/dashboard/summary", requirePermissions("assets.read"), async (request, response, next) => {
  try {
    await assetDashboardController.summary(request, response);
  } catch (error) {
    next(error);
  }
});

assetRoutes.get("/", requirePermissions("assets.read"), async (request, response, next) => {
  try {
    await assetController.list(request, response);
  } catch (error) {
    next(error);
  }
});
assetRoutes.post("/", requirePermissions("assets.create"), async (request, response, next) => {
  try {
    request.body = createAssetSchema.parse(request.body);
    await assetController.create(request, response);
  } catch (error) {
    next(error);
  }
});
assetRoutes.patch("/:id", requirePermissions("assets.update"), async (request, response, next) => {
  try {
    request.body = updateAssetSchema.parse(request.body);
    await assetController.update(request, response);
  } catch (error) {
    next(error);
  }
});

assetRoutes.post("/depreciation/run", requirePermissions("assets.depreciation"), async (request, response, next) => {
  try {
    await depreciationController.run(request, response);
  } catch (error) {
    next(error);
  }
});

assetRoutes.get("/reports/register", requirePermissions("assets.reports"), async (request, response, next) => {
  try {
    await assetReportController.register(request, response);
  } catch (error) {
    next(error);
  }
});
assetRoutes.get("/reports/register/export", requirePermissions("assets.reports"), async (request, response, next) => {
  try {
    await assetReportExportController.register(request, response);
  } catch (error) {
    next(error);
  }
});
assetRoutes.get("/reports/depreciation-schedule", requirePermissions("assets.reports"), async (request, response, next) => {
  try {
    await assetReportController.depreciationSchedule(request, response);
  } catch (error) {
    next(error);
  }
});
assetRoutes.get("/reports/depreciation-schedule/export", requirePermissions("assets.reports"), async (request, response, next) => {
  try {
    await assetReportExportController.depreciationSchedule(request, response);
  } catch (error) {
    next(error);
  }
});
assetRoutes.get("/reports/insurance-expiry", requirePermissions("assets.reports"), async (request, response, next) => {
  try {
    await assetReportController.insuranceExpiry(request, response);
  } catch (error) {
    next(error);
  }
});
assetRoutes.get("/reports/insurance-expiry/export", requirePermissions("assets.reports"), async (request, response, next) => {
  try {
    await assetReportExportController.insuranceExpiry(request, response);
  } catch (error) {
    next(error);
  }
});

assetRoutes.get("/categories", requirePermissions("assets.read"), async (request, response, next) => {
  try {
    await assetCategoryController.list(request, response);
  } catch (error) {
    next(error);
  }
});
assetRoutes.post("/categories", requirePermissions("assets.create"), async (request, response, next) => {
  try {
    request.body = createAssetCategorySchema.parse(request.body);
    await assetCategoryController.create(request, response);
  } catch (error) {
    next(error);
  }
});

assetRoutes.get("/depreciation-methods", requirePermissions("assets.read"), async (request, response, next) => {
  try {
    await depreciationMethodController.list(request, response);
  } catch (error) {
    next(error);
  }
});
assetRoutes.post("/depreciation-methods", requirePermissions("assets.create"), async (request, response, next) => {
  try {
    request.body = createDepreciationMethodSchema.parse(request.body);
    await depreciationMethodController.create(request, response);
  } catch (error) {
    next(error);
  }
});

assetRoutes.get("/insurances", requirePermissions("assets.read"), async (request, response, next) => {
  try {
    await insuranceController.list(request, response);
  } catch (error) {
    next(error);
  }
});
assetRoutes.post("/insurances", requirePermissions("assets.update"), async (request, response, next) => {
  try {
    request.body = createInsuranceSchema.parse(request.body);
    await insuranceController.create(request, response);
  } catch (error) {
    next(error);
  }
});

assetRoutes.get("/transfers", requirePermissions("assets.read"), async (request, response, next) => {
  try {
    await assetTransferController.list(request, response);
  } catch (error) {
    next(error);
  }
});
assetRoutes.post("/transfers", requirePermissions("assets.update"), async (request, response, next) => {
  try {
    request.body = createAssetTransferSchema.parse(request.body);
    await assetTransferController.create(request, response);
  } catch (error) {
    next(error);
  }
});

assetRoutes.get("/disposals", requirePermissions("assets.read"), async (request, response, next) => {
  try {
    await assetDisposalController.list(request, response);
  } catch (error) {
    next(error);
  }
});
assetRoutes.post("/disposals", requirePermissions("assets.update"), async (request, response, next) => {
  try {
    request.body = createAssetDisposalSchema.parse(request.body);
    await assetDisposalController.create(request, response);
  } catch (error) {
    next(error);
  }
});

assetRoutes.get("/:id", requirePermissions("assets.read"), async (request, response, next) => {
  try {
    await assetController.getById(request, response);
  } catch (error) {
    next(error);
  }
});
