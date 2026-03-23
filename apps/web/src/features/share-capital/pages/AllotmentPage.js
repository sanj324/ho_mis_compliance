import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { PageTitle } from "../../../components/common/PageTitle";
import { shareCapitalApi } from "../services/shareCapitalApi";
export const AllotmentPage = () => {
    const [formState, setFormState] = useState({
        memberId: "",
        shareClassId: "",
        allotmentDate: "",
        noOfShares: "",
        paidUpValue: "",
        shareCertificateNo: ""
    });
    const { data: members } = useQuery({ queryKey: ["share-capital", "members"], queryFn: shareCapitalApi.listMembers });
    const { data: shareClasses } = useQuery({ queryKey: ["share-capital", "share-classes"], queryFn: shareCapitalApi.listShareClasses });
    const mutation = useMutation({
        mutationFn: () => shareCapitalApi.createAllotment({
            ...formState,
            noOfShares: Number(formState.noOfShares),
            paidUpValue: Number(formState.paidUpValue),
            allotmentDate: new Date(formState.allotmentDate).toISOString()
        })
    });
    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormState((current) => ({ ...current, [name]: value }));
    };
    return (_jsxs("div", { className: "space-y-6", children: [_jsx(PageTitle, { title: "Share Allotment", subtitle: "Allot Share Capital to Members" }), _jsxs("div", { className: "grid gap-4 rounded-2xl border border-slate-200 bg-white p-6 md:grid-cols-2", children: [_jsxs("select", { className: "rounded-xl border border-slate-300 px-3 py-2", name: "memberId", value: formState.memberId, onChange: handleChange, children: [_jsx("option", { value: "", children: "Select member" }), (members ?? []).map((member) => (_jsx("option", { value: member.id, children: member.memberName }, member.id)))] }), _jsxs("select", { className: "rounded-xl border border-slate-300 px-3 py-2", name: "shareClassId", value: formState.shareClassId, onChange: handleChange, children: [_jsx("option", { value: "", children: "Select share class" }), (shareClasses ?? []).map((shareClass) => (_jsx("option", { value: shareClass.id, children: shareClass.name }, shareClass.id)))] }), _jsx("input", { className: "rounded-xl border border-slate-300 px-3 py-2", name: "allotmentDate", type: "date", value: formState.allotmentDate, onChange: handleChange }), _jsx("input", { className: "rounded-xl border border-slate-300 px-3 py-2", name: "noOfShares", placeholder: "Number of shares", value: formState.noOfShares, onChange: handleChange }), _jsx("input", { className: "rounded-xl border border-slate-300 px-3 py-2", name: "paidUpValue", placeholder: "Paid up value", value: formState.paidUpValue, onChange: handleChange }), _jsx("input", { className: "rounded-xl border border-slate-300 px-3 py-2", name: "shareCertificateNo", placeholder: "Certificate no", value: formState.shareCertificateNo, onChange: handleChange })] }), _jsx("button", { className: "rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white", onClick: () => mutation.mutate(), type: "button", children: "Create Allotment" })] }));
};
