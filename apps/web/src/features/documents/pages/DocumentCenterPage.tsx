import type { ChangeEvent, ReactElement } from "react";
import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";

import { DataTablePlaceholder } from "../../../components/common/DataTablePlaceholder";
import { PageTitle } from "../../../components/common/PageTitle";
import { documentApi } from "../services/documentApi";

export const DocumentCenterPage = (): ReactElement => {
  const [formState, setFormState] = useState({
    moduleName: "PAYROLL",
    entityType: "Employee",
    entityId: "",
    documentType: "SUPPORTING",
    fileName: "",
    filePath: ""
  });
  const { data, refetch } = useQuery({
    queryKey: ["documents"],
    queryFn: documentApi.list
  });

  const mutation = useMutation({
    mutationFn: () => documentApi.upload(formState),
    onSuccess: () => {
      setFormState({
        moduleName: "PAYROLL",
        entityType: "Employee",
        entityId: "",
        documentType: "SUPPORTING",
        fileName: "",
        filePath: ""
      });
      void refetch();
    }
  });

  const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = event.target;
    setFormState((current) => ({ ...current, [name]: value }));
  };

  return (
    <div className="space-y-6">
      <PageTitle title="Document Center" subtitle="Module Attachment Register" />
      <div className="grid gap-4 rounded-2xl border border-slate-200 bg-white p-6 md:grid-cols-3">
        <select className="rounded-xl border border-slate-300 px-3 py-2" name="moduleName" value={formState.moduleName} onChange={handleChange}>
          <option value="PAYROLL">PAYROLL</option>
          <option value="INVESTMENTS">INVESTMENTS</option>
          <option value="ASSETS">ASSETS</option>
          <option value="STATIONERY">STATIONERY</option>
          <option value="SHARE_CAPITAL">SHARE_CAPITAL</option>
        </select>
        <input className="rounded-xl border border-slate-300 px-3 py-2" name="entityType" value={formState.entityType} onChange={handleChange} placeholder="Entity type" />
        <input className="rounded-xl border border-slate-300 px-3 py-2" name="entityId" value={formState.entityId} onChange={handleChange} placeholder="Entity id" />
        <input className="rounded-xl border border-slate-300 px-3 py-2" name="documentType" value={formState.documentType} onChange={handleChange} placeholder="Document type" />
        <input className="rounded-xl border border-slate-300 px-3 py-2" name="fileName" value={formState.fileName} onChange={handleChange} placeholder="File name" />
        <input className="rounded-xl border border-slate-300 px-3 py-2" name="filePath" value={formState.filePath} onChange={handleChange} placeholder="File path" />
      </div>
      <button className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white" onClick={() => mutation.mutate()} type="button">
        Upload Metadata
      </button>
      <DataTablePlaceholder
        columns={["Module", "Entity", "File Name", "Path", "Created"]}
        rows={(data ?? []).map((item) => ({
          Module: item.moduleName,
          Entity: `${item.entityType} / ${item.entityId}`,
          "File Name": item.fileName,
          Path: item.filePath,
          Created: new Date(item.createdAt).toLocaleString()
        }))}
      />
    </div>
  );
};
