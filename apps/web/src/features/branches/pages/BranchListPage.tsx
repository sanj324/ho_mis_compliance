import type { ReactElement } from "react";
import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";

import { DataTablePlaceholder } from "../../../components/common/DataTablePlaceholder";
import { PageTitle } from "../../../components/common/PageTitle";
import { branchApi } from "../services/branchApi";

const emptyForm = {
  code: "",
  name: "",
  addressLine1: "",
  city: "",
  state: "",
  isHeadOffice: false,
  isActive: true
};

export const BranchListPage = (): ReactElement => {
  const queryClient = useQueryClient();
  const { data = [] } = useQuery({
    queryKey: ["branches"],
    queryFn: branchApi.list
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formState, setFormState] = useState(emptyForm);
  const [error, setError] = useState<string | null>(null);

  const duplicateBranch =
    !editingId && formState.code.trim()
      ? data.find((row) => row.code.trim().toLowerCase() === formState.code.trim().toLowerCase())
      : undefined;

  const saveMutation = useMutation({
    mutationFn: async () => {
      setError(null);
      if (editingId) {
        const payload = {
          name: formState.name,
          isHeadOffice: formState.isHeadOffice,
          isActive: formState.isActive,
          ...(formState.addressLine1 ? { addressLine1: formState.addressLine1 } : {}),
          ...(formState.city ? { city: formState.city } : {}),
          ...(formState.state ? { state: formState.state } : {})
        };

        return branchApi.update(editingId, payload);
      }

      const payload = {
        code: formState.code,
        name: formState.name,
        isHeadOffice: formState.isHeadOffice,
        ...(formState.addressLine1 ? { addressLine1: formState.addressLine1 } : {}),
        ...(formState.city ? { city: formState.city } : {}),
        ...(formState.state ? { state: formState.state } : {})
      };

      return branchApi.create(payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["branches"] });
      setEditingId(null);
      setFormState(emptyForm);
    },
    onError: (mutationError) => {
      const axiosError = mutationError as AxiosError<{ message?: string }>;
      setError(axiosError.response?.data?.message ?? "Branch save failed. Check permissions and required fields.");
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      setError(null);
      await branchApi.delete(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["branches"] });
      setEditingId(null);
      setFormState(emptyForm);
    },
    onError: (mutationError) => {
      const axiosError = mutationError as AxiosError<{ message?: string }>;
      setError(axiosError.response?.data?.message ?? "Branch delete failed. The branch may still be referenced by operational records.");
    }
  });

  const rows = useMemo(
    () =>
      data.map((row) => ({
        code: row.code,
        name: row.name,
        city: row.city ?? "-",
        state: row.state ?? "-",
        status: row.isActive ? "Active" : "Inactive"
      })),
    [data]
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <PageTitle title={editingId ? "Edit Branch" : "Create Branch"} subtitle={editingId ? "Update Branch Master" : "Branch Master"} />
        <button
          className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700"
          onClick={() => {
            setEditingId(null);
            setFormState(emptyForm);
            setError(null);
          }}
        >
          Reset Form
        </button>
      </div>
      <div className="grid gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-panel md:grid-cols-2 xl:grid-cols-4">
        <input className="rounded-xl border border-slate-200 px-4 py-3" placeholder="Code" value={formState.code} disabled={Boolean(editingId)} onChange={(event) => setFormState((current) => ({ ...current, code: event.target.value }))} />
        <input className="rounded-xl border border-slate-200 px-4 py-3" placeholder="Name" value={formState.name} onChange={(event) => setFormState((current) => ({ ...current, name: event.target.value }))} />
        <input className="rounded-xl border border-slate-200 px-4 py-3" placeholder="Address" value={formState.addressLine1} onChange={(event) => setFormState((current) => ({ ...current, addressLine1: event.target.value }))} />
        <input className="rounded-xl border border-slate-200 px-4 py-3" placeholder="City" value={formState.city} onChange={(event) => setFormState((current) => ({ ...current, city: event.target.value }))} />
        <input className="rounded-xl border border-slate-200 px-4 py-3" placeholder="State" value={formState.state} onChange={(event) => setFormState((current) => ({ ...current, state: event.target.value }))} />
        <label className="flex items-center gap-3 rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-700">
          <input type="checkbox" checked={formState.isHeadOffice} onChange={(event) => setFormState((current) => ({ ...current, isHeadOffice: event.target.checked }))} />
          Head Office
        </label>
        <label className="flex items-center gap-3 rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-700">
          <input type="checkbox" checked={formState.isActive} onChange={(event) => setFormState((current) => ({ ...current, isActive: event.target.checked }))} />
          Active
        </label>
        <button className="rounded-xl bg-brand-500 px-4 py-3 text-sm font-medium text-white disabled:cursor-not-allowed disabled:bg-slate-300" onClick={() => saveMutation.mutate()} disabled={saveMutation.isPending || Boolean(duplicateBranch)}>
          {editingId ? "Update Branch" : "Create Branch"}
        </button>
      </div>
      {duplicateBranch ? <p className="text-sm text-amber-600">Branch code already exists: {duplicateBranch.code}. Use a new code or edit the existing branch.</p> : null}
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      <DataTablePlaceholder columns={["code", "name", "city", "state", "status"]} rows={rows} />
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-panel">
        <div className="space-y-3">
          {data.map((row) => (
            <div key={row.id} className="flex items-center justify-between rounded-xl border border-slate-200 px-4 py-3">
              <div>
                <p className="font-medium text-slate-900">{row.name}</p>
                <p className="text-sm text-slate-500">{row.code} | {row.city ?? "-"}, {row.state ?? "-"}</p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  className="rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-700"
                  onClick={() => {
                    setEditingId(row.id);
                    setFormState({
                      code: row.code,
                      name: row.name,
                      addressLine1: row.addressLine1 ?? "",
                      city: row.city ?? "",
                      state: row.state ?? "",
                      isHeadOffice: row.isHeadOffice ?? false,
                      isActive: row.isActive ?? true
                    });
                    setError(null);
                  }}
                >
                  Edit Branch
                </button>
                <button
                  className="rounded-lg border border-red-200 px-3 py-2 text-sm text-red-700 disabled:cursor-not-allowed disabled:opacity-60"
                  disabled={deleteMutation.isPending}
                  onClick={() => {
                    if (!window.confirm(`Delete branch ${row.code}? This cannot be undone.`)) {
                      return;
                    }

                    deleteMutation.mutate(row.id);
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
