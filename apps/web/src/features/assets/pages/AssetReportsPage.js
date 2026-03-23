import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useQuery } from "@tanstack/react-query";
import { DataTablePlaceholder } from "../../../components/common/DataTablePlaceholder";
import { PageTitle } from "../../../components/common/PageTitle";
import { assetApi } from "../services/assetApi";
export const AssetReportsPage = () => {
    const { data: register = [] } = useQuery({ queryKey: ["assets", "reports", "register"], queryFn: assetApi.registerReport });
    const { data: depreciation = [] } = useQuery({ queryKey: ["assets", "reports", "depreciation"], queryFn: assetApi.depreciationSchedule });
    const { data: insurance = [] } = useQuery({ queryKey: ["assets", "reports", "insurance"], queryFn: assetApi.insuranceExpiryReport });
    const formats = ["csv", "excel", "pdf"];
    const exportPanels = [
        {
            key: "register",
            title: "Asset Register",
            copy: "Portfolio-wide fixed asset listing for HO review, branch verification, and audit sampling.",
            action: (format) => assetApi.downloadReport("register", format)
        },
        {
            key: "depreciation-schedule",
            title: "Depreciation Schedule",
            copy: "Track periodic charge, useful life assumptions, and method-driven book value movement.",
            action: (format) => assetApi.downloadReport("depreciation-schedule", format)
        },
        {
            key: "insurance-expiry",
            title: "Insurance Expiry",
            copy: "Identify assets nearing policy expiry so risk and compliance teams can intervene before lapse.",
            action: (format) => assetApi.downloadReport("insurance-expiry", format)
        }
    ];
    return (_jsxs("div", { className: "space-y-6", children: [_jsx(PageTitle, { title: "Asset Reports", subtitle: "Register, Depreciation, and Insurance Views" }), _jsx("div", { className: "report-grid", children: exportPanels.map((panel) => (_jsxs("div", { className: "report-panel", children: [_jsxs("div", { className: "section-header", children: [_jsxs("div", { children: [_jsx("h2", { className: "section-title", children: panel.title }), _jsx("p", { className: "section-copy", children: panel.copy })] }), _jsx("span", { className: "page-toolbar-chip", children: "CBS Export Ready" })] }), _jsx("div", { className: "report-actions", children: formats.map((format) => (_jsx("button", { className: format === "pdf" ? "app-button-primary" : "app-button-secondary", onClick: () => void panel.action(format), children: format.toUpperCase() }, format))) })] }, panel.key))) }), _jsx(DataTablePlaceholder, { columns: ["assetCode", "assetName", "status", "originalCost", "netBookValue"], rows: register.map((row) => ({ assetCode: String(row.assetCode ?? ""), assetName: String(row.assetName ?? ""), status: String(row.status ?? ""), originalCost: String(row.originalCost ?? ""), netBookValue: String(row.netBookValue ?? "") })) }), _jsx(DataTablePlaceholder, { columns: ["assetCode", "runMonth", "runYear", "depreciationAmount"], rows: depreciation.map((row) => ({ assetCode: String(row.assetCode ?? ""), runMonth: String(row.runMonth ?? ""), runYear: String(row.runYear ?? ""), depreciationAmount: String(row.depreciationAmount ?? "") })) }), _jsx(DataTablePlaceholder, { columns: ["assetCode", "insurancePolicyNo", "insuranceExpiryDate"], rows: insurance.map((row) => ({ assetCode: String(row.assetCode ?? ""), insurancePolicyNo: String(row.insurancePolicyNo ?? ""), insuranceExpiryDate: String(row.insuranceExpiryDate ?? "") })) })] }));
};
