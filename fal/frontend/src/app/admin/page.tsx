'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Users, 
  UserCheck, 
  Crown, 
  TrendingUp, 
  Calendar,
  BarChart3,
  Settings,
  LogOut,
  Eye,
  Trash2,
  Shield,
  Coins
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell
} from 'recharts';

interface User {
  id: string;
  name: string;
  email: string;
  isPremium: boolean;
  isActive: boolean;
  premiumStartDate: string | null;
  premiumEndDate: string | null;
  lastLoginDate: string;
  createdAt: string;
  coins: number;
  role: string;
}

interface DashboardStats {
  totalUsers: number;
  activeUsers: number;
  premiumUsers: number;
  todayRegistrations: number;
  weeklyRegistrations: number;
  monthlyRegistrations: number;
  monthlyPremiumPurchases: number;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [premiumUsers, setPremiumUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  const router = useRouter();

  // Coin gönderme form state'leri
  const [selectedUserId, setSelectedUserId] = useState<string>('');
  const [coinAmount, setCoinAmount] = useState<number>(0);
  const [message, setMessage] = useState<string>('');
  const [isSendingCoins, setIsSendingCoins] = useState<boolean>(false);

  // Bildirim gönderme form state'leri
  const [notificationType, setNotificationType] = useState<string>('');
  const [notificationUserId, setNotificationUserId] = useState<string>('');
  const [notificationTitle, setNotificationTitle] = useState<string>('');
  const [notificationMessage, setNotificationMessage] = useState<string>('');
  const [notificationPriority, setNotificationPriority] = useState<string>('NORMAL');
  const [isSendingNotification, setIsSendingNotification] = useState<boolean>(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    
    if (!token || user.role !== 'ADMIN') {
      router.push('/auth/login');
      return;
    }

    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('token');
      
      // Fetch dashboard stats
      const statsResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/stats`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const statsData = await statsResponse.json();
      
      if (statsData.success) {
        // Backend'den gelen veriyi frontend formatına dönüştür
        const transformedStats = {
          totalUsers: statsData.data.stats.users.total,
          activeUsers: statsData.data.stats.users.active,
          premiumUsers: 0, // Henüz premium kullanıcı sayısı yok
          todayRegistrations: 0, // Henüz günlük kayıt sayısı yok
          weeklyRegistrations: 0, // Henüz haftalık kayıt sayısı yok
          monthlyRegistrations: 0, // Henüz aylık kayıt sayısı yok
          monthlyPremiumPurchases: 0 // Henüz premium satın alma sayısı yok
        };
        setStats(transformedStats);
      }

      // Fetch all users
      const usersResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/users`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const usersData = await usersResponse.json();
      
      if (usersData.success) {
        // Backend'den gelen veriyi frontend formatına dönüştür
        const transformedUsers = usersData.data.users.map((user: any) => ({
          ...user,
          isPremium: false, // Henüz premium bilgisi yok
          premiumStartDate: null,
          premiumEndDate: null,
          lastLoginDate: user.createdAt // Geçici olarak kayıt tarihi
        }));
        setUsers(transformedUsers);
      }

      // Premium users henüz mevcut değil
      setPremiumUsers([]);
    } catch (error) {
      toast.error('Veri yüklenirken hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const handleSendCoins = async () => {
    if (!selectedUserId || coinAmount <= 0) {
      toast.error('Lütfen geçerli bir kullanıcı ve miktar seçin');
      return;
    }

    setIsSendingCoins(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/send-coins`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          userId: selectedUserId,
          amount: coinAmount,
          message: message
        })
      });

      const data = await response.json();
      if (data.success) {
        toast.success(data.message);
        setSelectedUserId('');
        setCoinAmount(0);
        setMessage('');
        fetchDashboardData(); // Verileri yenile
      } else {
        toast.error(data.message || 'Coin gönderimi başarısız');
      }
    } catch (error) {
      toast.error('Coin gönderimi sırasında hata oluştu');
    } finally {
      setIsSendingCoins(false);
    }
  };

  const handleSendNotification = async () => {
    if (!notificationTitle || !notificationMessage) {
      toast.error('Lütfen başlık ve mesaj girin');
      return;
    }

    setIsSendingNotification(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/send-notification`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          title: notificationTitle,
          message: notificationMessage,
          type: notificationType || 'GENERAL',
          priority: notificationPriority,
          userId: notificationUserId || undefined
        })
      });

      const data = await response.json();
      if (data.success) {
        toast.success(data.message);
        setNotificationTitle('');
        setNotificationMessage('');
        setNotificationType('');
        setNotificationUserId('');
        setNotificationPriority('NORMAL');
      } else {
        toast.error(data.message || 'Bildirim gönderimi başarısız');
      }
    } catch (error) {
      toast.error('Bildirim gönderimi sırasında hata oluştu');
    } finally {
      setIsSendingNotification(false);
    }
  };

  const handleUserAction = async (userId: string, action: string, value?: any) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/users/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ [action]: value })
      });

      const data = await response.json();
      if (data.success) {
        toast.success('Kullanıcı güncellendi');
        fetchDashboardData(); // Verileri yenile
      } else {
        toast.error(data.message || 'Güncelleme başarısız');
      }
    } catch (error) {
      toast.error('Güncelleme sırasında hata oluştu');
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm('Bu kullanıcıyı silmek istediğinizden emin misiniz?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/users/${userId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();
      if (data.success) {
        toast.success('Kullanıcı silindi');
        fetchDashboardData(); // Verileri yenile
      } else {
        toast.error(data.message || 'Silme başarısız');
      }
    } catch (error) {
      toast.error('Silme sırasında hata oluştu');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/auth/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <Shield className="h-8 w-8 text-purple-600 mr-3" />
              <h1 className="text-2xl font-bold text-gray-900">Admin Panel</h1>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center px-4 py-2 text-gray-600 hover:text-gray-900"
            >
              <LogOut className="h-5 w-5 mr-2" />
              Çıkış
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation Tabs */}
        <div className="flex space-x-1 bg-white p-1 rounded-lg shadow-sm mb-8">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'dashboard'
                ? 'bg-purple-600 text-white'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <BarChart3 className="h-4 w-4 mr-2" />
            Dashboard
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'users'
                ? 'bg-purple-600 text-white'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Users className="h-4 w-4 mr-2" />
            Kullanıcılar
          </button>
          <button
            onClick={() => setActiveTab('premium')}
            className={`flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'premium'
                ? 'bg-purple-600 text-white'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Crown className="h-4 w-4 mr-2" />
            Premium Üyeler
          </button>
          <button
            onClick={() => setActiveTab('send-coins')}
            className={`flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'send-coins'
                ? 'bg-purple-600 text-white'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Coins className="h-4 w-4 mr-2" />
            Coin Gönder
          </button>
          <button
            onClick={() => setActiveTab('notifications')}
            className={`flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'notifications'
                ? 'bg-purple-600 text-white'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Settings className="h-4 w-4 mr-2" />
            Bildirimler
          </button>
        </div>

        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && stats && (
          <div className="space-y-8">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Users className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Toplam Kullanıcı</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.totalUsers}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <UserCheck className="h-6 w-6 text-green-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Aktif Kullanıcı</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.activeUsers}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-yellow-100 rounded-lg">
                    <Crown className="h-6 w-6 text-yellow-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Premium Üye</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.premiumUsers}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <Calendar className="h-6 w-6 text-purple-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Bugün Kayıt</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.todayRegistrations}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Kayıt İstatistikleri</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={[
                    { name: 'Bugün', value: stats.todayRegistrations },
                    { name: 'Bu Hafta', value: stats.weeklyRegistrations },
                    { name: 'Bu Ay', value: stats.monthlyRegistrations },
                    { name: 'Premium', value: stats.monthlyPremiumPurchases }
                  ]}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="value" fill="#8B5CF6" />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Kullanıcı Dağılımı</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={[
                        { name: 'Normal Kullanıcı', value: stats.totalUsers - stats.premiumUsers },
                        { name: 'Premium Üye', value: stats.premiumUsers }
                      ]}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {COLORS.map((color, index) => (
                        <Cell key={`cell-${index}`} fill={color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div className="bg-white rounded-lg shadow-sm">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Tüm Kullanıcılar</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Kullanıcı
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Durum
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Premium
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Coin
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Kayıt Tarihi
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      İşlemler
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {users.map((user) => (
                    <tr key={user.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
                              <span className="text-sm font-medium text-purple-600">
                                {user.name.charAt(0).toUpperCase()}
                              </span>
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{user.name}</div>
                            <div className="text-sm text-gray-500">{user.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          user.isActive
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {user.isActive ? 'Aktif' : 'Pasif'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          user.isPremium
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {user.isPremium ? 'Premium' : 'Normal'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {user.coins}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(user.createdAt).toLocaleDateString('tr-TR')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleUserAction(user.id, 'isActive', !user.isActive)}
                            className="text-indigo-600 hover:text-indigo-900"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleUserAction(user.id, 'isPremium', !user.isPremium)}
                            className="text-yellow-600 hover:text-yellow-900"
                          >
                            <Crown className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteUser(user.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Premium Users Tab */}
        {activeTab === 'premium' && (
          <div className="bg-white rounded-lg shadow-sm">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Premium Üyeler</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Kullanıcı
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Premium Başlangıç
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Premium Bitiş
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Son Giriş
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {premiumUsers.map((user) => (
                    <tr key={user.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <div className="h-10 w-10 rounded-full bg-yellow-100 flex items-center justify-center">
                              <Crown className="h-5 w-5 text-yellow-600" />
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{user.name}</div>
                            <div className="text-sm text-gray-500">{user.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {user.premiumStartDate 
                          ? new Date(user.premiumStartDate).toLocaleDateString('tr-TR')
                          : '-'
                        }
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {user.premiumEndDate 
                          ? new Date(user.premiumEndDate).toLocaleDateString('tr-TR')
                          : '-'
                        }
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(user.lastLoginDate).toLocaleDateString('tr-TR')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Send Coins Tab */}
        {activeTab === 'send-coins' && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Kullanıcıya Coin Gönder</h3>
            <div className="max-w-md space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Kullanıcı Seç
                </label>
                <select
                  value={selectedUserId}
                  onChange={(e) => setSelectedUserId(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="">Kullanıcı seçin</option>
                  {users.map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.name} ({user.email})
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Coin Miktarı
                </label>
                <input
                  type="number"
                  value={coinAmount}
                  onChange={(e) => setCoinAmount(Number(e.target.value))}
                  min="1"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Coin miktarı girin"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mesaj (Opsiyonel)
                </label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Coin gönderimi hakkında mesaj"
                />
              </div>
              <button
                onClick={handleSendCoins}
                disabled={isSendingCoins || !selectedUserId || coinAmount <= 0}
                className="w-full bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSendingCoins ? 'Gönderiliyor...' : 'Coin Gönder'}
              </button>
            </div>
          </div>
        )}

        {/* Notifications Tab */}
        {activeTab === 'notifications' && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Bildirim Gönder</h3>
            <div className="max-w-md space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Bildirim Türü
                </label>
                <select
                  value={notificationType}
                  onChange={(e) => setNotificationType(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="">Tür seçin</option>
                  <option value="SYSTEM">Sistem</option>
                  <option value="ADMIN">Admin</option>
                  <option value="GENERAL">Genel</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Kullanıcı (Opsiyonel)
                </label>
                <select
                  value={notificationUserId}
                  onChange={(e) => setNotificationUserId(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="">Tüm kullanıcılara</option>
                  {users.map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.name} ({user.email})
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Başlık
                </label>
                <input
                  type="text"
                  value={notificationTitle}
                  onChange={(e) => setNotificationTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Bildirim başlığı"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mesaj
                </label>
                <textarea
                  value={notificationMessage}
                  onChange={(e) => setNotificationMessage(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Bildirim mesajı"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Öncelik
                </label>
                <select
                  value={notificationPriority}
                  onChange={(e) => setNotificationPriority(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="LOW">Düşük</option>
                  <option value="NORMAL">Normal</option>
                  <option value="HIGH">Yüksek</option>
                  <option value="URGENT">Acil</option>
                </select>
              </div>
              <button
                onClick={handleSendNotification}
                disabled={isSendingNotification || !notificationTitle || !notificationMessage}
                className="w-full bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSendingNotification ? 'Gönderiliyor...' : 'Bildirim Gönder'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
