import { Router } from "express";

import { authMiddleware } from "../../common/middleware/auth.middleware.js";
import { requirePermissions } from "../../core/rbac/rbac.middleware.js";
import { itemController } from "./item/item.controller.js";
import { createItemSchema } from "./item/item.validator.js";
import { itemCategoryController } from "./category/itemCategory.controller.js";
import { createItemCategorySchema } from "./category/itemCategory.validator.js";
import { vendorController } from "./vendor/vendor.controller.js";
import { createVendorSchema } from "./vendor/vendor.validator.js";
import { requisitionController } from "./requisition/requisition.controller.js";
import { createRequisitionSchema } from "./requisition/requisition.validator.js";
import { issueController } from "./issue/issue.controller.js";
import { createIssueSchema } from "./issue/issue.validator.js";
import { stockController } from "./stock/stock.controller.js";
import { stockTransferController } from "./transfer/stockTransfer.controller.js";
import { stationeryReportController } from "./reports/stationeryReport.controller.js";
import { stationeryReportExportController } from "./reports/stationeryReportExport.controller.js";
import { stationeryDashboardController } from "./dashboard/stationeryDashboard.controller.js";

export const stationeryRoutes = Router();

stationeryRoutes.use(authMiddleware);

stationeryRoutes.get("/dashboard/summary", requirePermissions("stationery.read"), async (request, response, next) => {
  try {
    await stationeryDashboardController.summary(request, response);
  } catch (error) {
    next(error);
  }
});

stationeryRoutes.get("/reports/stock-register", requirePermissions("stationery.reports"), async (request, response, next) => {
  try {
    await stationeryReportController.stockRegister(request, response);
  } catch (error) {
    next(error);
  }
});
stationeryRoutes.get("/reports/stock-register/export", requirePermissions("stationery.reports"), async (request, response, next) => {
  try {
    await stationeryReportExportController.stockRegister(request, response);
  } catch (error) {
    next(error);
  }
});
stationeryRoutes.get("/reports/consumption", requirePermissions("stationery.reports"), async (request, response, next) => {
  try {
    await stationeryReportController.consumption(request, response);
  } catch (error) {
    next(error);
  }
});
stationeryRoutes.get("/reports/consumption/export", requirePermissions("stationery.reports"), async (request, response, next) => {
  try {
    await stationeryReportExportController.consumption(request, response);
  } catch (error) {
    next(error);
  }
});
stationeryRoutes.get("/reports/low-stock", requirePermissions("stationery.reports"), async (request, response, next) => {
  try {
    await stationeryReportController.lowStock(request, response);
  } catch (error) {
    next(error);
  }
});
stationeryRoutes.get("/reports/low-stock/export", requirePermissions("stationery.reports"), async (request, response, next) => {
  try {
    await stationeryReportExportController.lowStock(request, response);
  } catch (error) {
    next(error);
  }
});

stationeryRoutes.get("/categories", requirePermissions("stationery.read"), async (request, response, next) => {
  try {
    await itemCategoryController.list(request, response);
  } catch (error) {
    next(error);
  }
});
stationeryRoutes.post("/categories", requirePermissions("stationery.create"), async (request, response, next) => {
  try {
    request.body = createItemCategorySchema.parse(request.body);
    await itemCategoryController.create(request, response);
  } catch (error) {
    next(error);
  }
});

stationeryRoutes.get("/items", requirePermissions("stationery.read"), async (request, response, next) => {
  try {
    await itemController.list(request, response);
  } catch (error) {
    next(error);
  }
});
stationeryRoutes.post("/items", requirePermissions("stationery.create"), async (request, response, next) => {
  try {
    request.body = createItemSchema.parse(request.body);
    await itemController.create(request, response);
  } catch (error) {
    next(error);
  }
});

stationeryRoutes.get("/vendors", requirePermissions("stationery.read"), async (request, response, next) => {
  try {
    await vendorController.list(request, response);
  } catch (error) {
    next(error);
  }
});
stationeryRoutes.post("/vendors", requirePermissions("stationery.create"), async (request, response, next) => {
  try {
    request.body = createVendorSchema.parse(request.body);
    await vendorController.create(request, response);
  } catch (error) {
    next(error);
  }
});

stationeryRoutes.post("/requisitions", requirePermissions("stationery.create"), async (request, response, next) => {
  try {
    request.body = createRequisitionSchema.parse(request.body);
    await requisitionController.create(request, response);
  } catch (error) {
    next(error);
  }
});

stationeryRoutes.post("/issues", requirePermissions("stationery.issue"), async (request, response, next) => {
  try {
    request.body = createIssueSchema.parse(request.body);
    await issueController.create(request, response);
  } catch (error) {
    next(error);
  }
});

stationeryRoutes.get("/stock-ledger", requirePermissions("stationery.read"), async (request, response, next) => {
  try {
    await stockController.register(request, response);
  } catch (error) {
    next(error);
  }
});

stationeryRoutes.get("/transfers", requirePermissions("stationery.read"), async (request, response, next) => {
  try {
    await stockTransferController.list(request, response);
  } catch (error) {
    next(error);
  }
});
stationeryRoutes.post("/transfers", requirePermissions("stationery.update"), async (request, response, next) => {
  try {
    await stockTransferController.create(request, response);
  } catch (error) {
    next(error);
  }
});
