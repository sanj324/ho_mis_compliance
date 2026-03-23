import type { ChangeEvent, ReactElement } from "react";
import { useEffect, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";

import { PageTitle } from "../../../components/common/PageTitle";
import { branchApi } from "../../branches/services/branchApi";
import { shareCapitalApi } from "../services/shareCapitalApi";

type MemberFormState = {
  memberCode: string;
  memberName: string;
  branchId: string;
  panNo: string;
  aadhaarNo: string;
  kycStatus: string;
  memberStatus: string;
  freezeStatus: boolean;
  lienStatus: boolean;
  registrarRefNo: string;
  panVerified: boolean;
  aadhaarVerified: boolean;
};

const defaultState: MemberFormState = {
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

export const MemberFormPage = (): ReactElement => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [formState, setFormState] = useState<MemberFormState>(defaultState);
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

  const handleInputChange = (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = event.target;
    setFormState((current) => ({
      ...current,
      [name]: type === "checkbox" ? (event.target as HTMLInputElement).checked : value
    }));
  };

  return (
    <div className="space-y-6">
      <PageTitle title={id ? "Edit Member" : "New Member"} subtitle="Member KYC and Share Capital Master" />
      <div className="grid gap-4 rounded-2xl border border-slate-200 bg-white p-6 md:grid-cols-2">
        <input className="rounded-xl border border-slate-300 px-3 py-2" name="memberCode" placeholder="Member code" value={formState.memberCode} onChange={handleInputChange} disabled={Boolean(id)} />
        <input className="rounded-xl border border-slate-300 px-3 py-2" name="memberName" placeholder="Member name" value={formState.memberName} onChange={handleInputChange} />
        <select className="rounded-xl border border-slate-300 px-3 py-2" name="branchId" value={formState.branchId} onChange={handleInputChange}>
          <option value="">Select branch</option>
          {(branches ?? []).map((branch) => (
            <option key={branch.id} value={branch.id}>
              {branch.name}
            </option>
          ))}
        </select>
        <select className="rounded-xl border border-slate-300 px-3 py-2" name="kycStatus" value={formState.kycStatus} onChange={handleInputChange}>
          <option value="PENDING">PENDING</option>
          <option value="COMPLETED">COMPLETED</option>
          <option value="DEFICIENT">DEFICIENT</option>
        </select>
        <input className="rounded-xl border border-slate-300 px-3 py-2" name="panNo" placeholder="PAN" value={formState.panNo} onChange={handleInputChange} />
        <input className="rounded-xl border border-slate-300 px-3 py-2" name="aadhaarNo" placeholder="Aadhaar" value={formState.aadhaarNo} onChange={handleInputChange} />
        <input className="rounded-xl border border-slate-300 px-3 py-2" name="registrarRefNo" placeholder="Registrar ref no" value={formState.registrarRefNo} onChange={handleInputChange} />
        <select className="rounded-xl border border-slate-300 px-3 py-2" name="memberStatus" value={formState.memberStatus} onChange={handleInputChange}>
          <option value="ACTIVE">ACTIVE</option>
          <option value="INACTIVE">INACTIVE</option>
          <option value="DECEASED">DECEASED</option>
          <option value="DISPUTE">DISPUTE</option>
        </select>
        <label className="flex items-center gap-2 text-sm text-slate-700">
          <input type="checkbox" name="freezeStatus" checked={formState.freezeStatus} onChange={handleInputChange} />
          Freeze member
        </label>
        <label className="flex items-center gap-2 text-sm text-slate-700">
          <input type="checkbox" name="lienStatus" checked={formState.lienStatus} onChange={handleInputChange} />
          Mark lien
        </label>
      </div>
      <button className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white" onClick={() => mutation.mutate()} type="button">
        Save Member
      </button>
    </div>
  );
};
