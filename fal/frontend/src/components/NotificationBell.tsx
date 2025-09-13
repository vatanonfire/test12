'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Bell, X, Check, Trash2, Search, Filter } from 'lucide-react';
import { useNotifications } from './NotificationContext';
import { toast } from 'react-hot-toast';
import { createPortal } from 'react-dom';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: string;
  priority: string;
  category?: string;
  isRead: boolean;
  createdAt: string;
  admin?: {
    name: string;
    email: string;
  };
}

export default function NotificationBell() {
  const [isOpen, setIsOpen] = useState(false);
  const [filterType, setFilterType] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const bellRef = useRef<HTMLButtonElement>(null);
  const [bellPosition, setBellPosition] = useState({ top: 0, right: 0 });
  
  const {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    fetchNotifications
  } = useNotifications();

  // Update bell position when opening
  useEffect(() => {
    if (isOpen && bellRef.current) {
      const rect = bellRef.current.getBoundingClientRect();
      const isMobile = window.innerWidth < 640;
      
      setBellPosition({
        top: rect.bottom + window.scrollY + 8,
        right: isMobile ? 8 : window.innerWidth - rect.right - window.scrollX
      });
    }
  }, [isOpen]);

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node) &&
          bellRef.current && !bellRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Auto-refresh notifications
  useEffect(() => {
    const interval = setInterval(() => {
      fetchNotifications();
    }, 30000); // 30 seconds

    return () => clearInterval(interval);
  }, [fetchNotifications]);

  // Filter notifications
  const filteredNotifications = notifications.filter(notification => {
    const matchesType = filterType === 'ALL' || notification.type === filterType;
    const matchesSearch = notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         notification.message.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesType && matchesSearch;
  });

  // Handle mark as read
  const handleMarkAsRead = async (id: string) => {
    try {
      await markAsRead(id);
      toast.success('Bildirim okundu olarak işaretlendi');
    } catch (error) {
      toast.error('Hata oluştu');
    }
  };

  // Handle mark all as read
  const handleMarkAllAsRead = async () => {
    try {
      await markAllAsRead();
      toast.success('Tüm bildirimler okundu olarak işaretlendi');
    } catch (error) {
      toast.error('Hata oluştu');
    }
  };

  // Handle delete
  const handleDelete = async (id: string) => {
    try {
      await deleteNotification(id);
      toast.success('Bildirim silindi');
    } catch (error) {
      toast.error('Hata oluştu');
    }
  };

  // Get type color
  const getTypeColor = (type: string) => {
    switch (type) {
      case 'COIN':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'RITUAL':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'ADMIN':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'SYSTEM':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  // Get priority color
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'URGENT':
        return 'border-red-500 bg-red-50';
      case 'HIGH':
        return 'border-orange-500 bg-orange-50';
      case 'NORMAL':
        return 'border-blue-500 bg-blue-50';
      case 'LOW':
        return 'border-gray-500 bg-gray-50';
      default:
        return 'border-gray-300 bg-gray-50';
    }
  };

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Az önce';
    if (diffInHours < 24) return `${diffInHours} saat önce`;
    if (diffInHours < 48) return 'Dün';
    return date.toLocaleDateString('tr-TR');
  };

  return (
    <>
      {/* Notification Bell Button */}
      <button
        ref={bellRef}
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-600 hover:text-gray-800 transition-colors duration-200 hover:bg-gray-100 rounded-full"
      >
        <Bell className="w-6 h-6" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium animate-pulse">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {/* Notification Dropdown Portal */}
      {isOpen && createPortal(
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black bg-opacity-20 backdrop-blur-sm z-[9998] transition-opacity duration-200"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Dropdown */}
          <div 
            ref={dropdownRef}
            className="fixed bg-white rounded-xl shadow-2xl border border-gray-200 z-[9999] max-h-96 overflow-hidden animate-in slide-in-from-top-2 duration-200"
            style={{
              top: bellPosition.top,
              right: bellPosition.right,
              width: 'min(350px, calc(100vw - 2rem))',
              maxWidth: '350px'
            }}
          >
            {/* Header */}
            <div className="px-4 py-3 border-b border-gray-200 bg-gradient-to-r from-purple-50 to-blue-50">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <Bell className="w-5 h-5 text-purple-600" />
                  Bildirimler
                </h3>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              {/* Filters */}
              <div className="flex items-center space-x-2 mt-3">
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                >
                  <option value="ALL">Tümü</option>
                  <option value="COIN">Coin</option>
                  <option value="RITUAL">Ritüel</option>
                  <option value="ADMIN">Admin</option>
                  <option value="SYSTEM">Sistem</option>
                </select>
                
                <div className="relative flex-1">
                  <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Ara..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-8 pr-3 py-1.5 text-sm border border-gray-300 rounded-lg text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between mt-3">
                <span className="text-sm text-gray-600 font-medium">
                  {filteredNotifications.length} bildirim
                </span>
                {unreadCount > 0 && (
                  <button
                    onClick={handleMarkAllAsRead}
                    className="text-sm text-purple-600 hover:text-purple-800 transition-colors font-medium hover:underline"
                  >
                    Tümünü okundu işaretle
                  </button>
                )}
              </div>
            </div>

            {/* Notification List */}
            <div className="max-h-80 overflow-y-auto">
              {filteredNotifications.length === 0 ? (
                <div className="px-4 py-8 text-center text-gray-500">
                  <Bell className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                  <p className="text-sm">Bildirim bulunamadı</p>
                  <p className="text-xs text-gray-400 mt-1">Yeni bildirimler burada görünecek</p>
                </div>
              ) : (
                filteredNotifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors duration-200 ${
                      !notification.isRead ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''
                    }`}
                  >
                    {/* Header */}
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getTypeColor(notification.type)}`}>
                          {notification.type}
                        </span>
                        <span className={`px-2 py-1 text-xs rounded-full border ${getPriorityColor(notification.priority)}`}>
                          {notification.priority}
                        </span>
                      </div>
                      <div className="flex items-center space-x-1">
                        {!notification.isRead && (
                          <button
                            onClick={() => handleMarkAsRead(notification.id)}
                            className="p-1.5 text-gray-400 hover:text-green-600 transition-colors rounded-full hover:bg-green-50"
                            title="Okundu olarak işaretle"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(notification.id)}
                          className="p-1.5 text-gray-400 hover:text-red-600 transition-colors rounded-full hover:bg-red-50"
                          title="Sil"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="mb-2">
                      <h4 className="font-medium text-gray-900 mb-1 text-sm">
                        {notification.title}
                      </h4>
                      <p className="text-sm text-gray-600 leading-relaxed">
                        {notification.message}
                      </p>
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <div className="w-1.5 h-1.5 bg-gray-400 rounded-full"></div>
                        {formatDate(notification.createdAt)}
                      </span>
                      {notification.admin && (
                        <span className="text-blue-600 font-medium">
                          {notification.admin.name}
                        </span>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            {filteredNotifications.length > 0 && (
              <div className="px-4 py-3 border-t border-gray-200 bg-gray-50">
                <div className="flex items-center justify-center">
                  <span className="text-xs text-gray-500">
                    Son güncelleme: {new Date().toLocaleTimeString('tr-TR')}
                  </span>
                </div>
              </div>
            )}
          </div>
        </>,
        document.body
      )}
    </>
  );
}