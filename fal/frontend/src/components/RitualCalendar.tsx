'use client';

import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  Plus, 
  Clock, 
  MapPin, 
  Star, 
  Heart, 
  Moon, 
  Sun, 
  Zap, 
  Leaf,
  ChevronLeft,
  ChevronRight,
  X,
  Edit,
  Trash2
} from 'lucide-react';
import { toast } from 'react-hot-toast';

interface Ritual {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  icon: string;
  color: string;
  isCompleted: boolean;
  createdAt: string;
}

interface RitualCalendarProps {
  isOpen: boolean;
  onClose: () => void;
}

const ICONS = [
  { name: 'moon', component: Moon, color: 'bg-indigo-100 text-indigo-600' },
  { name: 'sun', component: Sun, color: 'bg-yellow-100 text-yellow-600' },
  { name: 'star', component: Star, color: 'bg-purple-100 text-purple-600' },
  { name: 'heart', component: Heart, color: 'bg-pink-100 text-pink-600' },
  { name: 'zap', component: Zap, color: 'bg-blue-100 text-blue-600' },
  { name: 'leaf', component: Leaf, color: 'bg-green-100 text-green-600' },
];

const COLORS = [
  'bg-purple-100 border-purple-300 text-purple-800',
  'bg-pink-100 border-pink-300 text-pink-800',
  'bg-blue-100 border-blue-300 text-blue-800',
  'bg-green-100 border-green-300 text-green-800',
  'bg-yellow-100 border-yellow-300 text-yellow-800',
  'bg-indigo-100 border-indigo-300 text-indigo-800',
];

export default function RitualCalendar({ isOpen, onClose }: RitualCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<'month' | 'week'>('month');
  const [rituals, setRituals] = useState<Ritual[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [editingRitual, setEditingRitual] = useState<Ritual | null>(null);

  // Fetch rituals from API
  useEffect(() => {
    const fetchRituals = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/rituals`);
        const data = await response.json();
        
        if (data.success) {
          setRituals(data.data);
        } else {
          // Fallback to dummy data if API fails
          const dummyRituals: Ritual[] = [
            {
              id: '1',
              title: 'Ay Ritüeli',
              description: 'Dolunay enerjisi ile meditasyon ve niyet belirleme',
              date: new Date().toISOString().split('T')[0],
              time: '20:00',
              icon: 'moon',
              color: 'bg-indigo-100 border-indigo-300 text-indigo-800',
              isCompleted: false,
              createdAt: new Date().toISOString()
            },
            {
              id: '2',
              title: 'Sabah Güneş Ritüeli',
              description: 'Güneş doğarken enerji toplama ve günlük niyet belirleme',
              date: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0],
              time: '06:30',
              icon: 'sun',
              color: 'bg-yellow-100 border-yellow-300 text-yellow-800',
              isCompleted: false,
              createdAt: new Date().toISOString()
            },
            {
              id: '3',
              title: 'Aşk Ritüeli',
              description: 'Kalp çakrası açma ve sevgi enerjisi yükleme',
              date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
              time: '19:00',
              icon: 'heart',
              color: 'bg-pink-100 border-pink-300 text-pink-800',
              isCompleted: false,
              createdAt: new Date().toISOString()
            }
          ];
          setRituals(dummyRituals);
        }
      } catch (error) {
        console.error('Error fetching rituals:', error);
        // Use dummy data as fallback
        const dummyRituals: Ritual[] = [
          {
            id: '1',
            title: 'Ay Ritüeli',
            description: 'Dolunay enerjisi ile meditasyon ve niyet belirleme',
            date: new Date().toISOString().split('T')[0],
            time: '20:00',
            icon: 'moon',
            color: 'bg-indigo-100 border-indigo-300 text-indigo-800',
            isCompleted: false,
            createdAt: new Date().toISOString()
          }
        ];
        setRituals(dummyRituals);
      }
    };

    fetchRituals();
  }, []);

  // Get days in month
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    
    // Previous month's trailing days
    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
      const prevDate = new Date(year, month, -i);
      days.push({
        date: prevDate,
        isCurrentMonth: false,
        isToday: false
      });
    }

    // Current month's days
    for (let day = 1; day <= daysInMonth; day++) {
      const currentDate = new Date(year, month, day);
      const today = new Date();
      days.push({
        date: currentDate,
        isCurrentMonth: true,
        isToday: currentDate.toDateString() === today.toDateString()
      });
    }

    // Next month's leading days
    const remainingDays = 42 - days.length;
    for (let day = 1; day <= remainingDays; day++) {
      const nextDate = new Date(year, month + 1, day);
      days.push({
        date: nextDate,
        isCurrentMonth: false,
        isToday: false
      });
    }

    return days;
  };

  // Get rituals for a specific date
  const getRitualsForDate = (date: Date) => {
    const dateString = date.toISOString().split('T')[0];
    return rituals.filter(ritual => ritual.date === dateString);
  };

  // Get upcoming rituals
  const getUpcomingRituals = () => {
    const today = new Date().toISOString().split('T')[0];
    const nextWeek = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    
    return rituals
      .filter(ritual => ritual.date >= today && ritual.date <= nextWeek)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .slice(0, 5);
  };

  // Get today's rituals
  const getTodaysRituals = () => {
    const today = new Date().toISOString().split('T')[0];
    return rituals.filter(ritual => ritual.date === today);
  };

  // Navigate months
  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(prev.getMonth() - 1);
      } else {
        newDate.setMonth(prev.getMonth() + 1);
      }
      return newDate;
    });
  };

  // Handle date click
  const handleDateClick = (date: Date) => {
    if (date.getMonth() === currentDate.getMonth()) {
      setSelectedDate(date.toISOString().split('T')[0]);
      setShowAddModal(true);
    }
  };

  // Add new ritual
  const handleAddRitual = async (ritualData: Omit<Ritual, 'id' | 'createdAt'>) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/rituals`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(ritualData),
      });

      const data = await response.json();
      
      if (data.success) {
        setRituals(prev => [...prev, data.data]);
        setShowAddModal(false);
        toast.success('Ritüel başarıyla eklendi!');
      } else {
        toast.error(data.message || 'Ritüel eklenemedi');
      }
    } catch (error) {
      console.error('Error adding ritual:', error);
      toast.error('Ritüel eklenemedi');
    }
  };

  // Toggle ritual completion
  const toggleRitualCompletion = async (id: string) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/rituals/${id}/toggle`, {
        method: 'PATCH',
      });

      const data = await response.json();
      
      if (data.success) {
        setRituals(prev => prev.map(ritual => 
          ritual.id === id ? data.data : ritual
        ));
        toast.success('Ritüel durumu güncellendi!');
      } else {
        toast.error(data.message || 'Ritüel durumu güncellenemedi');
      }
    } catch (error) {
      console.error('Error toggling ritual:', error);
      toast.error('Ritüel durumu güncellenemedi');
    }
  };

  // Delete ritual
  const deleteRitual = async (id: string) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/rituals/${id}`, {
        method: 'DELETE',
      });

      const data = await response.json();
      
      if (data.success) {
        setRituals(prev => prev.filter(ritual => ritual.id !== id));
        toast.success('Ritüel silindi!');
      } else {
        toast.error(data.message || 'Ritüel silinemedi');
      }
    } catch (error) {
      console.error('Error deleting ritual:', error);
      toast.error('Ritüel silinemedi');
    }
  };

  const days = getDaysInMonth(currentDate);
  const upcomingRituals = getUpcomingRituals();
  const todaysRituals = getTodaysRituals();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Calendar className="w-8 h-8" />
              <div>
                <h2 className="text-2xl font-bold">Ritüel Takvimi</h2>
                <p className="text-purple-100">Ruhsal yolculuğunuzu planlayın</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:text-purple-200 transition-colors p-2 rounded-full hover:bg-white hover:bg-opacity-20"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row h-full">
          {/* Sidebar */}
          <div className="lg:w-80 bg-gray-50 p-6 border-r border-gray-200">
            {/* View Mode Toggle */}
            <div className="mb-6">
              <div className="flex bg-white rounded-lg p-1 shadow-sm">
                <button
                  onClick={() => setViewMode('month')}
                  className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
                    viewMode === 'month' 
                      ? 'bg-purple-600 text-white shadow-sm' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Aylık
                </button>
                <button
                  onClick={() => setViewMode('week')}
                  className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
                    viewMode === 'week' 
                      ? 'bg-purple-600 text-white shadow-sm' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Haftalık
                </button>
              </div>
            </div>

            {/* Today's Rituals */}
            {todaysRituals.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <Sun className="w-5 h-5 text-yellow-500" />
                  Bugünkü Ritüeller
                </h3>
                <div className="space-y-2">
                  {todaysRituals.map(ritual => (
                    <div
                      key={ritual.id}
                      className={`p-3 rounded-lg border-2 ${ritual.color} ${
                        ritual.isCompleted ? 'opacity-60' : ''
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {React.createElement(ICONS.find(i => i.name === ritual.icon)?.component || Star, {
                            className: "w-4 h-4"
                          })}
                          <span className="font-medium text-sm">{ritual.title}</span>
                        </div>
                        <button
                          onClick={() => toggleRitualCompletion(ritual.id)}
                          className={`w-4 h-4 rounded-full border-2 ${
                            ritual.isCompleted 
                              ? 'bg-green-500 border-green-500' 
                              : 'border-gray-300 hover:border-green-500'
                          }`}
                        />
                      </div>
                      <p className="text-xs mt-1 opacity-80">{ritual.time}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Upcoming Rituals */}
            {upcomingRituals.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <Clock className="w-5 h-5 text-blue-500" />
                  Yaklaşan Ritüeller
                </h3>
                <div className="space-y-2">
                  {upcomingRituals.map(ritual => (
                    <div
                      key={ritual.id}
                      className={`p-3 rounded-lg border-2 ${ritual.color} hover:shadow-md transition-shadow`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {React.createElement(ICONS.find(i => i.name === ritual.icon)?.component || Star, {
                            className: "w-4 h-4"
                          })}
                          <span className="font-medium text-sm">{ritual.title}</span>
                        </div>
                        <button
                          onClick={() => deleteRitual(ritual.id)}
                          className="text-red-400 hover:text-red-600 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <p className="text-xs mt-1 opacity-80">
                        {new Date(ritual.date).toLocaleDateString('tr-TR')} - {ritual.time}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Calendar */}
          <div className="flex-1 p-6">
            {/* Calendar Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => navigateMonth('prev')}
                  className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <h3 className="text-xl font-semibold text-gray-900">
                  {currentDate.toLocaleDateString('tr-TR', { month: 'long', year: 'numeric' })}
                </h3>
                <button
                  onClick={() => navigateMonth('next')}
                  className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
              <button
                onClick={() => {
                  setSelectedDate('');
                  setShowAddModal(true);
                }}
                className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-2 rounded-lg hover:shadow-lg transition-all flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Ritüel Ekle
              </button>
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-1">
              {/* Day headers */}
              {['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'].map(day => (
                <div key={day} className="p-3 text-center text-sm font-medium text-gray-500">
                  {day}
                </div>
              ))}

              {/* Calendar days */}
              {days.map((day, index) => {
                const dayRituals = getRitualsForDate(day.date);
                return (
                  <div
                    key={index}
                    onClick={() => handleDateClick(day.date)}
                    className={`min-h-[100px] p-2 border border-gray-200 cursor-pointer hover:bg-gray-50 transition-colors ${
                      day.isCurrentMonth ? 'bg-white' : 'bg-gray-50'
                    } ${day.isToday ? 'ring-2 ring-purple-500' : ''}`}
                  >
                    <div className={`text-sm font-medium mb-1 ${
                      day.isCurrentMonth ? 'text-gray-900' : 'text-gray-400'
                    } ${day.isToday ? 'text-purple-600' : ''}`}>
                      {day.date.getDate()}
                    </div>
                    <div className="space-y-1">
                      {dayRituals.slice(0, 2).map(ritual => (
                        <div
                          key={ritual.id}
                          className={`text-xs p-1 rounded ${ritual.color} truncate`}
                          title={`${ritual.title} - ${ritual.time}`}
                        >
                          {React.createElement(ICONS.find(i => i.name === ritual.icon)?.component || Star, {
                            className: "w-3 h-3 inline mr-1"
                          })}
                          {ritual.title}
                        </div>
                      ))}
                      {dayRituals.length > 2 && (
                        <div className="text-xs text-gray-500">
                          +{dayRituals.length - 2} daha
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Add/Edit Ritual Modal */}
        {showAddModal && (
          <AddRitualModal
            selectedDate={selectedDate}
            onClose={() => {
              setShowAddModal(false);
              setEditingRitual(null);
            }}
            onSave={handleAddRitual}
            ritual={editingRitual}
          />
        )}
      </div>
    </div>
  );
}

// Add/Edit Ritual Modal Component
interface AddRitualModalProps {
  selectedDate: string;
  onClose: () => void;
  onSave: (ritual: Omit<Ritual, 'id' | 'createdAt'>) => void;
  ritual?: Ritual | null;
}

function AddRitualModal({ selectedDate, onClose, onSave, ritual }: AddRitualModalProps) {
  const [formData, setFormData] = useState({
    title: ritual?.title || '',
    description: ritual?.description || '',
    date: ritual?.date || selectedDate || new Date().toISOString().split('T')[0],
    time: ritual?.time || '20:00',
    icon: ritual?.icon || 'moon',
    color: ritual?.color || COLORS[0]
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      toast.error('Başlık gereklidir');
      return;
    }
    onSave({
      ...formData,
      isCompleted: ritual?.isCompleted || false
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-[10000] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-6 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold">
              {ritual ? 'Ritüel Düzenle' : 'Yeni Ritüel Ekle'}
            </h3>
            <button
              onClick={onClose}
              className="text-white hover:text-purple-200 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Başlık
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Ritüel başlığı"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Açıklama
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              rows={3}
              placeholder="Ritüel açıklaması"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tarih
              </label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Saat
              </label>
              <input
                type="time"
                value={formData.time}
                onChange={(e) => setFormData(prev => ({ ...prev, time: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              İkon
            </label>
            <div className="grid grid-cols-3 gap-2">
              {ICONS.map(icon => (
                <button
                  key={icon.name}
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, icon: icon.name }))}
                  className={`p-3 rounded-lg border-2 transition-all ${
                    formData.icon === icon.name
                      ? 'border-purple-500 bg-purple-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <icon.component className={`w-6 h-6 mx-auto ${icon.color.split(' ')[1]}`} />
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Renk
            </label>
            <div className="grid grid-cols-3 gap-2">
              {COLORS.map((color, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, color }))}
                  className={`p-3 rounded-lg border-2 transition-all ${
                    formData.color === color
                      ? 'ring-2 ring-purple-500'
                      : 'border-gray-200 hover:border-gray-300'
                  } ${color}`}
                >
                  <div className="w-4 h-4 rounded-full bg-current opacity-60"></div>
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              İptal
            </button>
            <button
              type="submit"
              className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-2 rounded-lg hover:shadow-lg transition-all"
            >
              {ritual ? 'Güncelle' : 'Ekle'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
