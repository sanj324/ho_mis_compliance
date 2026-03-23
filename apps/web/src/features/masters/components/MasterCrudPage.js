import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { DataTablePlaceholder } from "../../../components/common/DataTablePlaceholder";
import { PageTitle } from "../../../components/common/PageTitle";
import { branchApi } from "../../branches/services/branchApi";
const emptyForm = {
    code: "",
    name: "",
    branchId: "",
    isActive: true,
    approvalState: "APPROVED"
};
export const MasterCrudPage = ({ entityLabel, subtitle, queryKey, listQuery, createMutation, updateMutation, deleteMutation }) => {
    const queryClient = useQueryClient();
    const { data = [] } = useQuery({
        queryKey: ["masters", queryKey],
        queryFn: listQuery
    });
    const { data: branches = [] } = useQuery({
        queryKey: ["branches", "options"],
        queryFn: branchApi.list
    });
    const [editingId, setEditingId] = useState(null);
    const [formState, setFormState] = useState(emptyForm);
    const [error, setError] = useState(null);
    const duplicateRecord = !editingId && formState.code.trim()
        ? data.find((row) => row.code.trim().toLowerCase() === formState.code.trim().toLowerCase())
        : undefined;
    const resetForm = () => {
        setEditingId(null);
        setFormState(emptyForm);
        setError(null);
    };
    const saveMutation = useMutation({
        mutationFn: async () => {
            setError(null);
            if (editingId) {
                const payload = {
                    name: formState.name,
                    branchId: formState.branchId || null,
                    isActive: formState.isActive,
                    approvalState: formState.approvalState
                };
                return updateMutation(editingId, payload);
            }
            const payload = {
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
            const axiosError = mutationError;
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
            const axiosError = mutationError;
            setError(axiosError.response?.data?.message ?? `${entityLabel} delete failed.`);
        }
    });
    const rows = useMemo(() => data.map((row) => ({
        code: row.code,
        name: row.name,
        branch: row.branch?.code ?? "Global",
        status: row.isActive ? "Active" : "Inactive"
    })), [data]);
    return (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsx(PageTitle, { title: editingId ? `Edit ${entityLabel}` : `Create ${entityLabel}`, subtitle: subtitle }), _jsx("button", { className: "rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700", onClick: resetForm, children: "Reset Form" })] }), _jsxs("div", { className: "grid gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-panel md:grid-cols-2 xl:grid-cols-4", children: [_jsx("input", { className: "rounded-xl border border-slate-200 px-4 py-3", placeholder: "Code", value: formState.code, disabled: Boolean(editingId), onChange: (event) => setFormState((current) => ({ ...current, code: event.target.value })) }), _jsx("input", { className: "rounded-xl border border-slate-200 px-4 py-3", placeholder: "Name", value: formState.name, onChange: (event) => setFormState((current) => ({ ...current, name: event.target.value })) }), _jsxs("select", { className: "rounded-xl border border-slate-200 px-4 py-3", value: formState.branchId, onChange: (event) => setFormState((current) => ({ ...current, branchId: event.target.value })), children: [_jsx("option", { value: "", children: "All Branches / Global" }), branches.map((branch) => (_jsxs("option", { value: branch.id, children: [branch.code, " - ", branch.name] }, branch.id)))] }), _jsxs("select", { className: "rounded-xl border border-slate-200 px-4 py-3", value: formState.approvalState, onChange: (event) => setFormState((current) => ({ ...current, approvalState: event.target.value })), children: [_jsx("option", { value: "DRAFT", children: "Draft" }), _jsx("option", { value: "PENDING_APPROVAL", children: "Pending Approval" }), _jsx("option", { value: "APPROVED", children: "Approved" }), _jsx("option", { value: "REJECTED", children: "Rejected" })] }), _jsxs("label", { className: "flex items-center gap-3 rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-700", children: [_jsx("input", { type: "checkbox", checked: formState.isActive, onChange: (event) => setFormState((current) => ({ ...current, isActive: event.target.checked })) }), "Active"] }), _jsx("button", { className: "rounded-xl bg-brand-500 px-4 py-3 text-sm font-medium text-white disabled:cursor-not-allowed disabled:bg-slate-300", onClick: () => saveMutation.mutate(), disabled: saveMutation.isPending || Boolean(duplicateRecord), children: editingId ? `Update ${entityLabel}` : `Create ${entityLabel}` })] }), duplicateRecord ? _jsxs("p", { className: "text-sm text-amber-600", children: [entityLabel, " code already exists: ", duplicateRecord.code, ". Use a new code or edit the existing record."] }) : null, error ? _jsx("p", { className: "text-sm text-red-600", children: error }) : null, _jsx(DataTablePlaceholder, { columns: ["code", "name", "branch", "status"], rows: rows }), _jsx("div", { className: "rounded-2xl border border-slate-200 bg-white p-4 shadow-panel", children: _jsx("div", { className: "space-y-3", children: data.map((row) => (_jsxs("div", { className: "flex items-center justify-between rounded-xl border border-slate-200 px-4 py-3", children: [_jsxs("div", { children: [_jsx("p", { className: "font-medium text-slate-900", children: row.name }), _jsxs("p", { className: "text-sm text-slate-500", children: [row.code, " | ", row.branch?.name ?? "Global", " | ", row.isActive ? "Active" : "Inactive"] })] }), _jsxs("div", { className: "flex items-center gap-3", children: [_jsxs("button", { className: "rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-700", onClick: () => {
                                            setEditingId(row.id);
                                            setFormState({
                                                code: row.code,
                                                name: row.name,
                                                branchId: row.branchId ?? "",
                                                isActive: row.isActive ?? true,
                                                approvalState: row.approvalState ?? "APPROVED"
                                            });
                                            setError(null);
                                        }, children: ["Edit ", entityLabel] }), _jsx("button", { className: "rounded-lg border border-red-200 px-3 py-2 text-sm text-red-700 disabled:cursor-not-allowed disabled:opacity-60", onClick: () => deleteRecordMutation.mutate(row.id), disabled: deleteRecordMutation.isPending, children: "Delete" })] })] }, row.id))) }) })] }));
};
