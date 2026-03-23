import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { PageTitle } from "../../../components/common/PageTitle";
import { stationeryApi } from "../services/stationeryApi";
export const ItemFormPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const queryClient = useQueryClient();
    const [itemCode, setItemCode] = useState("");
    const [itemName, setItemName] = useState("");
    const [itemCategoryId, setItemCategoryId] = useState("");
    const [unitOfMeasure, setUnitOfMeasure] = useState("PCS");
    const [reorderLevel, setReorderLevel] = useState("0");
    const [maxLevel, setMaxLevel] = useState("0");
    const [gstRate, setGstRate] = useState("0");
    const template = location.state?.template;
    useEffect(() => {
        if (!template)
            return;
        setItemCode(template.itemCode ?? "");
        setItemName(template.itemName ?? "");
        setItemCategoryId(template.itemCategoryId ?? "");
        setUnitOfMeasure(template.unitOfMeasure ?? "PCS");
        setReorderLevel(String(template.reorderLevel ?? 0));
        setMaxLevel(String(template.maxLevel ?? 0));
        setGstRate(String(template.gstRate ?? 0));
    }, [template]);
    const { data: categories = [] } = useQuery({ queryKey: ["stationery", "categories"], queryFn: stationeryApi.listCategories });
    const mutation = useMutation({
        mutationFn: () => stationeryApi.createItem({
            itemCode,
            itemName,
            itemCategoryId,
            unitOfMeasure,
            reorderLevel: Number(reorderLevel),
            maxLevel: Number(maxLevel),
            gstRate: Number(gstRate)
        }),
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ["stationery", "items"] });
            navigate("/stationery/items");
        }
    });
    return (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsx(PageTitle, { title: "Create Item", subtitle: "Inventory Item Setup" }), _jsx("button", { className: "rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700", onClick: () => { setItemCode(""); setItemName(""); setItemCategoryId(""); setUnitOfMeasure("PCS"); setReorderLevel("0"); setMaxLevel("0"); setGstRate("0"); }, children: "Reset Form" })] }), _jsxs("div", { className: "grid gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-panel md:grid-cols-2 xl:grid-cols-3", children: [_jsx("input", { className: "rounded-xl border border-slate-200 px-4 py-3", placeholder: "Item Code", value: itemCode, onChange: (event) => setItemCode(event.target.value) }), _jsx("input", { className: "rounded-xl border border-slate-200 px-4 py-3", placeholder: "Item Name", value: itemName, onChange: (event) => setItemName(event.target.value) }), _jsxs("select", { className: "rounded-xl border border-slate-200 px-4 py-3", value: itemCategoryId, onChange: (event) => setItemCategoryId(event.target.value), children: [_jsx("option", { value: "", children: "Select Category" }), categories.map((category) => _jsxs("option", { value: category.id, children: [category.code, " - ", category.name] }, category.id))] }), _jsx("input", { className: "rounded-xl border border-slate-200 px-4 py-3", placeholder: "Unit Of Measure", value: unitOfMeasure, onChange: (event) => setUnitOfMeasure(event.target.value) }), _jsx("input", { className: "rounded-xl border border-slate-200 px-4 py-3", type: "number", placeholder: "Reorder Level", value: reorderLevel, onChange: (event) => setReorderLevel(event.target.value) }), _jsx("input", { className: "rounded-xl border border-slate-200 px-4 py-3", type: "number", placeholder: "Max Level", value: maxLevel, onChange: (event) => setMaxLevel(event.target.value) }), _jsx("input", { className: "rounded-xl border border-slate-200 px-4 py-3", type: "number", placeholder: "GST Rate", value: gstRate, onChange: (event) => setGstRate(event.target.value) })] }), _jsxs("div", { className: "flex justify-end gap-3", children: [_jsx("button", { className: "rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700", onClick: () => navigate("/stationery/items"), children: "Back To List" }), _jsx("button", { className: "rounded-lg bg-brand-500 px-4 py-2 text-sm font-medium text-white", onClick: () => mutation.mutate(), children: "Create Item" })] })] }));
};
