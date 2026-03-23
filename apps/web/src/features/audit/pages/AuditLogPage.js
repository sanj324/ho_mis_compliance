import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useQuery } from "@tanstack/react-query";
import { DataTablePlaceholder } from "../../../components/common/DataTablePlaceholder";
import { PageTitle } from "../../../components/common/PageTitle";
import { auditApi } from "../services/auditApi";
export const AuditLogPage = () => {
    const { data = [] } = useQuery({
        queryKey: ["audit-logs"],
        queryFn: auditApi.list
    });
    return (_jsxs("div", { className: "space-y-6", children: [_jsx(PageTitle, { title: "Audit Trail", subtitle: "Control Monitoring" }), _jsx(DataTablePlaceholder, { columns: ["moduleName", "entityName", "action", "requestId", "createdAt"], rows: data.map((row) => ({
                    moduleName: row.moduleName,
                    entityName: row.entityName,
                    action: row.action,
                    requestId: row.requestId,
                    createdAt: row.createdAt
                })) })] }));
};
