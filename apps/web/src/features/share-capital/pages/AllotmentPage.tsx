import type { ChangeEvent, ReactElement } from "react";
import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";

import { PageTitle } from "../../../components/common/PageTitle";
import { shareCapitalApi } from "../services/shareCapitalApi";

export const AllotmentPage = (): ReactElement => {
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
    mutationFn: () =>
      shareCapitalApi.createAllotment({
        ...formState,
        noOfShares: Number(formState.noOfShares),
        paidUpValue: Number(formState.paidUpValue),
        allotmentDate: new Date(formState.allotmentDate).toISOString()
      })
  });

  const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = event.target;
    setFormState((current) => ({ ...current, [name]: value }));
  };

  return (
    <div className="space-y-6">
      <PageTitle title="Share Allotment" subtitle="Allot Share Capital to Members" />
      <div className="grid gap-4 rounded-2xl border border-slate-200 bg-white p-6 md:grid-cols-2">
        <select className="rounded-xl border border-slate-300 px-3 py-2" name="memberId" value={formState.memberId} onChange={handleChange}>
          <option value="">Select member</option>
          {(members ?? []).map((member) => (
            <option key={member.id} value={member.id}>{member.memberName}</option>
          ))}
        </select>
        <select className="rounded-xl border border-slate-300 px-3 py-2" name="shareClassId" value={formState.shareClassId} onChange={handleChange}>
          <option value="">Select share class</option>
          {(shareClasses ?? []).map((shareClass) => (
            <option key={shareClass.id} value={shareClass.id}>{shareClass.name}</option>
          ))}
        </select>
        <input className="rounded-xl border border-slate-300 px-3 py-2" name="allotmentDate" type="date" value={formState.allotmentDate} onChange={handleChange} />
        <input className="rounded-xl border border-slate-300 px-3 py-2" name="noOfShares" placeholder="Number of shares" value={formState.noOfShares} onChange={handleChange} />
        <input className="rounded-xl border border-slate-300 px-3 py-2" name="paidUpValue" placeholder="Paid up value" value={formState.paidUpValue} onChange={handleChange} />
        <input className="rounded-xl border border-slate-300 px-3 py-2" name="shareCertificateNo" placeholder="Certificate no" value={formState.shareCertificateNo} onChange={handleChange} />
      </div>
      <button className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white" onClick={() => mutation.mutate()} type="button">
        Create Allotment
      </button>
    </div>
  );
};
