import { api } from "../../../lib/api";

const unwrap = <T>(payload: { success: true; data: T }): T => payload.data;

export type NotificationItem = {
  id: string;
  title: string;
  message: string;
  severity: string;
  isRead: boolean;
  createdAt: string;
};

export const notificationApi = {
  list: async (): Promise<NotificationItem[]> =>
    unwrap((await api.get<{ success: true; data: NotificationItem[] }>("/notifications")).data),
  markRead: async (id: string): Promise<NotificationItem> =>
    unwrap((await api.post<{ success: true; data: NotificationItem }>(`/notifications/${id}/read`)).data)
};
