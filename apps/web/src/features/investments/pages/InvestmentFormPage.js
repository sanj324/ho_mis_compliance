import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { PageTitle } from "../../../components/common/PageTitle";
import { branchApi } from "../../branches/services/branchApi";
import { investmentApi } from "../services/investmentApi";
const initialForm = {
    investmentCode: "",
    securityName: "",
    branchId: "",
    securityTypeId: "",
    issuerId: "",
    counterpartyId: "",
    brokerId: "",
    classification: "HTM",
    purchaseDate: "",
    maturityDate: "",
    faceValue: "",
    bookValue: "",
    marketValue: "",
    yieldRate: "",
    couponRate: "",
    rating: "",
    policyLimit: ""
};
export const InvestmentFormPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const isEdit = Boolean(id);
    const [form, setForm] = useState(initialForm);
    const { data: branches = [] } = useQuery({
        queryKey: ["branches"],
        queryFn: branchApi.list
    });
    const { data: securityTypes = [] } = useQuery({
        queryKey: ["investments", "security-types"],
        queryFn: investmentApi.listSecurityTypes
    });
    const { data: issuers = [] } = useQuery({
        queryKey: ["investments", "issuers"],
        queryFn: investmentApi.listIssuers
    });
    const { data: counterparties = [] } = useQuery({
        queryKey: ["investments", "counterparties"],
        queryFn: investmentApi.listCounterparties
    });
    const { data: brokers = [] } = useQuery({
        queryKey: ["investments", "brokers"],
        queryFn: investmentApi.listBrokers
    });
    const { data: investment } = useQuery({
        queryKey: ["investments", "detail", id],
        queryFn: () => investmentApi.getInvestment(id ?? ""),
        enabled: isEdit && Boolean(id)
    });
    useEffect(() => {
        if (!investment) {
            return;
        }
        setForm({
            investmentCode: investment.investmentCode,
            securityName: investment.securityName,
            branchId: investment.branch?.id ?? "",
            securityTypeId: investment.securityType?.id ?? "",
            issuerId: investment.issuer?.id ?? "",
            counterpartyId: investment.counterparty?.id ?? "",
            brokerId: investment.broker?.id ?? "",
            classification: investment.classification,
            purchaseDate: investment.purchaseDate.slice(0, 10),
            maturityDate: investment.maturityDate?.slice(0, 10) ?? "",
            faceValue: String(investment.faceValue),
            bookValue: String(investment.bookValue),
            marketValue: investment.marketValue !== null ? String(investment.marketValue) : "",
            yieldRate: investment.yieldRate !== null ? String(investment.yieldRate) : "",
            couponRate: "",
            rating: investment.rating ?? "",
            policyLimit: ""
        });
    }, [investment]);
    const mutation = useMutation({
        mutationFn: async () => {
            const payload = {
                investmentCode: form.investmentCode,
                securityName: form.securityName,
                branchId: form.branchId,
                securityTypeId: form.securityTypeId,
                issuerId: form.issuerId || null,
                counterpartyId: form.counterpartyId || null,
                brokerId: form.brokerId || null,
                classification: form.classification,
                purchaseDate: form.purchaseDate,
                maturityDate: form.maturityDate || null,
                faceValue: Number(form.faceValue),
                bookValue: Number(form.bookValue),
                marketValue: form.marketValue ? Number(form.marketValue) : undefined,
                yieldRate: form.yieldRate ? Number(form.yieldRate) : undefined,
                couponRate: form.couponRate ? Number(form.couponRate) : undefined,
                rating: form.rating || undefined,
                policyLimit: form.policyLimit ? Number(form.policyLimit) : undefined
            };
            return isEdit && id ? investmentApi.updateInvestment(id, payload) : investmentApi.createInvestment(payload);
        },
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ["investments", "list"] });
            navigate("/investments");
        }
    });
    const summaryItems = [
        { label: "Security Types", value: securityTypes.length },
        { label: "Issuers", value: issuers.length },
        { label: "Counterparties", value: counterparties.length },
        { label: "Brokers", value: brokers.length }
    ];
    return (_jsxs("div", { className: "space-y-6", children: [_jsx(PageTitle, { title: isEdit ? "Edit Investment" : "Create Investment", subtitle: "Treasury Deal Entry" }), _jsx("div", { className: "metrics-grid", children: summaryItems.map((item) => (_jsxs("div", { className: "app-panel-muted p-5", children: [_jsx("p", { className: "text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500", children: item.label }), _jsx("p", { className: "mt-3 text-3xl font-semibold tracking-tight text-slate-950", children: item.value })] }, item.label))) }), _jsxs("div", { className: "section-card", children: [_jsxs("div", { className: "section-header", children: [_jsxs("div", { children: [_jsx("h2", { className: "section-title", children: "Treasury Deal Details" }), _jsx("p", { className: "section-copy", children: "Maintain a consistent investment entry experience for portfolio classification, valuation, yield capture, and counterparty traceability." })] }), _jsxs("span", { className: "page-toolbar-chip", children: [form.classification, " Portfolio"] })] }), _jsxs("div", { className: "form-grid mt-6", children: [_jsxs("label", { className: "field-stack", children: [_jsx("span", { className: "field-label", children: "Investment Code" }), _jsx("input", { className: "app-input", placeholder: "INV-HTM-0001", value: form.investmentCode, onChange: (event) => setForm((current) => ({ ...current, investmentCode: event.target.value })) })] }), _jsxs("label", { className: "field-stack", children: [_jsx("span", { className: "field-label", children: "Security Name" }), _jsx("input", { className: "app-input", placeholder: "State Development Loan", value: form.securityName, onChange: (event) => setForm((current) => ({ ...current, securityName: event.target.value })) })] }), _jsxs("label", { className: "field-stack", children: [_jsx("span", { className: "field-label", children: "Branch" }), _jsxs("select", { className: "app-select", value: form.branchId, onChange: (event) => setForm((current) => ({ ...current, branchId: event.target.value })), children: [_jsx("option", { value: "", children: "Select Branch" }), branches.map((branch) => (_jsx("option", { value: branch.id, children: branch.name }, branch.id)))] })] }), _jsxs("label", { className: "field-stack", children: [_jsx("span", { className: "field-label", children: "Security Type" }), _jsxs("select", { className: "app-select", value: form.securityTypeId, onChange: (event) => setForm((current) => ({ ...current, securityTypeId: event.target.value })), children: [_jsx("option", { value: "", children: "Select Security Type" }), securityTypes.map((item) => (_jsxs("option", { value: item.id, children: [item.code, " - ", item.name] }, item.id)))] })] }), _jsxs("label", { className: "field-stack", children: [_jsx("span", { className: "field-label", children: "Issuer" }), _jsxs("select", { className: "app-select", value: form.issuerId, onChange: (event) => setForm((current) => ({ ...current, issuerId: event.target.value })), children: [_jsx("option", { value: "", children: "Select Issuer" }), issuers.map((item) => (_jsxs("option", { value: item.id, children: [item.code, " - ", item.name] }, item.id)))] })] }), _jsxs("label", { className: "field-stack", children: [_jsx("span", { className: "field-label", children: "Counterparty" }), _jsxs("select", { className: "app-select", value: form.counterpartyId, onChange: (event) => setForm((current) => ({ ...current, counterpartyId: event.target.value })), children: [_jsx("option", { value: "", children: "Select Counterparty" }), counterparties.map((item) => (_jsxs("option", { value: item.id, children: [item.code, " - ", item.name] }, item.id)))] })] }), _jsxs("label", { className: "field-stack", children: [_jsx("span", { className: "field-label", children: "Broker" }), _jsxs("select", { className: "app-select", value: form.brokerId, onChange: (event) => setForm((current) => ({ ...current, brokerId: event.target.value })), children: [_jsx("option", { value: "", children: "Select Broker" }), brokers.map((item) => (_jsxs("option", { value: item.id, children: [item.code, " - ", item.name] }, item.id)))] })] }), _jsxs("label", { className: "field-stack", children: [_jsx("span", { className: "field-label", children: "Classification" }), _jsxs("select", { className: "app-select", value: form.classification, onChange: (event) => setForm((current) => ({ ...current, classification: event.target.value })), children: [_jsx("option", { value: "HTM", children: "HTM" }), _jsx("option", { value: "AFS", children: "AFS" }), _jsx("option", { value: "HFT", children: "HFT" })] })] }), _jsxs("label", { className: "field-stack", children: [_jsx("span", { className: "field-label", children: "Purchase Date" }), _jsx("input", { className: "app-input", type: "date", value: form.purchaseDate, onChange: (event) => setForm((current) => ({ ...current, purchaseDate: event.target.value })) })] }), _jsxs("label", { className: "field-stack", children: [_jsx("span", { className: "field-label", children: "Maturity Date" }), _jsx("input", { className: "app-input", type: "date", value: form.maturityDate, onChange: (event) => setForm((current) => ({ ...current, maturityDate: event.target.value })) })] }), _jsxs("label", { className: "field-stack", children: [_jsx("span", { className: "field-label", children: "Face Value" }), _jsx("input", { className: "app-input", type: "number", placeholder: "0.00", value: form.faceValue, onChange: (event) => setForm((current) => ({ ...current, faceValue: event.target.value })) })] }), _jsxs("label", { className: "field-stack", children: [_jsx("span", { className: "field-label", children: "Book Value" }), _jsx("input", { className: "app-input", type: "number", placeholder: "0.00", value: form.bookValue, onChange: (event) => setForm((current) => ({ ...current, bookValue: event.target.value })) })] }), _jsxs("label", { className: "field-stack", children: [_jsx("span", { className: "field-label", children: "Market Value" }), _jsx("input", { className: "app-input", type: "number", placeholder: "0.00", value: form.marketValue, onChange: (event) => setForm((current) => ({ ...current, marketValue: event.target.value })) })] }), _jsxs("label", { className: "field-stack", children: [_jsx("span", { className: "field-label", children: "Yield Rate" }), _jsx("input", { className: "app-input", type: "number", placeholder: "0.00", value: form.yieldRate, onChange: (event) => setForm((current) => ({ ...current, yieldRate: event.target.value })) })] }), _jsxs("label", { className: "field-stack", children: [_jsx("span", { className: "field-label", children: "Coupon Rate" }), _jsx("input", { className: "app-input", type: "number", placeholder: "0.00", value: form.couponRate, onChange: (event) => setForm((current) => ({ ...current, couponRate: event.target.value })) })] }), _jsxs("label", { className: "field-stack", children: [_jsx("span", { className: "field-label", children: "Rating" }), _jsx("input", { className: "app-input", placeholder: "AAA / Sovereign", value: form.rating, onChange: (event) => setForm((current) => ({ ...current, rating: event.target.value })) })] }), _jsxs("label", { className: "field-stack", children: [_jsx("span", { className: "field-label", children: "Policy Limit" }), _jsx("input", { className: "app-input", type: "number", placeholder: "0.00", value: form.policyLimit, onChange: (event) => setForm((current) => ({ ...current, policyLimit: event.target.value })) })] })] }), _jsxs("div", { className: "mt-6 flex justify-end gap-3", children: [_jsx("button", { className: "app-button-secondary", onClick: () => navigate("/investments"), children: "Cancel" }), _jsx("button", { className: "app-button-primary", onClick: () => mutation.mutate(), children: isEdit ? "Update Investment" : "Create Investment" })] })] })] }));
};
