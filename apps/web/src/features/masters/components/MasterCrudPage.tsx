import type { ReactElement } from "react";
import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";

import { DataTablePlaceholder } from "../../../components/common/DataTablePlaceholder";
import { PageTitle } from "../../../components/common/PageTitle";
import { branchApi } from "../../branches/services/branchApi";
import type { MasterApprovalState, MasterCreatePayload, MasterItem, MasterUpdatePayload } from "../services/masterApi";

type MasterCrudPageProps = {
  entityLabel: string;
  subtitle: string;
  queryKey: string;
  listQuery: () => Promise<MasterItem[]>;
  createMutation: (payload: MasterCreatePayload) => Promise<MasterItem>;
  updateMutation: (id: string, payload: MasterUpdatePayload) => Promise<MasterItem>;
  deleteMutation: (id: string) => Promise<void>;
};

const emptyForm = {
  code: "",
  name: "",
  branchId: "",
  isActive: true,
  approvalState: "APPROVED" as MasterApprovalState
};

export const MasterCrudPage = ({
  entityLabel,
  subtitle,
  queryKey,
  listQuery,
  createMutation,
  updateMutation,
  deleteMutation
}: MasterCrudPageProps): ReactElement => {
  const queryClient = useQueryClient();
  const { data = [] } = useQuery({
    queryKey: ["masters", queryKey],
    queryFn: listQuery
  });
  const { data: branches = [] } = useQuery({
    queryKey: ["branches", "options"],
    queryFn: branchApi.list
  });

  const [editingId, setEditingId] = useState<string | null>(null);
  const [formState, setFormState] = useState(emptyForm);
  const [error, setError] = useState<string | null>(null);

  const duplicateRecord =
    !editingId && formState.code.trim()
      ? data.find((row) => row.code.trim().toLowerCase() === formState.code.trim().toLowerCase())
      : undefined;

  const resetForm = (): void => {
    setEditingId(null);
    setFormState(emptyForm);
    setError(null);
  };

  const saveMutation = useMutation({
    mutationFn: async () => {
      setError(null);

      if (editingId) {
        const payload: MasterUpdatePayload = {
          name: formState.name,
          branchId: formState.branchId || null,
          isActive: formState.isActive,
          approvalState: formState.approvalState
        };
        return updateMutation(editingId, payload);
      }

      const payload: MasterCreatePayload = {
        code: formState.code,
        name: formState.name,
        isActive: formState.isActive,
        ...(formState.branchId ? { branchId: formState.branchId } : {})
      };
      return createMutation(payload);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["masters", queryKey] });
      resetForm();
    },
    onError: (mutationError) => {
      const axiosError = mutationError as AxiosError<{ message?: string }>;
      setError(axiosError.response?.data?.message ?? `${entityLabel} save failed.`);
    }
  });

  const deleteRecordMutation = useMutation({
    mutationFn: deleteMutation,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["masters", queryKey] });
      if (editingId) {
        resetForm();
      }
    },
    onError: (mutationError) => {
      const axiosError = mutationError as AxiosError<{ message?: string }>;
      setError(axiosError.response?.data?.message ?? `${entityLabel} delete failed.`);
    }
  });

  const rows = useMemo(
    () =>
      data.map((row) => ({
        code: row.code,
        name: row.name,
        branch: row.branch?.code ?? "Global",
        status: row.isActive ? "Active" : "Inactive"
      })),
    [data]
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <PageTitle title={editingId ? `Edit ${entityLabel}` : `Create ${entityLabel}`} subtitle={subtitle} />
        <button className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700" onClick={resetForm}>
          Reset Form
        </button>
      </div>

      <div className="grid gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-panel md:grid-cols-2 xl:grid-cols-4">
        <input className="rounded-xl border border-slate-200 px-4 py-3" placeholder="Code" value={formState.code} disabled={Boolean(editingId)} onChange={(event) => setFormState((current) => ({ ...current, code: event.target.value }))} />
        <input className="rounded-xl border border-slate-200 px-4 py-3" placeholder="Name" value={formState.name} onChange={(event) => setFormState((current) => ({ ...current, name: event.target.value }))} />
        <select className="rounded-xl border border-slate-200 px-4 py-3" value={formState.branchId} onChange={(event) => setFormState((current) => ({ ...current, branchId: event.target.value }))}>
          <option value="">All Branches / Global</option>
          {branches.map((branch) => (
            <option key={branch.id} value={branch.id}>
              {branch.code} - {branch.name}
            </option>
          ))}
        </select>
        <select className="rounded-xl border border-slate-200 px-4 py-3" value={formState.approvalState} onChange={(event) => setFormState((current) => ({ ...current, approvalState: event.target.value as MasterApprovalState }))}>
          <option value="DRAFT">Draft</option>
          <option value="PENDING_APPROVAL">Pending Approval</option>
          <option value="APPROVED">Approved</option>
          <option value="REJECTED">Rejected</option>
        </select>
        <label className="flex items-center gap-3 rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-700">
          <input type="checkbox" checked={formState.isActive} onChange={(event) => setFormState((current) => ({ ...current, isActive: event.target.checked }))} />
          Active
        </label>
        <button className="rounded-xl bg-brand-500 px-4 py-3 text-sm font-medium text-white disabled:cursor-not-allowed disabled:bg-slate-300" onClick={() => saveMutation.mutate()} disabled={saveMutation.isPending || Boolean(duplicateRecord)}>
          {editingId ? `Update ${entityLabel}` : `Create ${entityLabel}`}
        </button>
      </div>

      {duplicateRecord ? <p className="text-sm text-amber-600">{entityLabel} code already exists: {duplicateRecord.code}. Use a new code or edit the existing record.</p> : null}
      {error ? <p className="text-sm text-red-600">{error}</p> : null}

      <DataTablePlaceholder columns={["code", "name", "branch", "status"]} rows={rows} />

      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-panel">
        <div className="space-y-3">
          {data.map((row) => (
            <div key={row.id} className="flex items-center justify-between rounded-xl border border-slate-200 px-4 py-3">
              <div>
                <p className="font-medium text-slate-900">{row.name}</p>
                <p className="text-sm text-slate-500">{row.code} | {row.branch?.name ?? "Global"} | {row.isActive ? "Active" : "Inactive"}</p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  className="rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-700"
                  onClick={() => {
                    setEditingId(row.id);
                    setFormState({
                      code: row.code,
                      name: row.name,
                      branchId: row.branchId ?? "",
                      isActive: row.isActive ?? true,
                      approvalState: row.approvalState ?? "APPROVED"
                    });
                    setError(null);
                  }}
                >
                  Edit {entityLabel}
                </button>
                <button
                  className="rounded-lg border border-red-200 px-3 py-2 text-sm text-red-700 disabled:cursor-not-allowed disabled:opacity-60"
                  onClick={() => deleteRecordMutation.mutate(row.id)}
                  disabled={deleteRecordMutation.isPending}
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
