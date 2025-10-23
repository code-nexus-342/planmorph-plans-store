"use client";
import { useState } from 'react';
import { apiClient } from '../lib/api-client';

export interface Notification {
  id: string;
  type: 'purchase' | 'favorite' | 'download' | 'review' | 'system' | 'message';
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  isImportant: boolean;
  actionUrl?: string;
  metadata?: {
    planId?: string;
    planTitle?: string;
    amount?: number;
    rating?: number;
  };
}

export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await apiClient.get<Notification[]>('/user/notifications');

      if (response.success && response.data) {
        setNotifications(response.data);
      } else {
        setError('Failed to fetch notifications');
      }
    } catch (err) {
      console.error('Error fetching notifications:', err);
      setError(err instanceof Error ? err.message : 'An error occurred while fetching notifications');
      // Set empty array on error for better UX
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (notificationId: string) => {
    try {
      const response = await apiClient.put(`/user/notifications/${notificationId}/read`, {});
      if (response.success) {
        setNotifications(prev =>
          prev.map(notification =>
            notification.id === notificationId
              ? { ...notification, isRead: true }
              : notification
          )
        );
      }
      return response.success;
    } catch (err) {
      console.error('Error marking notification as read:', err);
      return false;
    }
  };

  const markAllAsRead = async () => {
    try {
      const response = await apiClient.put('/user/notifications/read-all', {});
      if (response.success) {
        setNotifications(prev =>
          prev.map(notification => ({ ...notification, isRead: true }))
        );
      }
      return response.success;
    } catch (err) {
      console.error('Error marking all as read:', err);
      return false;
    }
  };

  const deleteNotification = async (notificationId: string) => {
    try {
      const response = await apiClient.delete(`/user/notifications/${notificationId}`);
      if (response.success) {
        setNotifications(prev =>
          prev.filter(notification => notification.id !== notificationId)
        );
      }
      return response.success;
    } catch (err) {
      console.error('Error deleting notification:', err);
      return false;
    }
  };

  const clearAll = async () => {
    try {
      const response = await apiClient.delete('/user/notifications');
      if (response.success) {
        setNotifications([]);
      }
      return response.success;
    } catch (err) {
      console.error('Error clearing notifications:', err);
      return false;
    }
  };

  return {
    notifications,
    loading,
    error,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearAll,
  };
}
