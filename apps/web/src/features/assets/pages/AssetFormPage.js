import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { PageTitle } from "../../../components/common/PageTitle";
import { branchApi } from "../../branches/services/branchApi";
import { assetApi } from "../services/assetApi";
const initialForm = {
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
export const AssetFormPage = () => {
    const { id } = useParams();
    const isEdit = Boolean(id);
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const [form, setForm] = useState(initialForm);
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
    return (_jsxs("div", { className: "space-y-6", children: [_jsx(PageTitle, { title: isEdit ? "Edit Asset" : "Create Asset", subtitle: "Fixed Asset Entry" }), _jsx("div", { className: "metrics-grid", children: summaryItems.map((item) => (_jsxs("div", { className: "app-panel-muted p-5", children: [_jsx("p", { className: "text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500", children: item.label }), _jsx("p", { className: "mt-3 text-3xl font-semibold tracking-tight text-slate-950", children: item.value })] }, item.label))) }), _jsxs("div", { className: "section-card", children: [_jsxs("div", { className: "section-header", children: [_jsxs("div", { children: [_jsx("h2", { className: "section-title", children: "Asset Master Entry" }), _jsx("p", { className: "section-copy", children: "Capture identity, capitalization, depreciation, and custody information in a clean register format suitable for branch and HO review." })] }), _jsx("span", { className: "page-toolbar-chip", children: isEdit ? "Edit Mode" : "New Record" })] }), _jsxs("div", { className: "form-grid mt-6", children: [_jsxs("label", { className: "field-stack", children: [_jsx("span", { className: "field-label", children: "Asset Code" }), _jsx("input", { className: "app-input", placeholder: "AST-HO-0001", value: form.assetCode, onChange: (event) => setForm((current) => ({ ...current, assetCode: event.target.value })) })] }), _jsxs("label", { className: "field-stack", children: [_jsx("span", { className: "field-label", children: "Asset Name" }), _jsx("input", { className: "app-input", placeholder: "Core Banking Server Rack", value: form.assetName, onChange: (event) => setForm((current) => ({ ...current, assetName: event.target.value })) })] }), _jsxs("label", { className: "field-stack", children: [_jsx("span", { className: "field-label", children: "Branch" }), _jsxs("select", { className: "app-select", value: form.branchId, onChange: (event) => setForm((current) => ({ ...current, branchId: event.target.value })), children: [_jsx("option", { value: "", children: "Select Branch" }), branches.map((branch) => _jsx("option", { value: branch.id, children: branch.name }, branch.id))] })] }), _jsxs("label", { className: "field-stack", children: [_jsx("span", { className: "field-label", children: "Asset Category" }), _jsxs("select", { className: "app-select", value: form.assetCategoryId, onChange: (event) => setForm((current) => ({ ...current, assetCategoryId: event.target.value })), children: [_jsx("option", { value: "", children: "Select Category" }), categories.map((item) => _jsxs("option", { value: item.id, children: [item.code, " - ", item.name] }, item.id))] })] }), _jsxs("label", { className: "field-stack", children: [_jsx("span", { className: "field-label", children: "Depreciation Method" }), _jsxs("select", { className: "app-select", value: form.depreciationMethodId, onChange: (event) => setForm((current) => ({ ...current, depreciationMethodId: event.target.value })), children: [_jsx("option", { value: "", children: "Select Method" }), methods.map((item) => _jsxs("option", { value: item.id, children: [item.code, " - ", item.name] }, item.id))] })] }), _jsxs("label", { className: "field-stack", children: [_jsx("span", { className: "field-label", children: "Purchase Date" }), _jsx("input", { className: "app-input", type: "date", value: form.purchaseDate, onChange: (event) => setForm((current) => ({ ...current, purchaseDate: event.target.value })) })] }), _jsxs("label", { className: "field-stack", children: [_jsx("span", { className: "field-label", children: "Capitalization Date" }), _jsx("input", { className: "app-input", type: "date", value: form.capitalizationDate, onChange: (event) => setForm((current) => ({ ...current, capitalizationDate: event.target.value })) })] }), _jsxs("label", { className: "field-stack", children: [_jsx("span", { className: "field-label", children: "Original Cost" }), _jsx("input", { className: "app-input", type: "number", placeholder: "0.00", value: form.originalCost, onChange: (event) => setForm((current) => ({ ...current, originalCost: event.target.value })) })] }), _jsxs("label", { className: "field-stack", children: [_jsx("span", { className: "field-label", children: "Useful Life Months" }), _jsx("input", { className: "app-input", type: "number", placeholder: "36", value: form.usefulLifeMonths, onChange: (event) => setForm((current) => ({ ...current, usefulLifeMonths: event.target.value })) })] }), _jsxs("label", { className: "field-stack", children: [_jsx("span", { className: "field-label", children: "Depreciation Rate" }), _jsx("input", { className: "app-input", type: "number", placeholder: "33.33", value: form.depreciationRate, onChange: (event) => setForm((current) => ({ ...current, depreciationRate: event.target.value })) })] }), _jsxs("label", { className: "field-stack", children: [_jsx("span", { className: "field-label", children: "Salvage Value" }), _jsx("input", { className: "app-input", type: "number", placeholder: "0.00", value: form.salvageValue, onChange: (event) => setForm((current) => ({ ...current, salvageValue: event.target.value })) })] }), _jsxs("label", { className: "field-stack", children: [_jsx("span", { className: "field-label", children: "Insurance Policy" }), _jsx("input", { className: "app-input", placeholder: "Policy Reference", value: form.insurancePolicyNo, onChange: (event) => setForm((current) => ({ ...current, insurancePolicyNo: event.target.value })) })] }), _jsxs("label", { className: "field-stack", children: [_jsx("span", { className: "field-label", children: "Insurance Expiry" }), _jsx("input", { className: "app-input", type: "date", value: form.insuranceExpiryDate, onChange: (event) => setForm((current) => ({ ...current, insuranceExpiryDate: event.target.value })) })] }), _jsxs("label", { className: "field-stack", children: [_jsx("span", { className: "field-label", children: "Current Holder" }), _jsx("input", { className: "app-input", placeholder: "Department or officer", value: form.currentHolder, onChange: (event) => setForm((current) => ({ ...current, currentHolder: event.target.value })) })] }), _jsxs("label", { className: "field-stack", children: [_jsx("span", { className: "field-label", children: "Barcode / Tag No" }), _jsx("input", { className: "app-input", placeholder: "Scan-ready asset tag", value: form.barcodeOrTagNo, onChange: (event) => setForm((current) => ({ ...current, barcodeOrTagNo: event.target.value })) })] })] }), _jsxs("div", { className: "mt-6 flex flex-wrap justify-end gap-3", children: [_jsx("button", { className: "app-button-secondary", onClick: () => navigate("/assets"), children: "Cancel" }), _jsx("button", { className: "app-button-primary", onClick: () => mutation.mutate(), children: isEdit ? "Update Asset" : "Create Asset" })] })] })] }));
};
