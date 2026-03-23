import type { ReactElement } from "react";
import { useQuery } from "@tanstack/react-query";

import { DataTablePlaceholder } from "../../../components/common/DataTablePlaceholder";
import { PageTitle } from "../../../components/common/PageTitle";
import { stationeryApi } from "../services/stationeryApi";

export const StationeryReportsPage = (): ReactElement => {
  const { data: stockRegister = [] } = useQuery({ queryKey: ["stationery", "reports", "stock-register"], queryFn: stationeryApi.stockRegister });
  const { data: consumption = [] } = useQuery({ queryKey: ["stationery", "reports", "consumption"], queryFn: stationeryApi.consumptionReport });
  const { data: lowStock = [] } = useQuery({ queryKey: ["stationery", "reports", "low-stock"], queryFn: stationeryApi.lowStockReport });
  const formats = ["csv", "excel", "pdf"] as const;
  const exportPanels = [
    {
      key: "stock-register",
      title: "Stock Register",
      copy: "Operational stock position across item masters, current balances, and reorder benchmarks.",
      action: (format: typeof formats[number]) => stationeryApi.downloadReport("stock-register", format)
    },
    {
      key: "consumption",
      title: "Consumption Analysis",
      copy: "Monitor branch-wise issue patterns and recurring usage trends for planning and control.",
      action: (format: typeof formats[number]) => stationeryApi.downloadReport("consumption", format)
    },
    {
      key: "low-stock",
      title: "Low Stock Alert",
      copy: "Focus on items close to reorder threshold so supply interruptions are avoided early.",
      action: (format: typeof formats[number]) => stationeryApi.downloadReport("low-stock", format)
    }
  ];

  return (
    <div className="space-y-6">
      <PageTitle title="Stationery Reports" subtitle="Stock, Consumption, and Reorder Views" />
      <div className="report-grid">
        {exportPanels.map((panel) => (
          <div key={panel.key} className="report-panel">
            <div className="section-header">
              <div>
                <h2 className="section-title">{panel.title}</h2>
                <p className="section-copy">{panel.copy}</p>
              </div>
              <span className="page-toolbar-chip">Download Pack</span>
            </div>
            <div className="report-actions">
              {formats.map((format) => (
                <button key={format} className={format === "pdf" ? "app-button-primary" : "app-button-secondary"} onClick={() => void panel.action(format)}>
                  {format.toUpperCase()}
                </button>
              ))}
            </div>
            {panel.key === "stock-register" ? (
              <p className="report-note">Current Stationery exports remain quantity-based. Item cost, receipt rate, issue rate, total cost, and balance value still need schema additions before CBS costing exports can be treated as complete.</p>
            ) : null}
          </div>
        ))}
      </div>
      <DataTablePlaceholder columns={["itemCode", "itemName", "currentStock", "reorderLevel"]} rows={stockRegister.map((row) => ({ itemCode: String(row.itemCode ?? ""), itemName: String(row.itemName ?? ""), currentStock: String(row.currentStock ?? ""), reorderLevel: String(row.reorderLevel ?? "") }))} />
      <DataTablePlaceholder columns={["itemName", "branchName", "quantityIssued"]} rows={consumption.map((row) => ({ itemName: String(row.itemName ?? ""), branchName: String(row.branchName ?? ""), quantityIssued: String(row.quantityIssued ?? "") }))} />
      <DataTablePlaceholder columns={["itemCode", "itemName", "currentStock", "reorderLevel"]} rows={lowStock.map((row) => ({ itemCode: String(row.itemCode ?? ""), itemName: String(row.itemName ?? ""), currentStock: String(row.currentStock ?? ""), reorderLevel: String(row.reorderLevel ?? "") }))} />
    </div>
  );
};
