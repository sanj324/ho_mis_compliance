import type { ReactElement } from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

import { DataTablePlaceholder } from "../../../components/common/DataTablePlaceholder";
import { PageTitle } from "../../../components/common/PageTitle";
import { stationeryApi } from "../services/stationeryApi";

export const ItemListPage = (): ReactElement => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const { data = [] } = useQuery({ queryKey: ["stationery", "items"], queryFn: stationeryApi.listItems });

  const filtered = data.filter(
    (item) =>
      item.itemCode.toLowerCase().includes(search.toLowerCase()) ||
      item.itemName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <PageTitle title="Stationery Items" subtitle="Inventory Master" />
        <button className="rounded-lg bg-brand-500 px-4 py-2 text-sm font-medium text-white" onClick={() => navigate("/stationery/items/new")}>
          Add Item
        </button>
      </div>
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-panel">
        <input className="w-full rounded-xl border border-slate-200 px-4 py-3" placeholder="Search by code or name" value={search} onChange={(event) => setSearch(event.target.value)} />
      </div>
      <DataTablePlaceholder
        columns={["itemCode", "itemName", "unitOfMeasure", "reorderLevel", "maxLevel"]}
        rows={filtered.map((row) => ({
          itemCode: row.itemCode,
          itemName: row.itemName,
          unitOfMeasure: row.unitOfMeasure,
          reorderLevel: row.reorderLevel.toFixed(2),
          maxLevel: row.maxLevel.toFixed(2)
        }))}
      />
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-panel">
        <div className="space-y-3">
          {filtered.map((row) => (
            <div key={row.id} className="flex items-center justify-between rounded-xl border border-slate-200 px-4 py-3">
              <div>
                <p className="font-medium text-slate-900">{row.itemName}</p>
                <p className="text-sm text-slate-500">
                  {row.itemCode} | {row.unitOfMeasure} | Reorder {row.reorderLevel.toFixed(2)}
                </p>
              </div>
              <button
                className="rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-700"
                onClick={() =>
                  navigate("/stationery/items/new", {
                    state: {
                      template: {
                        itemCode: "",
                        itemName: row.itemName,
                        itemCategoryId: row.itemCategory?.id ?? "",
                        unitOfMeasure: row.unitOfMeasure,
                        reorderLevel: row.reorderLevel,
                        maxLevel: row.maxLevel,
                        gstRate: row.gstRate
                      }
                    }
                  })
                }
              >
                Create Similar
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
