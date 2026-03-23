import type { ReactElement } from "react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { PageTitle } from "../../../components/common/PageTitle";
import { branchApi } from "../../branches/services/branchApi";
import { investmentApi } from "../services/investmentApi";

type InvestmentFormState = {
  investmentCode: string;
  securityName: string;
  branchId: string;
  securityTypeId: string;
  issuerId: string;
  counterpartyId: string;
  brokerId: string;
  classification: string;
  purchaseDate: string;
  maturityDate: string;
  faceValue: string;
  bookValue: string;
  marketValue: string;
  yieldRate: string;
  couponRate: string;
  rating: string;
  policyLimit: string;
};

const initialForm: InvestmentFormState = {
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

export const InvestmentFormPage = (): ReactElement => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const isEdit = Boolean(id);
  const [form, setForm] = useState<InvestmentFormState>(initialForm);

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

  return (
    <div className="space-y-6">
      <PageTitle title={isEdit ? "Edit Investment" : "Create Investment"} subtitle="Treasury Deal Entry" />
      <div className="metrics-grid">
        {summaryItems.map((item) => (
          <div key={item.label} className="app-panel-muted p-5">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">{item.label}</p>
            <p className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">{item.value}</p>
          </div>
        ))}
      </div>
      <div className="section-card">
        <div className="section-header">
          <div>
            <h2 className="section-title">Treasury Deal Details</h2>
            <p className="section-copy">Maintain a consistent investment entry experience for portfolio classification, valuation, yield capture, and counterparty traceability.</p>
          </div>
          <span className="page-toolbar-chip">{form.classification} Portfolio</span>
        </div>
        <div className="form-grid mt-6">
          <label className="field-stack">
            <span className="field-label">Investment Code</span>
            <input className="app-input" placeholder="INV-HTM-0001" value={form.investmentCode} onChange={(event) => setForm((current) => ({ ...current, investmentCode: event.target.value }))} />
          </label>
          <label className="field-stack">
            <span className="field-label">Security Name</span>
            <input className="app-input" placeholder="State Development Loan" value={form.securityName} onChange={(event) => setForm((current) => ({ ...current, securityName: event.target.value }))} />
          </label>
          <label className="field-stack">
            <span className="field-label">Branch</span>
            <select className="app-select" value={form.branchId} onChange={(event) => setForm((current) => ({ ...current, branchId: event.target.value }))}>
              <option value="">Select Branch</option>
              {branches.map((branch) => (
                <option key={branch.id} value={branch.id}>
                  {branch.name}
                </option>
              ))}
            </select>
          </label>
          <label className="field-stack">
            <span className="field-label">Security Type</span>
            <select className="app-select" value={form.securityTypeId} onChange={(event) => setForm((current) => ({ ...current, securityTypeId: event.target.value }))}>
              <option value="">Select Security Type</option>
              {securityTypes.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.code} - {item.name}
                </option>
              ))}
            </select>
          </label>
          <label className="field-stack">
            <span className="field-label">Issuer</span>
            <select className="app-select" value={form.issuerId} onChange={(event) => setForm((current) => ({ ...current, issuerId: event.target.value }))}>
              <option value="">Select Issuer</option>
              {issuers.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.code} - {item.name}
                </option>
              ))}
            </select>
          </label>
          <label className="field-stack">
            <span className="field-label">Counterparty</span>
            <select className="app-select" value={form.counterpartyId} onChange={(event) => setForm((current) => ({ ...current, counterpartyId: event.target.value }))}>
              <option value="">Select Counterparty</option>
              {counterparties.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.code} - {item.name}
                </option>
              ))}
            </select>
          </label>
          <label className="field-stack">
            <span className="field-label">Broker</span>
            <select className="app-select" value={form.brokerId} onChange={(event) => setForm((current) => ({ ...current, brokerId: event.target.value }))}>
              <option value="">Select Broker</option>
              {brokers.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.code} - {item.name}
                </option>
              ))}
            </select>
          </label>
          <label className="field-stack">
            <span className="field-label">Classification</span>
            <select className="app-select" value={form.classification} onChange={(event) => setForm((current) => ({ ...current, classification: event.target.value }))}>
              <option value="HTM">HTM</option>
              <option value="AFS">AFS</option>
              <option value="HFT">HFT</option>
            </select>
          </label>
          <label className="field-stack">
            <span className="field-label">Purchase Date</span>
            <input className="app-input" type="date" value={form.purchaseDate} onChange={(event) => setForm((current) => ({ ...current, purchaseDate: event.target.value }))} />
          </label>
          <label className="field-stack">
            <span className="field-label">Maturity Date</span>
            <input className="app-input" type="date" value={form.maturityDate} onChange={(event) => setForm((current) => ({ ...current, maturityDate: event.target.value }))} />
          </label>
          <label className="field-stack">
            <span className="field-label">Face Value</span>
            <input className="app-input" type="number" placeholder="0.00" value={form.faceValue} onChange={(event) => setForm((current) => ({ ...current, faceValue: event.target.value }))} />
          </label>
          <label className="field-stack">
            <span className="field-label">Book Value</span>
            <input className="app-input" type="number" placeholder="0.00" value={form.bookValue} onChange={(event) => setForm((current) => ({ ...current, bookValue: event.target.value }))} />
          </label>
          <label className="field-stack">
            <span className="field-label">Market Value</span>
            <input className="app-input" type="number" placeholder="0.00" value={form.marketValue} onChange={(event) => setForm((current) => ({ ...current, marketValue: event.target.value }))} />
          </label>
          <label className="field-stack">
            <span className="field-label">Yield Rate</span>
            <input className="app-input" type="number" placeholder="0.00" value={form.yieldRate} onChange={(event) => setForm((current) => ({ ...current, yieldRate: event.target.value }))} />
          </label>
          <label className="field-stack">
            <span className="field-label">Coupon Rate</span>
            <input className="app-input" type="number" placeholder="0.00" value={form.couponRate} onChange={(event) => setForm((current) => ({ ...current, couponRate: event.target.value }))} />
          </label>
          <label className="field-stack">
            <span className="field-label">Rating</span>
            <input className="app-input" placeholder="AAA / Sovereign" value={form.rating} onChange={(event) => setForm((current) => ({ ...current, rating: event.target.value }))} />
          </label>
          <label className="field-stack">
            <span className="field-label">Policy Limit</span>
            <input className="app-input" type="number" placeholder="0.00" value={form.policyLimit} onChange={(event) => setForm((current) => ({ ...current, policyLimit: event.target.value }))} />
          </label>
        </div>
        <div className="mt-6 flex justify-end gap-3">
          <button className="app-button-secondary" onClick={() => navigate("/investments")}>
            Cancel
          </button>
          <button className="app-button-primary" onClick={() => mutation.mutate()}>
            {isEdit ? "Update Investment" : "Create Investment"}
          </button>
        </div>
      </div>
    </div>
  );
};
