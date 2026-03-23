import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
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
export const BranchListPage = () => {
    const queryClient = useQueryClient();
    const { data = [] } = useQuery({
        queryKey: ["branches"],
        queryFn: branchApi.list
    });
    const [editingId, setEditingId] = useState(null);
    const [formState, setFormState] = useState(emptyForm);
    const [error, setError] = useState(null);
    const duplicateBranch = !editingId && formState.code.trim()
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
            const axiosError = mutationError;
            setError(axiosError.response?.data?.message ?? "Branch save failed. Check permissions and required fields.");
        }
    });
    const rows = useMemo(() => data.map((row) => ({
        code: row.code,
        name: row.name,
        city: row.city ?? "-",
        state: row.state ?? "-",
        status: row.isActive ? "Active" : "Inactive"
    })), [data]);
    return (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsx(PageTitle, { title: editingId ? "Edit Branch" : "Create Branch", subtitle: editingId ? "Update Branch Master" : "Branch Master" }), _jsx("button", { className: "rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700", onClick: () => {
                            setEditingId(null);
                            setFormState(emptyForm);
                            setError(null);
                        }, children: "Reset Form" })] }), _jsxs("div", { className: "grid gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-panel md:grid-cols-2 xl:grid-cols-4", children: [_jsx("input", { className: "rounded-xl border border-slate-200 px-4 py-3", placeholder: "Code", value: formState.code, disabled: Boolean(editingId), onChange: (event) => setFormState((current) => ({ ...current, code: event.target.value })) }), _jsx("input", { className: "rounded-xl border border-slate-200 px-4 py-3", placeholder: "Name", value: formState.name, onChange: (event) => setFormState((current) => ({ ...current, name: event.target.value })) }), _jsx("input", { className: "rounded-xl border border-slate-200 px-4 py-3", placeholder: "Address", value: formState.addressLine1, onChange: (event) => setFormState((current) => ({ ...current, addressLine1: event.target.value })) }), _jsx("input", { className: "rounded-xl border border-slate-200 px-4 py-3", placeholder: "City", value: formState.city, onChange: (event) => setFormState((current) => ({ ...current, city: event.target.value })) }), _jsx("input", { className: "rounded-xl border border-slate-200 px-4 py-3", placeholder: "State", value: formState.state, onChange: (event) => setFormState((current) => ({ ...current, state: event.target.value })) }), _jsxs("label", { className: "flex items-center gap-3 rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-700", children: [_jsx("input", { type: "checkbox", checked: formState.isHeadOffice, onChange: (event) => setFormState((current) => ({ ...current, isHeadOffice: event.target.checked })) }), "Head Office"] }), _jsxs("label", { className: "flex items-center gap-3 rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-700", children: [_jsx("input", { type: "checkbox", checked: formState.isActive, onChange: (event) => setFormState((current) => ({ ...current, isActive: event.target.checked })) }), "Active"] }), _jsx("button", { className: "rounded-xl bg-brand-500 px-4 py-3 text-sm font-medium text-white disabled:cursor-not-allowed disabled:bg-slate-300", onClick: () => saveMutation.mutate(), disabled: saveMutation.isPending || Boolean(duplicateBranch), children: editingId ? "Update Branch" : "Create Branch" })] }), duplicateBranch ? _jsxs("p", { className: "text-sm text-amber-600", children: ["Branch code already exists: ", duplicateBranch.code, ". Use a new code or edit the existing branch."] }) : null, error ? _jsx("p", { className: "text-sm text-red-600", children: error }) : null, _jsx(DataTablePlaceholder, { columns: ["code", "name", "city", "state", "status"], rows: rows }), _jsx("div", { className: "rounded-2xl border border-slate-200 bg-white p-4 shadow-panel", children: _jsx("div", { className: "space-y-3", children: data.map((row) => (_jsxs("div", { className: "flex items-center justify-between rounded-xl border border-slate-200 px-4 py-3", children: [_jsxs("div", { children: [_jsx("p", { className: "font-medium text-slate-900", children: row.name }), _jsxs("p", { className: "text-sm text-slate-500", children: [row.code, " | ", row.city ?? "-", ", ", row.state ?? "-"] })] }), _jsx("button", { className: "rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-700", onClick: () => {
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
                                }, children: "Edit Branch" })] }, row.id))) }) })] }));
};
