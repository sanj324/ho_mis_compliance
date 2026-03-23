export type AuditLogRecord = {
  id: string;
  moduleName: string;
  entityName: string;
  entityId: string | null;
  action: string;
  requestId: string;
  userId: string | null;
  branchId: string | null;
  oldValues: Record<string, unknown> | null;
  newValues: Record<string, unknown> | null;
  createdAt: string;
};
