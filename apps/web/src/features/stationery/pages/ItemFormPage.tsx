import type { ReactElement } from "react";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { PageTitle } from "../../../components/common/PageTitle";
import { stationeryApi } from "../services/stationeryApi";

export const ItemFormPage = (): ReactElement => {
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
  const template = (location.state as { template?: {
    itemCode?: string;
    itemName?: string;
    itemCategoryId?: string;
    unitOfMeasure?: string;
    reorderLevel?: number;
    maxLevel?: number;
    gstRate?: number;
  } } | null)?.template;

  useEffect(() => {
    if (!template) {
      return;
    }

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
    mutationFn: () =>
      stationeryApi.createItem({
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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <PageTitle title="Create Item" subtitle="Inventory Item Setup" />
        <button
          className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700"
          onClick={() => {
            setItemCode("");
            setItemName("");
            setItemCategoryId("");
            setUnitOfMeasure("PCS");
            setReorderLevel("0");
            setMaxLevel("0");
            setGstRate("0");
          }}
        >
          Reset Form
        </button>
      </div>
      <div className="grid gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-panel md:grid-cols-2 xl:grid-cols-3">
        <input className="rounded-xl border border-slate-200 px-4 py-3" placeholder="Item Code" value={itemCode} onChange={(event) => setItemCode(event.target.value)} />
        <input className="rounded-xl border border-slate-200 px-4 py-3" placeholder="Item Name" value={itemName} onChange={(event) => setItemName(event.target.value)} />
        <select className="rounded-xl border border-slate-200 px-4 py-3" value={itemCategoryId} onChange={(event) => setItemCategoryId(event.target.value)}>
          <option value="">Select Category</option>
          {categories.map((category) => <option key={category.id} value={category.id}>{category.code} - {category.name}</option>)}
        </select>
        <input className="rounded-xl border border-slate-200 px-4 py-3" placeholder="Unit Of Measure" value={unitOfMeasure} onChange={(event) => setUnitOfMeasure(event.target.value)} />
        <input className="rounded-xl border border-slate-200 px-4 py-3" type="number" placeholder="Reorder Level" value={reorderLevel} onChange={(event) => setReorderLevel(event.target.value)} />
        <input className="rounded-xl border border-slate-200 px-4 py-3" type="number" placeholder="Max Level" value={maxLevel} onChange={(event) => setMaxLevel(event.target.value)} />
        <input className="rounded-xl border border-slate-200 px-4 py-3" type="number" placeholder="GST Rate" value={gstRate} onChange={(event) => setGstRate(event.target.value)} />
      </div>
      <div className="flex justify-end gap-3">
        <button className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700" onClick={() => navigate("/stationery/items")}>
          Back To List
        </button>
        <button className="rounded-lg bg-brand-500 px-4 py-2 text-sm font-medium text-white" onClick={() => mutation.mutate()}>
          Create Item
        </button>
      </div>
    </div>
  );
};
