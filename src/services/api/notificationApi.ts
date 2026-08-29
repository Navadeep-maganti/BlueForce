import { apiClient } from './apiClient';

export interface NotificationApiItem {
  id: number | string;
  title: string;
  message: string;
  notification_type: string;
  type: string;
  related_object_id?: number;
  is_read: boolean;
  action_url?: string;
  created_at: string;
  timestamp: string;
}

export const notificationApi = {
  // 1. Get Notifications List & Unread Count
  async getNotifications(isRead?: boolean, notificationType?: string) {
    const params = new URLSearchParams();
    if (isRead !== undefined) params.append('is_read', String(isRead));
    if (notificationType && notificationType !== 'all') params.append('notification_type', notificationType);

    const res = await apiClient.get(`/notifications/?${params.toString()}`);
    return res.data;
  },

  // 2. Mark Single Notification as Read
  async markAsRead(id: number | string) {
    const res = await apiClient.patch(`/notifications/${id}/read/`);
    return res.data;
  },

  // 3. Mark All Notifications as Read
  async markAllAsRead() {
    const res = await apiClient.post('/notifications/read-all/');
    return res.data;
  },
};
