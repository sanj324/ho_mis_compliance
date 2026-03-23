import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useQuery } from "@tanstack/react-query";
import { PageTitle } from "../../../components/common/PageTitle";
import { StatCard } from "../../../components/common/StatCard";
import { complianceApi } from "../services/complianceApi";
export const ComplianceDashboardPage = () => {
    const { data } = useQuery({
        queryKey: ["compliance", "summary"],
        queryFn: complianceApi.getDashboardSummary
    });
    return (_jsxs("div", { className: "space-y-6", children: [_jsx(PageTitle, { title: "Compliance Dashboard", subtitle: "Central Compliance Monitoring" }), _jsxs("div", { className: "grid gap-4 md:grid-cols-2 xl:grid-cols-4", children: [_jsx(StatCard, { label: "Open Events", value: data?.openEvents ?? 0 }), _jsx(StatCard, { label: "High Severity Open", value: data?.highSeverityOpen ?? 0 }), _jsx(StatCard, { label: "Overdue Items", value: data?.overdueCalendarItems ?? 0 }), _jsx(StatCard, { label: "Upcoming Due Dates", value: data?.upcomingCalendarItems ?? 0 })] })] }));
};
