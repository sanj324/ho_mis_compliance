import type { ChangeEvent, ReactElement } from "react";
import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";

import { PageTitle } from "../../../components/common/PageTitle";
import { shareCapitalApi } from "../services/shareCapitalApi";

export const RedemptionPage = (): ReactElement => {
  const [formState, setFormState] = useState({
    memberId: "",
    shareClassId: "",
    redemptionDate: "",
    noOfShares: "",
    redemptionValue: "",
    remarks: ""
  });
  const { data: members } = useQuery({ queryKey: ["share-capital", "members"], queryFn: shareCapitalApi.listMembers });
  const { data: shareClasses } = useQuery({ queryKey: ["share-capital", "share-classes"], queryFn: shareCapitalApi.listShareClasses });

  const mutation = useMutation({
    mutationFn: () =>
      shareCapitalApi.createRedemption({
        ...formState,
        noOfShares: Number(formState.noOfShares),
        redemptionValue: Number(formState.redemptionValue),
        redemptionDate: new Date(formState.redemptionDate).toISOString()
      })
  });

  const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = event.target;
    setFormState((current) => ({ ...current, [name]: value }));
  };

  return (
    <div className="space-y-6">
      <PageTitle title="Share Redemption" subtitle="Redeem Member Share Capital" />
      <div className="grid gap-4 rounded-2xl border border-slate-200 bg-white p-6 md:grid-cols-2">
        <select className="rounded-xl border border-slate-300 px-3 py-2" name="memberId" value={formState.memberId} onChange={handleChange}>
          <option value="">Member</option>
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
        <input className="rounded-xl border border-slate-300 px-3 py-2" name="redemptionDate" type="date" value={formState.redemptionDate} onChange={handleChange} />
        <input className="rounded-xl border border-slate-300 px-3 py-2" name="noOfShares" placeholder="Number of shares" value={formState.noOfShares} onChange={handleChange} />
        <input className="rounded-xl border border-slate-300 px-3 py-2" name="redemptionValue" placeholder="Redemption value" value={formState.redemptionValue} onChange={handleChange} />
        <input className="rounded-xl border border-slate-300 px-3 py-2" name="remarks" placeholder="Remarks" value={formState.remarks} onChange={handleChange} />
      </div>
      <button className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white" onClick={() => mutation.mutate()} type="button">
        Create Redemption
      </button>
    </div>
  );
};
