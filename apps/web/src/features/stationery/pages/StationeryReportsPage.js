import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useQuery } from "@tanstack/react-query";
import { DataTablePlaceholder } from "../../../components/common/DataTablePlaceholder";
import { PageTitle } from "../../../components/common/PageTitle";
import { stationeryApi } from "../services/stationeryApi";
export const StationeryReportsPage = () => {
    const { data: stockRegister = [] } = useQuery({ queryKey: ["stationery", "reports", "stock-register"], queryFn: stationeryApi.stockRegister });
    const { data: consumption = [] } = useQuery({ queryKey: ["stationery", "reports", "consumption"], queryFn: stationeryApi.consumptionReport });
    const { data: lowStock = [] } = useQuery({ queryKey: ["stationery", "reports", "low-stock"], queryFn: stationeryApi.lowStockReport });
    const formats = ["csv", "excel", "pdf"];
    const exportPanels = [
        {
            key: "stock-register",
            title: "Stock Register",
            copy: "Operational stock position across item masters, current balances, and reorder benchmarks.",
            action: (format) => stationeryApi.downloadReport("stock-register", format)
        },
        {
            key: "consumption",
            title: "Consumption Analysis",
            copy: "Monitor branch-wise issue patterns and recurring usage trends for planning and control.",
            action: (format) => stationeryApi.downloadReport("consumption", format)
        },
        {
            key: "low-stock",
            title: "Low Stock Alert",
            copy: "Focus on items close to reorder threshold so supply interruptions are avoided early.",
            action: (format) => stationeryApi.downloadReport("low-stock", format)
        }
    ];
    return (_jsxs("div", { className: "space-y-6", children: [_jsx(PageTitle, { title: "Stationery Reports", subtitle: "Stock, Consumption, and Reorder Views" }), _jsx("div", { className: "report-grid", children: exportPanels.map((panel) => (_jsxs("div", { className: "report-panel", children: [_jsxs("div", { className: "section-header", children: [_jsxs("div", { children: [_jsx("h2", { className: "section-title", children: panel.title }), _jsx("p", { className: "section-copy", children: panel.copy })] }), _jsx("span", { className: "page-toolbar-chip", children: "Download Pack" })] }), _jsx("div", { className: "report-actions", children: formats.map((format) => (_jsx("button", { className: format === "pdf" ? "app-button-primary" : "app-button-secondary", onClick: () => void panel.action(format), children: format.toUpperCase() }, format))) }), panel.key === "stock-register" ? (_jsx("p", { className: "report-note", children: "Current Stationery exports remain quantity-based. Item cost, receipt rate, issue rate, total cost, and balance value still need schema additions before CBS costing exports can be treated as complete." })) : null] }, panel.key))) }), _jsx(DataTablePlaceholder, { columns: ["itemCode", "itemName", "currentStock", "reorderLevel"], rows: stockRegister.map((row) => ({ itemCode: String(row.itemCode ?? ""), itemName: String(row.itemName ?? ""), currentStock: String(row.currentStock ?? ""), reorderLevel: String(row.reorderLevel ?? "") })) }), _jsx(DataTablePlaceholder, { columns: ["itemName", "branchName", "quantityIssued"], rows: consumption.map((row) => ({ itemName: String(row.itemName ?? ""), branchName: String(row.branchName ?? ""), quantityIssued: String(row.quantityIssued ?? "") })) }), _jsx(DataTablePlaceholder, { columns: ["itemCode", "itemName", "currentStock", "reorderLevel"], rows: lowStock.map((row) => ({ itemCode: String(row.itemCode ?? ""), itemName: String(row.itemName ?? ""), currentStock: String(row.currentStock ?? ""), reorderLevel: String(row.reorderLevel ?? "") })) })] }));
};
