import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { DataTablePlaceholder } from "../../../components/common/DataTablePlaceholder";
import { PageTitle } from "../../../components/common/PageTitle";
import { userApi } from "../services/userApi";
export const UserListPage = () => {
    const queryClient = useQueryClient();
    const { data = [] } = useQuery({
        queryKey: ["users"],
        queryFn: userApi.list
    });
    const { data: options } = useQuery({
        queryKey: ["users", "options"],
        queryFn: userApi.options
    });
    const [editingId, setEditingId] = useState(null);
    const [error, setError] = useState(null);
    const [formState, setFormState] = useState({
        username: "",
        fullName: "",
        email: "",
        password: "",
        branchId: "",
        roleIds: [],
        isActive: true,
        approvalState: "APPROVED"
    });
    const duplicateUser = !editingId && formState.username.trim()
        ? data.find((row) => row.username.trim().toLowerCase() === formState.username.trim().toLowerCase())
        : undefined;
    useEffect(() => {
        const firstRoleId = options?.roles?.[0]?.id;
        if (!formState.roleIds.length && firstRoleId) {
            setFormState((current) => ({ ...current, roleIds: [firstRoleId] }));
        }
    }, [formState.roleIds.length, options?.roles]);
    const resetForm = () => {
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
            const axiosError = mutationError;
            setError(axiosError.response?.data?.message ?? "User save failed. Check permissions, branch, and role selection.");
        }
    });
    return (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsx(PageTitle, { title: editingId ? "Edit User" : "Create User", subtitle: editingId ? "Update User Master" : "User Master" }), _jsx("button", { className: "rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700", onClick: resetForm, children: "Reset Form" })] }), _jsxs("div", { className: "grid gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-panel md:grid-cols-2 xl:grid-cols-4", children: [_jsx("input", { className: "rounded-xl border border-slate-200 px-4 py-3", placeholder: "Username", value: formState.username, disabled: Boolean(editingId), onChange: (event) => setFormState((current) => ({ ...current, username: event.target.value })) }), _jsx("input", { className: "rounded-xl border border-slate-200 px-4 py-3", placeholder: "Full Name", value: formState.fullName, onChange: (event) => setFormState((current) => ({ ...current, fullName: event.target.value })) }), _jsx("input", { className: "rounded-xl border border-slate-200 px-4 py-3", placeholder: "Email", value: formState.email, onChange: (event) => setFormState((current) => ({ ...current, email: event.target.value })) }), _jsx("input", { className: "rounded-xl border border-slate-200 px-4 py-3", placeholder: "Password", type: "password", value: formState.password, disabled: Boolean(editingId), onChange: (event) => setFormState((current) => ({ ...current, password: event.target.value })) }), _jsxs("select", { className: "rounded-xl border border-slate-200 px-4 py-3", value: formState.branchId, onChange: (event) => setFormState((current) => ({ ...current, branchId: event.target.value })), children: [_jsx("option", { value: "", children: "No Branch" }), (options?.branches ?? []).map((branch) => (_jsxs("option", { value: branch.id, children: [branch.code, " - ", branch.name] }, branch.id)))] }), _jsxs("select", { className: "rounded-xl border border-slate-200 px-4 py-3", value: formState.roleIds[0] ?? "", disabled: Boolean(editingId), onChange: (event) => setFormState((current) => ({ ...current, roleIds: event.target.value ? [event.target.value] : [] })), children: [_jsx("option", { value: "", children: "Select Role" }), (options?.roles ?? []).map((role) => (_jsx("option", { value: role.id, children: role.name }, role.id)))] }), _jsxs("select", { className: "rounded-xl border border-slate-200 px-4 py-3", value: formState.approvalState, onChange: (event) => setFormState((current) => ({ ...current, approvalState: event.target.value })), children: [_jsx("option", { value: "DRAFT", children: "Draft" }), _jsx("option", { value: "PENDING_APPROVAL", children: "Pending Approval" }), _jsx("option", { value: "APPROVED", children: "Approved" }), _jsx("option", { value: "REJECTED", children: "Rejected" })] }), _jsxs("label", { className: "flex items-center gap-3 rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-700", children: [_jsx("input", { type: "checkbox", checked: formState.isActive, onChange: (event) => setFormState((current) => ({ ...current, isActive: event.target.checked })) }), "Active"] }), _jsx("button", { className: "rounded-xl bg-brand-500 px-4 py-3 text-sm font-medium text-white disabled:cursor-not-allowed disabled:bg-slate-300", onClick: () => saveMutation.mutate(), disabled: saveMutation.isPending || Boolean(duplicateUser), children: editingId ? "Update User" : "Create User" })] }), duplicateUser ? _jsxs("p", { className: "text-sm text-amber-600", children: ["Username already exists: ", duplicateUser.username, ". Use a new username or edit the existing user."] }) : null, error ? _jsx("p", { className: "text-sm text-red-600", children: error }) : null, _jsx(DataTablePlaceholder, { columns: ["username", "fullName", "email", "isActive"], rows: data.map((row) => ({
                    username: row.username,
                    fullName: row.fullName,
                    email: row.email ?? "-",
                    isActive: row.isActive ? "Yes" : "No"
                })) }), _jsx("div", { className: "rounded-2xl border border-slate-200 bg-white p-4 shadow-panel", children: _jsx("div", { className: "space-y-3", children: data.map((row) => (_jsxs("div", { className: "flex items-center justify-between rounded-xl border border-slate-200 px-4 py-3", children: [_jsxs("div", { children: [_jsx("p", { className: "font-medium text-slate-900", children: row.fullName }), _jsxs("p", { className: "text-sm text-slate-500", children: [row.username, " | ", (row.userRoles ?? []).map((item) => item.role.name).join(", ") || "-"] })] }), _jsx("button", { className: "rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-700", onClick: () => {
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
                                }, children: "Edit User" })] }, row.id))) }) })] }));
};
