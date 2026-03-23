import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { PageTitle } from "../../../components/common/PageTitle";
import { shareCapitalApi } from "../services/shareCapitalApi";
export const TransferPage = () => {
    const [formState, setFormState] = useState({
        fromMemberId: "",
        toMemberId: "",
        shareClassId: "",
        transferDate: "",
        noOfShares: "",
        remarks: ""
    });
    const { data: members } = useQuery({ queryKey: ["share-capital", "members"], queryFn: shareCapitalApi.listMembers });
    const { data: shareClasses } = useQuery({ queryKey: ["share-capital", "share-classes"], queryFn: shareCapitalApi.listShareClasses });
    const mutation = useMutation({
        mutationFn: () => shareCapitalApi.createTransfer({
            ...formState,
            noOfShares: Number(formState.noOfShares),
            transferDate: new Date(formState.transferDate).toISOString()
        })
    });
    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormState((current) => ({ ...current, [name]: value }));
    };
    return (_jsxs("div", { className: "space-y-6", children: [_jsx(PageTitle, { title: "Share Transfer", subtitle: "Transfer Shares Between Members" }), _jsxs("div", { className: "grid gap-4 rounded-2xl border border-slate-200 bg-white p-6 md:grid-cols-2", children: [_jsxs("select", { className: "rounded-xl border border-slate-300 px-3 py-2", name: "fromMemberId", value: formState.fromMemberId, onChange: handleChange, children: [_jsx("option", { value: "", children: "From member" }), (members ?? []).map((member) => (_jsx("option", { value: member.id, children: member.memberName }, member.id)))] }), _jsxs("select", { className: "rounded-xl border border-slate-300 px-3 py-2", name: "toMemberId", value: formState.toMemberId, onChange: handleChange, children: [_jsx("option", { value: "", children: "To member" }), (members ?? []).map((member) => (_jsx("option", { value: member.id, children: member.memberName }, member.id)))] }), _jsxs("select", { className: "rounded-xl border border-slate-300 px-3 py-2", name: "shareClassId", value: formState.shareClassId, onChange: handleChange, children: [_jsx("option", { value: "", children: "Share class" }), (shareClasses ?? []).map((shareClass) => (_jsx("option", { value: shareClass.id, children: shareClass.name }, shareClass.id)))] }), _jsx("input", { className: "rounded-xl border border-slate-300 px-3 py-2", name: "transferDate", type: "date", value: formState.transferDate, onChange: handleChange }), _jsx("input", { className: "rounded-xl border border-slate-300 px-3 py-2", name: "noOfShares", placeholder: "Number of shares", value: formState.noOfShares, onChange: handleChange }), _jsx("input", { className: "rounded-xl border border-slate-300 px-3 py-2", name: "remarks", placeholder: "Remarks", value: formState.remarks, onChange: handleChange })] }), _jsx("button", { className: "rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white", onClick: () => mutation.mutate(), type: "button", children: "Create Transfer" })] }));
};
