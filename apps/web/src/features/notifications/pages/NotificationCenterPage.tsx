import type { ReactElement } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";

import { DataTablePlaceholder } from "../../../components/common/DataTablePlaceholder";
import { PageTitle } from "../../../components/common/PageTitle";
import { notificationApi } from "../services/notificationApi";

export const NotificationCenterPage = (): ReactElement => {
  const { data, refetch } = useQuery({
    queryKey: ["notifications"],
    queryFn: notificationApi.list
  });

  const mutation = useMutation({
    mutationFn: (id: string) => notificationApi.markRead(id),
    onSuccess: () => {
      void refetch();
    }
  });

  return (
    <div className="space-y-6">
      <PageTitle title="Notification Center" subtitle="Alerts and Communication Feed" />
      <DataTablePlaceholder
        columns={["Title", "Message", "Severity", "Read", "Created"]}
        rows={(data ?? []).map((item) => ({
          Title: item.title,
          Message: item.message,
          Severity: item.severity,
          Read: item.isRead ? "YES" : "NO",
          Created: new Date(item.createdAt).toLocaleString()
        }))}
      />
      <div className="flex flex-wrap gap-2">
        {(data ?? [])
          .filter((item) => !item.isRead)
          .slice(0, 5)
          .map((item) => (
            <button
              key={item.id}
              className="rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-700"
              onClick={() => mutation.mutate(item.id)}
              type="button"
            >
              Mark Read: {item.title}
            </button>
          ))}
      </div>
    </div>
  );
};
