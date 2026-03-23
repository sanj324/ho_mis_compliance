import type { ReactElement } from "react";
import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";

import { DataTablePlaceholder } from "../../../components/common/DataTablePlaceholder";
import { PageTitle } from "../../../components/common/PageTitle";
import { userApi } from "../services/userApi";

export const UserListPage = (): ReactElement => {
  const queryClient = useQueryClient();
  const { data = [] } = useQuery({
    queryKey: ["users"],
    queryFn: userApi.list
  });
  const { data: options } = useQuery({
    queryKey: ["users", "options"],
    queryFn: userApi.options
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [formState, setFormState] = useState({
    username: "",
    fullName: "",
    email: "",
    password: "",
    branchId: "",
    roleIds: [] as string[],
    isActive: true,
    approvalState: "APPROVED" as "DRAFT" | "PENDING_APPROVAL" | "APPROVED" | "REJECTED"
  });

  const duplicateUser =
    !editingId && formState.username.trim()
      ? data.find((row) => row.username.trim().toLowerCase() === formState.username.trim().toLowerCase())
      : undefined;

  useEffect(() => {
    const firstRoleId = options?.roles?.[0]?.id;
    if (!formState.roleIds.length && firstRoleId) {
      setFormState((current) => ({ ...current, roleIds: [firstRoleId] }));
    }
  }, [formState.roleIds.length, options?.roles]);

  const resetForm = (): void => {
    setEditingId(null);
    setFormState({
      username: "",
      fullName: "",
      email: "",
      password: "",
      branchId: "",
      roleIds: options?.roles?.[0] ? [options.roles[0].id] : [],
      isActive: true,
      approvalState: "APPROVED"
    });
    setError(null);
  };

  const saveMutation = useMutation({
    mutationFn: async () => {
      setError(null);
      if (editingId) {
        const payload = {
          fullName: formState.fullName,
          branchId: formState.branchId || null,
          isActive: formState.isActive,
          approvalState: formState.approvalState,
          ...(formState.email ? { email: formState.email } : {})
        };

        return userApi.update(editingId, payload);
      }

      const payload = {
        username: formState.username,
        fullName: formState.fullName,
        password: formState.password,
        branchId: formState.branchId || null,
        roleIds: formState.roleIds,
        ...(formState.email ? { email: formState.email } : {})
      };

      return userApi.create(payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      resetForm();
    },
    onError: (mutationError) => {
      const axiosError = mutationError as AxiosError<{ message?: string }>;
      setError(axiosError.response?.data?.message ?? "User save failed. Check permissions, branch, and role selection.");
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      setError(null);
      await userApi.delete(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      resetForm();
    },
    onError: (mutationError) => {
      const axiosError = mutationError as AxiosError<{ message?: string }>;
      setError(axiosError.response?.data?.message ?? "User delete failed. The user may still be referenced by governance or transaction records.");
    }
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <PageTitle title={editingId ? "Edit User" : "Create User"} subtitle={editingId ? "Update User Master" : "User Master"} />
        <button className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700" onClick={resetForm}>
          Reset Form
        </button>
      </div>
      <div className="grid gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-panel md:grid-cols-2 xl:grid-cols-4">
        <input className="rounded-xl border border-slate-200 px-4 py-3" placeholder="Username" value={formState.username} disabled={Boolean(editingId)} onChange={(event) => setFormState((current) => ({ ...current, username: event.target.value }))} />
        <input className="rounded-xl border border-slate-200 px-4 py-3" placeholder="Full Name" value={formState.fullName} onChange={(event) => setFormState((current) => ({ ...current, fullName: event.target.value }))} />
        <input className="rounded-xl border border-slate-200 px-4 py-3" placeholder="Email" value={formState.email} onChange={(event) => setFormState((current) => ({ ...current, email: event.target.value }))} />
        <input className="rounded-xl border border-slate-200 px-4 py-3" placeholder="Password" type="password" value={formState.password} disabled={Boolean(editingId)} onChange={(event) => setFormState((current) => ({ ...current, password: event.target.value }))} />
        <select className="rounded-xl border border-slate-200 px-4 py-3" value={formState.branchId} onChange={(event) => setFormState((current) => ({ ...current, branchId: event.target.value }))}>
          <option value="">No Branch</option>
          {(options?.branches ?? []).map((branch) => (
            <option key={branch.id} value={branch.id}>
              {branch.code} - {branch.name}
            </option>
          ))}
        </select>
        <select className="rounded-xl border border-slate-200 px-4 py-3" value={formState.roleIds[0] ?? ""} disabled={Boolean(editingId)} onChange={(event) => setFormState((current) => ({ ...current, roleIds: event.target.value ? [event.target.value] : [] }))}>
          <option value="">Select Role</option>
          {(options?.roles ?? []).map((role) => (
            <option key={role.id} value={role.id}>
              {role.name}
            </option>
          ))}
        </select>
        <select className="rounded-xl border border-slate-200 px-4 py-3" value={formState.approvalState} onChange={(event) => setFormState((current) => ({ ...current, approvalState: event.target.value as "DRAFT" | "PENDING_APPROVAL" | "APPROVED" | "REJECTED" }))}>
          <option value="DRAFT">Draft</option>
          <option value="PENDING_APPROVAL">Pending Approval</option>
          <option value="APPROVED">Approved</option>
          <option value="REJECTED">Rejected</option>
        </select>
        <label className="flex items-center gap-3 rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-700">
          <input type="checkbox" checked={formState.isActive} onChange={(event) => setFormState((current) => ({ ...current, isActive: event.target.checked }))} />
          Active
        </label>
        <button className="rounded-xl bg-brand-500 px-4 py-3 text-sm font-medium text-white disabled:cursor-not-allowed disabled:bg-slate-300" onClick={() => saveMutation.mutate()} disabled={saveMutation.isPending || Boolean(duplicateUser)}>
          {editingId ? "Update User" : "Create User"}
        </button>
      </div>
      {duplicateUser ? <p className="text-sm text-amber-600">Username already exists: {duplicateUser.username}. Use a new username or edit the existing user.</p> : null}
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      <DataTablePlaceholder
        columns={["username", "fullName", "email", "isActive"]}
        rows={data.map((row) => ({
          username: row.username,
          fullName: row.fullName,
          email: row.email ?? "-",
          isActive: row.isActive ? "Yes" : "No"
        }))}
      />
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-panel">
        <div className="space-y-3">
          {data.map((row) => (
            <div key={row.id} className="flex items-center justify-between rounded-xl border border-slate-200 px-4 py-3">
              <div>
                <p className="font-medium text-slate-900">{row.fullName}</p>
                <p className="text-sm text-slate-500">{row.username} | {(row.userRoles ?? []).map((item) => item.role.name).join(", ") || "-"}</p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  className="rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-700"
                  onClick={() => {
                    setEditingId(row.id);
                    setFormState({
                      username: row.username,
                      fullName: row.fullName,
                      email: row.email ?? "",
                      password: "",
                      branchId: row.branch?.id ?? "",
                      roleIds: (row.userRoles ?? []).map((item) => item.role.id),
                      isActive: row.isActive,
                      approvalState: row.approvalState ?? "APPROVED"
                    });
                    setError(null);
                  }}
                >
                  Edit User
                </button>
                <button
                  className="rounded-lg border border-red-200 px-3 py-2 text-sm text-red-700 disabled:cursor-not-allowed disabled:opacity-60"
                  disabled={deleteMutation.isPending}
                  onClick={() => {
                    if (!window.confirm(`Delete user ${row.username}? This cannot be undone.`)) {
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
