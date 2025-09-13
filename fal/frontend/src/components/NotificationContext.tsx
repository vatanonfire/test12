'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { toast } from 'react-hot-toast';

export interface Notification {
  id: string;
  userId: string;
  adminId?: string;
  title: string;
  message: string;
  type: 'SYSTEM' | 'ADMIN' | 'COIN' | 'RITUAL' | 'GENERAL';
  isRead: boolean;
  priority: 'LOW' | 'NORMAL' | 'HIGH' | 'URGENT';
  category?: string;
  metadata?: string;
  expiresAt?: string;
  createdAt: string;
  updatedAt: string;
  admin?: {
    name: string;
    email: string;
  };
}

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  isLoading: boolean;
  fetchNotifications: () => Promise<void>;
  fetchUnreadCount: () => Promise<void>;
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  deleteNotification: (id: string) => Promise<void>;
  addNotification: (notification: Omit<Notification, 'id' | 'createdAt' | 'updatedAt'>) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

interface NotificationProviderProps {
  children: ReactNode;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({ children }) => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  // Bildirimleri getir
  const fetchNotifications = async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/notifications`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();
      
      if (data.success) {
        setNotifications(data.data.notifications);
        setUnreadCount(data.data.notifications.filter((n: Notification) => !n.isRead).length);
      } else {
        toast.error('Bildirimler yüklenemedi');
      }
    } catch (error) {
      console.error('Fetch notifications error:', error);
      toast.error('Bildirimler yüklenirken hata oluştu');
    } finally {
      setIsLoading(false);
    }
  };

  // Okunmamış bildirim sayısını getir
  const fetchUnreadCount = async () => {
    if (!user) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/notifications/unread-count`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();
      
      if (data.success) {
        setUnreadCount(data.data.count);
      }
    } catch (error) {
      console.error('Fetch unread count error:', error);
    }
  };

  // Bildirimi okundu olarak işaretle
  const markAsRead = async (id: string) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/notifications/${id}/read`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();
      
      if (data.success) {
        setNotifications(prev => 
          prev.map(n => n.id === id ? { ...n, isRead: true } : n)
        );
        setUnreadCount(prev => Math.max(0, prev - 1));
      } else {
        toast.error('Bildirim güncellenemedi');
      }
    } catch (error) {
      console.error('Mark as read error:', error);
      toast.error('Bildirim güncellenirken hata oluştu');
    }
  };

  // Tüm bildirimleri okundu olarak işaretle
  const markAllAsRead = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/notifications/read-all`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();
      
      if (data.success) {
        setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
        setUnreadCount(0);
        toast.success('Tüm bildirimler okundu olarak işaretlendi');
      } else {
        toast.error('Bildirimler güncellenemedi');
      }
    } catch (error) {
      console.error('Mark all as read error:', error);
      toast.error('Bildirimler güncellenirken hata oluştu');
    }
  };

  // Bildirimi sil
  const deleteNotification = async (id: string) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/notifications/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();
      
      if (data.success) {
        const deletedNotification = notifications.find(n => n.id === id);
        setNotifications(prev => prev.filter(n => n.id !== id));
        if (deletedNotification && !deletedNotification.isRead) {
          setUnreadCount(prev => Math.max(0, prev - 1));
        }
        toast.success('Bildirim silindi');
      } else {
        toast.error('Bildirim silinemedi');
      }
    } catch (error) {
      console.error('Delete notification error:', error);
      toast.error('Bildirim silinirken hata oluştu');
    }
  };

  // Yeni bildirim ekle (local state için)
  const addNotification = (notification: Omit<Notification, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString(), // Temporary ID
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    setNotifications(prev => [newNotification, ...prev]);
    if (!newNotification.isRead) {
      setUnreadCount(prev => prev + 1);
    }
  };

  // User değiştiğinde bildirimleri getir
  useEffect(() => {
    if (user) {
      fetchNotifications();
      fetchUnreadCount();
    } else {
      setNotifications([]);
      setUnreadCount(0);
    }
  }, [user]);

  // Periyodik olarak okunmamış bildirim sayısını güncelle
  useEffect(() => {
    if (!user) return;

    const interval = setInterval(() => {
      fetchUnreadCount();
    }, 30000); // 30 saniyede bir

    return () => clearInterval(interval);
  }, [user]);

  const value: NotificationContextType = {
    notifications,
    unreadCount,
    isLoading,
    fetchNotifications,
    fetchUnreadCount,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    addNotification
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};
