import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useMutation, useQuery } from "@tanstack/react-query";
import { DataTablePlaceholder } from "../../../components/common/DataTablePlaceholder";
import { PageTitle } from "../../../components/common/PageTitle";
import { complianceApi } from "../services/complianceApi";
export const ComplianceEventsPage = () => {
    const { data, refetch } = useQuery({
        queryKey: ["compliance", "events"],
        queryFn: complianceApi.listEvents
    });
    const mutation = useMutation({
        mutationFn: (id) => complianceApi.closeEvent(id, "Closed from UI"),
        onSuccess: () => {
            void refetch();
        }
    });
    return (_jsxs("div", { className: "space-y-6", children: [_jsx(PageTitle, { title: "Compliance Events", subtitle: "Exception and Rule Breach Register" }), _jsx(DataTablePlaceholder, { columns: ["Module", "Rule", "Severity", "Status", "Detected On", "Action"], rows: (data ?? []).map((item) => ({
                    Module: item.moduleName,
                    Rule: item.ruleCode,
                    Severity: item.severity,
                    Status: item.status,
                    "Detected On": new Date(item.detectedOn).toLocaleDateString(),
                    Action: item.status === "OPEN" ? "Close" : "Closed"
                })) }), _jsx("div", { className: "flex flex-wrap gap-2", children: (data ?? [])
                    .filter((item) => item.status === "OPEN")
                    .slice(0, 5)
                    .map((item) => (_jsxs("button", { className: "rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-700", onClick: () => mutation.mutate(item.id), type: "button", children: ["Close ", item.ruleCode] }, item.id))) })] }));
};
