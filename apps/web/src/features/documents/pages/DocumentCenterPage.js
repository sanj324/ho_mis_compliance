import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { DataTablePlaceholder } from "../../../components/common/DataTablePlaceholder";
import { PageTitle } from "../../../components/common/PageTitle";
import { documentApi } from "../services/documentApi";
export const DocumentCenterPage = () => {
    const [formState, setFormState] = useState({
        moduleName: "PAYROLL",
        entityType: "Employee",
        entityId: "",
        documentType: "SUPPORTING",
        fileName: "",
        filePath: ""
    });
    const { data, refetch } = useQuery({
        queryKey: ["documents"],
        queryFn: documentApi.list
    });
    const mutation = useMutation({
        mutationFn: () => documentApi.upload(formState),
        onSuccess: () => {
            setFormState({
                moduleName: "PAYROLL",
                entityType: "Employee",
                entityId: "",
                documentType: "SUPPORTING",
                fileName: "",
                filePath: ""
            });
            void refetch();
        }
    });
    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormState((current) => ({ ...current, [name]: value }));
    };
    return (_jsxs("div", { className: "space-y-6", children: [_jsx(PageTitle, { title: "Document Center", subtitle: "Module Attachment Register" }), _jsxs("div", { className: "grid gap-4 rounded-2xl border border-slate-200 bg-white p-6 md:grid-cols-3", children: [_jsxs("select", { className: "rounded-xl border border-slate-300 px-3 py-2", name: "moduleName", value: formState.moduleName, onChange: handleChange, children: [_jsx("option", { value: "PAYROLL", children: "PAYROLL" }), _jsx("option", { value: "INVESTMENTS", children: "INVESTMENTS" }), _jsx("option", { value: "ASSETS", children: "ASSETS" }), _jsx("option", { value: "STATIONERY", children: "STATIONERY" }), _jsx("option", { value: "SHARE_CAPITAL", children: "SHARE_CAPITAL" })] }), _jsx("input", { className: "rounded-xl border border-slate-300 px-3 py-2", name: "entityType", value: formState.entityType, onChange: handleChange, placeholder: "Entity type" }), _jsx("input", { className: "rounded-xl border border-slate-300 px-3 py-2", name: "entityId", value: formState.entityId, onChange: handleChange, placeholder: "Entity id" }), _jsx("input", { className: "rounded-xl border border-slate-300 px-3 py-2", name: "documentType", value: formState.documentType, onChange: handleChange, placeholder: "Document type" }), _jsx("input", { className: "rounded-xl border border-slate-300 px-3 py-2", name: "fileName", value: formState.fileName, onChange: handleChange, placeholder: "File name" }), _jsx("input", { className: "rounded-xl border border-slate-300 px-3 py-2", name: "filePath", value: formState.filePath, onChange: handleChange, placeholder: "File path" })] }), _jsx("button", { className: "rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white", onClick: () => mutation.mutate(), type: "button", children: "Upload Metadata" }), _jsx(DataTablePlaceholder, { columns: ["Module", "Entity", "File Name", "Path", "Created"], rows: (data ?? []).map((item) => ({
                    Module: item.moduleName,
                    Entity: `${item.entityType} / ${item.entityId}`,
                    "File Name": item.fileName,
                    Path: item.filePath,
                    Created: new Date(item.createdAt).toLocaleString()
                })) })] }));
};
