import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useQuery } from "@tanstack/react-query";
import { DataTablePlaceholder } from "../../../components/common/DataTablePlaceholder";
import { PageTitle } from "../../../components/common/PageTitle";
import { complianceApi } from "../services/complianceApi";
export const ComplianceCalendarPage = () => {
    const { data } = useQuery({
        queryKey: ["compliance", "calendar"],
        queryFn: complianceApi.getCalendar
    });
    return (_jsxs("div", { className: "space-y-6", children: [_jsx(PageTitle, { title: "Compliance Calendar", subtitle: "Due Dates and Filing Calendar" }), _jsx(DataTablePlaceholder, { columns: ["Title", "Module", "Frequency", "Due Date", "Status"], rows: (data ?? []).map((item) => ({
                    Title: item.title,
                    Module: item.moduleName,
                    Frequency: item.frequency,
                    "Due Date": new Date(item.dueDate).toLocaleDateString(),
                    Status: item.status
                })) })] }));
};
