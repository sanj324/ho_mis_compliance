import type { ReactElement } from "react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { PageTitle } from "../../../components/common/PageTitle";
import { branchApi } from "../../branches/services/branchApi";
import { assetApi } from "../services/assetApi";

type AssetFormState = {
  assetCode: string;
  assetName: string;
  branchId: string;
  assetCategoryId: string;
  depreciationMethodId: string;
  purchaseDate: string;
  capitalizationDate: string;
  originalCost: string;
  usefulLifeMonths: string;
  depreciationRate: string;
  salvageValue: string;
  insurancePolicyNo: string;
  insuranceExpiryDate: string;
  currentHolder: string;
  barcodeOrTagNo: string;
};

const initialForm: AssetFormState = {
  assetCode: "",
  assetName: "",
  branchId: "",
  assetCategoryId: "",
  depreciationMethodId: "",
  purchaseDate: "",
  capitalizationDate: "",
  originalCost: "",
  usefulLifeMonths: "",
  depreciationRate: "",
  salvageValue: "",
  insurancePolicyNo: "",
  insuranceExpiryDate: "",
  currentHolder: "",
  barcodeOrTagNo: ""
};

export const AssetFormPage = (): ReactElement => {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [form, setForm] = useState<AssetFormState>(initialForm);

  const { data: branches = [] } = useQuery({ queryKey: ["branches"], queryFn: branchApi.list });
  const { data: categories = [] } = useQuery({ queryKey: ["assets", "categories"], queryFn: assetApi.listCategories });
  const { data: methods = [] } = useQuery({ queryKey: ["assets", "methods"], queryFn: assetApi.listDepreciationMethods });
  const { data: asset } = useQuery({
    queryKey: ["assets", "detail", id],
    queryFn: () => assetApi.getAsset(id ?? ""),
    enabled: isEdit && Boolean(id)
  });

  useEffect(() => {
    if (!asset) {
      return;
    }
    setForm({
      assetCode: asset.assetCode,
      assetName: asset.assetName,
      branchId: asset.branch?.id ?? "",
      assetCategoryId: asset.assetCategory?.id ?? "",
      depreciationMethodId: asset.depreciationMethod?.id ?? "",
      purchaseDate: "",
      capitalizationDate: "",
      originalCost: String(asset.originalCost),
      usefulLifeMonths: "",
      depreciationRate: "",
      salvageValue: "",
      insurancePolicyNo: asset.insurancePolicyNo ?? "",
      insuranceExpiryDate: asset.insuranceExpiryDate?.slice(0, 10) ?? "",
      currentHolder: "",
      barcodeOrTagNo: ""
    });
  }, [asset]);

  const mutation = useMutation({
    mutationFn: async () => {
      const payload = {
        assetCode: form.assetCode,
        assetName: form.assetName,
        branchId: form.branchId,
        assetCategoryId: form.assetCategoryId,
        depreciationMethodId: form.depreciationMethodId,
        purchaseDate: form.purchaseDate,
        capitalizationDate: form.capitalizationDate,
        originalCost: Number(form.originalCost),
        usefulLifeMonths: Number(form.usefulLifeMonths),
        depreciationRate: Number(form.depreciationRate),
        salvageValue: form.salvageValue ? Number(form.salvageValue) : undefined,
        insurancePolicyNo: form.insurancePolicyNo || undefined,
        insuranceExpiryDate: form.insuranceExpiryDate || undefined,
        currentHolder: form.currentHolder || undefined,
        barcodeOrTagNo: form.barcodeOrTagNo || undefined
      };
      return isEdit && id ? assetApi.updateAsset(id, payload) : assetApi.createAsset(payload);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["assets", "list"] });
      navigate("/assets");
    }
  });

  const summaryItems = [
    { label: "Category Options", value: categories.length },
    { label: "Method Options", value: methods.length },
    { label: "Branch Coverage", value: branches.length }
  ];

  return (
    <div className="space-y-6">
      <PageTitle title={isEdit ? "Edit Asset" : "Create Asset"} subtitle="Fixed Asset Entry" />
      <div className="metrics-grid">
        {summaryItems.map((item) => (
          <div key={item.label} className="app-panel-muted p-5">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">{item.label}</p>
            <p className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">{item.value}</p>
          </div>
        ))}
      </div>
      <div className="section-card">
        <div className="section-header">
          <div>
            <h2 className="section-title">Asset Master Entry</h2>
            <p className="section-copy">Capture identity, capitalization, depreciation, and custody information in a clean register format suitable for branch and HO review.</p>
          </div>
          <span className="page-toolbar-chip">{isEdit ? "Edit Mode" : "New Record"}</span>
        </div>
        <div className="form-grid mt-6">
          <label className="field-stack">
            <span className="field-label">Asset Code</span>
            <input className="app-input" placeholder="AST-HO-0001" value={form.assetCode} onChange={(event) => setForm((current) => ({ ...current, assetCode: event.target.value }))} />
          </label>
          <label className="field-stack">
            <span className="field-label">Asset Name</span>
            <input className="app-input" placeholder="Core Banking Server Rack" value={form.assetName} onChange={(event) => setForm((current) => ({ ...current, assetName: event.target.value }))} />
          </label>
          <label className="field-stack">
            <span className="field-label">Branch</span>
            <select className="app-select" value={form.branchId} onChange={(event) => setForm((current) => ({ ...current, branchId: event.target.value }))}>
              <option value="">Select Branch</option>
              {branches.map((branch) => <option key={branch.id} value={branch.id}>{branch.name}</option>)}
            </select>
          </label>
          <label className="field-stack">
            <span className="field-label">Asset Category</span>
            <select className="app-select" value={form.assetCategoryId} onChange={(event) => setForm((current) => ({ ...current, assetCategoryId: event.target.value }))}>
              <option value="">Select Category</option>
              {categories.map((item) => <option key={item.id} value={item.id}>{item.code} - {item.name}</option>)}
            </select>
          </label>
          <label className="field-stack">
            <span className="field-label">Depreciation Method</span>
            <select className="app-select" value={form.depreciationMethodId} onChange={(event) => setForm((current) => ({ ...current, depreciationMethodId: event.target.value }))}>
              <option value="">Select Method</option>
              {methods.map((item) => <option key={item.id} value={item.id}>{item.code} - {item.name}</option>)}
            </select>
          </label>
          <label className="field-stack">
            <span className="field-label">Purchase Date</span>
            <input className="app-input" type="date" value={form.purchaseDate} onChange={(event) => setForm((current) => ({ ...current, purchaseDate: event.target.value }))} />
          </label>
          <label className="field-stack">
            <span className="field-label">Capitalization Date</span>
            <input className="app-input" type="date" value={form.capitalizationDate} onChange={(event) => setForm((current) => ({ ...current, capitalizationDate: event.target.value }))} />
          </label>
          <label className="field-stack">
            <span className="field-label">Original Cost</span>
            <input className="app-input" type="number" placeholder="0.00" value={form.originalCost} onChange={(event) => setForm((current) => ({ ...current, originalCost: event.target.value }))} />
          </label>
          <label className="field-stack">
            <span className="field-label">Useful Life Months</span>
            <input className="app-input" type="number" placeholder="36" value={form.usefulLifeMonths} onChange={(event) => setForm((current) => ({ ...current, usefulLifeMonths: event.target.value }))} />
          </label>
          <label className="field-stack">
            <span className="field-label">Depreciation Rate</span>
            <input className="app-input" type="number" placeholder="33.33" value={form.depreciationRate} onChange={(event) => setForm((current) => ({ ...current, depreciationRate: event.target.value }))} />
          </label>
          <label className="field-stack">
            <span className="field-label">Salvage Value</span>
            <input className="app-input" type="number" placeholder="0.00" value={form.salvageValue} onChange={(event) => setForm((current) => ({ ...current, salvageValue: event.target.value }))} />
          </label>
          <label className="field-stack">
            <span className="field-label">Insurance Policy</span>
            <input className="app-input" placeholder="Policy Reference" value={form.insurancePolicyNo} onChange={(event) => setForm((current) => ({ ...current, insurancePolicyNo: event.target.value }))} />
          </label>
          <label className="field-stack">
            <span className="field-label">Insurance Expiry</span>
            <input className="app-input" type="date" value={form.insuranceExpiryDate} onChange={(event) => setForm((current) => ({ ...current, insuranceExpiryDate: event.target.value }))} />
          </label>
          <label className="field-stack">
            <span className="field-label">Current Holder</span>
            <input className="app-input" placeholder="Department or officer" value={form.currentHolder} onChange={(event) => setForm((current) => ({ ...current, currentHolder: event.target.value }))} />
          </label>
          <label className="field-stack">
            <span className="field-label">Barcode / Tag No</span>
            <input className="app-input" placeholder="Scan-ready asset tag" value={form.barcodeOrTagNo} onChange={(event) => setForm((current) => ({ ...current, barcodeOrTagNo: event.target.value }))} />
          </label>
        </div>
        <div className="mt-6 flex flex-wrap justify-end gap-3">
          <button className="app-button-secondary" onClick={() => navigate("/assets")}>Cancel</button>
          <button className="app-button-primary" onClick={() => mutation.mutate()}>
            {isEdit ? "Update Asset" : "Create Asset"}
          </button>
        </div>
      </div>
    </div>
  );
};
