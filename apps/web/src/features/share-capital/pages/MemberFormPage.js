import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import { PageTitle } from "../../../components/common/PageTitle";
import { branchApi } from "../../branches/services/branchApi";
import { shareCapitalApi } from "../services/shareCapitalApi";
const defaultState = {
    memberCode: "",
    memberName: "",
    branchId: "",
    panNo: "",
    aadhaarNo: "",
    kycStatus: "PENDING",
    memberStatus: "ACTIVE",
    freezeStatus: false,
    lienStatus: false,
    registrarRefNo: "",
    panVerified: false,
    aadhaarVerified: false
};
export const MemberFormPage = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [formState, setFormState] = useState(defaultState);
    const { data: branches } = useQuery({
        queryKey: ["branches"],
        queryFn: branchApi.list
    });
    const { data: member } = useQuery({
        queryKey: ["share-capital", "member", id],
        queryFn: () => shareCapitalApi.getMember(id ?? ""),
        enabled: Boolean(id)
    });
    useEffect(() => {
        if (!member) {
            return;
        }
        setFormState({
            memberCode: member.memberCode,
            memberName: member.memberName,
            branchId: member.branchId,
            panNo: member.panNo ?? "",
            aadhaarNo: member.aadhaarNo ?? "",
            kycStatus: member.kycStatus,
            memberStatus: member.memberStatus,
            freezeStatus: member.freezeStatus,
            lienStatus: member.lienStatus,
            registrarRefNo: member.registrarRefNo ?? "",
            panVerified: false,
            aadhaarVerified: false
        });
    }, [member]);
    const mutation = useMutation({
        mutationFn: async () => {
            const payload = {
                ...formState,
                panNo: formState.panNo || undefined,
                aadhaarNo: formState.aadhaarNo || undefined,
                registrarRefNo: formState.registrarRefNo || undefined
            };
            if (id) {
                return shareCapitalApi.updateMember(id, payload);
            }
            return shareCapitalApi.createMember(payload);
        },
        onSuccess: () => navigate("/share-capital/members")
    });
    const handleInputChange = (event) => {
        const { name, value, type } = event.target;
        setFormState((current) => ({
            ...current,
            [name]: type === "checkbox" ? event.target.checked : value
        }));
    };
    return (_jsxs("div", { className: "space-y-6", children: [_jsx(PageTitle, { title: id ? "Edit Member" : "New Member", subtitle: "Member KYC and Share Capital Master" }), _jsxs("div", { className: "grid gap-4 rounded-2xl border border-slate-200 bg-white p-6 md:grid-cols-2", children: [_jsx("input", { className: "rounded-xl border border-slate-300 px-3 py-2", name: "memberCode", placeholder: "Member code", value: formState.memberCode, onChange: handleInputChange, disabled: Boolean(id) }), _jsx("input", { className: "rounded-xl border border-slate-300 px-3 py-2", name: "memberName", placeholder: "Member name", value: formState.memberName, onChange: handleInputChange }), _jsxs("select", { className: "rounded-xl border border-slate-300 px-3 py-2", name: "branchId", value: formState.branchId, onChange: handleInputChange, children: [_jsx("option", { value: "", children: "Select branch" }), (branches ?? []).map((branch) => (_jsx("option", { value: branch.id, children: branch.name }, branch.id)))] }), _jsxs("select", { className: "rounded-xl border border-slate-300 px-3 py-2", name: "kycStatus", value: formState.kycStatus, onChange: handleInputChange, children: [_jsx("option", { value: "PENDING", children: "PENDING" }), _jsx("option", { value: "COMPLETED", children: "COMPLETED" }), _jsx("option", { value: "DEFICIENT", children: "DEFICIENT" })] }), _jsx("input", { className: "rounded-xl border border-slate-300 px-3 py-2", name: "panNo", placeholder: "PAN", value: formState.panNo, onChange: handleInputChange }), _jsx("input", { className: "rounded-xl border border-slate-300 px-3 py-2", name: "aadhaarNo", placeholder: "Aadhaar", value: formState.aadhaarNo, onChange: handleInputChange }), _jsx("input", { className: "rounded-xl border border-slate-300 px-3 py-2", name: "registrarRefNo", placeholder: "Registrar ref no", value: formState.registrarRefNo, onChange: handleInputChange }), _jsxs("select", { className: "rounded-xl border border-slate-300 px-3 py-2", name: "memberStatus", value: formState.memberStatus, onChange: handleInputChange, children: [_jsx("option", { value: "ACTIVE", children: "ACTIVE" }), _jsx("option", { value: "INACTIVE", children: "INACTIVE" }), _jsx("option", { value: "DECEASED", children: "DECEASED" }), _jsx("option", { value: "DISPUTE", children: "DISPUTE" })] }), _jsxs("label", { className: "flex items-center gap-2 text-sm text-slate-700", children: [_jsx("input", { type: "checkbox", name: "freezeStatus", checked: formState.freezeStatus, onChange: handleInputChange }), "Freeze member"] }), _jsxs("label", { className: "flex items-center gap-2 text-sm text-slate-700", children: [_jsx("input", { type: "checkbox", name: "lienStatus", checked: formState.lienStatus, onChange: handleInputChange }), "Mark lien"] })] }), _jsx("button", { className: "rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white", onClick: () => mutation.mutate(), type: "button", children: "Save Member" })] }));
};
