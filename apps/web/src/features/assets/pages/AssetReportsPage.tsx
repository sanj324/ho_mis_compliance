import type { ReactElement } from "react";
import { useQuery } from "@tanstack/react-query";

import { DataTablePlaceholder } from "../../../components/common/DataTablePlaceholder";
import { PageTitle } from "../../../components/common/PageTitle";
import { assetApi } from "../services/assetApi";

export const AssetReportsPage = (): ReactElement => {
  const { data: register = [] } = useQuery({ queryKey: ["assets", "reports", "register"], queryFn: assetApi.registerReport });
  const { data: depreciation = [] } = useQuery({ queryKey: ["assets", "reports", "depreciation"], queryFn: assetApi.depreciationSchedule });
  const { data: insurance = [] } = useQuery({ queryKey: ["assets", "reports", "insurance"], queryFn: assetApi.insuranceExpiryReport });
  const formats = ["csv", "excel", "pdf"] as const;
  const exportPanels = [
    {
      key: "register",
      title: "Asset Register",
      copy: "Portfolio-wide fixed asset listing for HO review, branch verification, and audit sampling.",
      action: (format: typeof formats[number]) => assetApi.downloadReport("register", format)
    },
    {
      key: "depreciation-schedule",
      title: "Depreciation Schedule",
      copy: "Track periodic charge, useful life assumptions, and method-driven book value movement.",
      action: (format: typeof formats[number]) => assetApi.downloadReport("depreciation-schedule", format)
    },
    {
      key: "insurance-expiry",
      title: "Insurance Expiry",
      copy: "Identify assets nearing policy expiry so risk and compliance teams can intervene before lapse.",
      action: (format: typeof formats[number]) => assetApi.downloadReport("insurance-expiry", format)
    }
  ];

  return (
    <div className="space-y-6">
      <PageTitle title="Asset Reports" subtitle="Register, Depreciation, and Insurance Views" />
      <div className="report-grid">
        {exportPanels.map((panel) => (
          <div key={panel.key} className="report-panel">
            <div className="section-header">
              <div>
                <h2 className="section-title">{panel.title}</h2>
                <p className="section-copy">{panel.copy}</p>
              </div>
              <span className="page-toolbar-chip">CBS Export Ready</span>
            </div>
            <div className="report-actions">
              {formats.map((format) => (
                <button key={format} className={format === "pdf" ? "app-button-primary" : "app-button-secondary"} onClick={() => void panel.action(format)}>
                  {format.toUpperCase()}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
      <DataTablePlaceholder columns={["assetCode", "assetName", "status", "originalCost", "netBookValue"]} rows={register.map((row) => ({ assetCode: String(row.assetCode ?? ""), assetName: String(row.assetName ?? ""), status: String(row.status ?? ""), originalCost: String(row.originalCost ?? ""), netBookValue: String(row.netBookValue ?? "") }))} />
      <DataTablePlaceholder columns={["assetCode", "runMonth", "runYear", "depreciationAmount"]} rows={depreciation.map((row) => ({ assetCode: String(row.assetCode ?? ""), runMonth: String(row.runMonth ?? ""), runYear: String(row.runYear ?? ""), depreciationAmount: String(row.depreciationAmount ?? "") }))} />
      <DataTablePlaceholder columns={["assetCode", "insurancePolicyNo", "insuranceExpiryDate"]} rows={insurance.map((row) => ({ assetCode: String(row.assetCode ?? ""), insurancePolicyNo: String(row.insurancePolicyNo ?? ""), insuranceExpiryDate: String(row.insuranceExpiryDate ?? "") }))} />
    </div>
  );
};
