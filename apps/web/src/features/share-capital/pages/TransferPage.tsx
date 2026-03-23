import type { ChangeEvent, ReactElement } from "react";
import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";

import { PageTitle } from "../../../components/common/PageTitle";
import { shareCapitalApi } from "../services/shareCapitalApi";

export const TransferPage = (): ReactElement => {
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
    mutationFn: () =>
      shareCapitalApi.createTransfer({
        ...formState,
        noOfShares: Number(formState.noOfShares),
        transferDate: new Date(formState.transferDate).toISOString()
      })
  });

  const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = event.target;
    setFormState((current) => ({ ...current, [name]: value }));
  };

  return (
    <div className="space-y-6">
      <PageTitle title="Share Transfer" subtitle="Transfer Shares Between Members" />
      <div className="grid gap-4 rounded-2xl border border-slate-200 bg-white p-6 md:grid-cols-2">
        <select className="rounded-xl border border-slate-300 px-3 py-2" name="fromMemberId" value={formState.fromMemberId} onChange={handleChange}>
          <option value="">From member</option>
          {(members ?? []).map((member) => (
            <option key={member.id} value={member.id}>{member.memberName}</option>
          ))}
        </select>
        <select className="rounded-xl border border-slate-300 px-3 py-2" name="toMemberId" value={formState.toMemberId} onChange={handleChange}>
          <option value="">To member</option>
          {(members ?? []).map((member) => (
            <option key={member.id} value={member.id}>{member.memberName}</option>
          ))}
        </select>
        <select className="rounded-xl border border-slate-300 px-3 py-2" name="shareClassId" value={formState.shareClassId} onChange={handleChange}>
          <option value="">Share class</option>
          {(shareClasses ?? []).map((shareClass) => (
            <option key={shareClass.id} value={shareClass.id}>{shareClass.name}</option>
          ))}
        </select>
        <input className="rounded-xl border border-slate-300 px-3 py-2" name="transferDate" type="date" value={formState.transferDate} onChange={handleChange} />
        <input className="rounded-xl border border-slate-300 px-3 py-2" name="noOfShares" placeholder="Number of shares" value={formState.noOfShares} onChange={handleChange} />
        <input className="rounded-xl border border-slate-300 px-3 py-2" name="remarks" placeholder="Remarks" value={formState.remarks} onChange={handleChange} />
      </div>
      <button className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white" onClick={() => mutation.mutate()} type="button">
        Create Transfer
      </button>
    </div>
  );
};
