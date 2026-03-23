import type { ReactElement } from "react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

import { DataTablePlaceholder } from "../../../components/common/DataTablePlaceholder";
import { PageTitle } from "../../../components/common/PageTitle";
import { shareCapitalApi } from "../services/shareCapitalApi";

export const MemberListPage = (): ReactElement => {
  const [search, setSearch] = useState("");
  const { data } = useQuery({
    queryKey: ["share-capital", "members"],
    queryFn: shareCapitalApi.listMembers
  });

  const filtered = (data ?? []).filter(
    (member) =>
      member.memberCode.toLowerCase().includes(search.toLowerCase()) ||
      member.memberName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <PageTitle title="Members" subtitle="Share Capital Member Master" />
        <Link className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white" to="/share-capital/members/new">
          New Member
        </Link>
      </div>
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-panel">
        <input
          className="w-full rounded-xl border border-slate-200 px-4 py-3"
          placeholder="Search by member code or name"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />
      </div>
      <DataTablePlaceholder
        columns={["Code", "Name", "Branch", "KYC", "Freeze", "Lien", "Actions"]}
        rows={filtered.map((member) => ({
          Code: member.memberCode,
          Name: member.memberName,
          Branch: member.branch?.name ?? "-",
          KYC: member.kycStatus,
          Freeze: member.freezeStatus ? "YES" : "NO",
          Lien: member.lienStatus ? "YES" : "NO",
          Actions: (
            <Link className="rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-700" to={`/share-capital/members/${member.id}`}>
              Edit
            </Link>
          )
        }))}
      />
    </div>
  );
};
