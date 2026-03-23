import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useMutation, useQuery } from "@tanstack/react-query";
import { DataTablePlaceholder } from "../../../components/common/DataTablePlaceholder";
import { PageTitle } from "../../../components/common/PageTitle";
import { notificationApi } from "../services/notificationApi";
export const NotificationCenterPage = () => {
    const { data, refetch } = useQuery({
        queryKey: ["notifications"],
        queryFn: notificationApi.list
    });
    const mutation = useMutation({
        mutationFn: (id) => notificationApi.markRead(id),
        onSuccess: () => {
            void refetch();
        }
    });
    return (_jsxs("div", { className: "space-y-6", children: [_jsx(PageTitle, { title: "Notification Center", subtitle: "Alerts and Communication Feed" }), _jsx(DataTablePlaceholder, { columns: ["Title", "Message", "Severity", "Read", "Created"], rows: (data ?? []).map((item) => ({
                    Title: item.title,
                    Message: item.message,
                    Severity: item.severity,
                    Read: item.isRead ? "YES" : "NO",
                    Created: new Date(item.createdAt).toLocaleString()
                })) }), _jsx("div", { className: "flex flex-wrap gap-2", children: (data ?? [])
                    .filter((item) => !item.isRead)
                    .slice(0, 5)
                    .map((item) => (_jsxs("button", { className: "rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-700", onClick: () => mutation.mutate(item.id), type: "button", children: ["Mark Read: ", item.title] }, item.id))) })] }));
};
