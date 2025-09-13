'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { User, Mail, Coins, Calendar, Edit, Save, X, LogOut, Loader2, CreditCard, ShoppingCart, Sparkles } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useAuth } from '@/components/AuthContext';
import Navigation from '@/components/Navigation';
import Link from 'next/link';

interface RitualOrder {
  id: string;
  type: string;
  description: string;
  price: number;
  status: string;
  createdAt: string;
}

export default function ProfilePage() {
  const { user, logout, updateUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editData, setEditData] = useState({
    name: '',
    email: ''
  });
  const [saving, setSaving] = useState(false);
  const [ritualOrders, setRitualOrders] = useState<RitualOrder[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push('/auth/login');
      return;
    }

    setEditData({
      name: user.name,
      email: user.email
    });

    // Satın alınan ritüelleri yükle
    fetchRitualOrders();
  }, [user, router]);

  const fetchRitualOrders = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/rituals/orders`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();
      if (data.success) {
        setRitualOrders(data.data.orders);
      }
    } catch (error) {
      console.error('Error fetching ritual orders:', error);
    } finally {
      setLoadingOrders(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/user/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(editData)
      });

      const data = await response.json();

      if (data.success) {
        updateUser(editData);
        setEditing(false);
        toast.success('Profil güncellendi');
      } else {
        toast.error(data.message || 'Güncelleme başarısız');
      }
    } catch (error) {
      toast.error('Bir hata oluştu');
    } finally {
      setSaving(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'text-yellow-400';
      case 'COMPLETED':
        return 'text-green-400';
      case 'CANCELLED':
        return 'text-red-400';
      default:
        return 'text-gray-400';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'Beklemede';
      case 'COMPLETED':
        return 'Tamamlandı';
      case 'CANCELLED':
        return 'İptal Edildi';
      default:
        return status;
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 text-white animate-spin mx-auto mb-4" />
          <p className="text-white">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      <Navigation />
      
      <div className="p-4 pt-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-white mb-2">Profil</h1>
            <p className="text-gray-300">Hesap bilgilerinizi görüntüleyin ve düzenleyin</p>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Profil Bilgileri */}
            <div className="lg:col-span-2 bg-white/10 backdrop-blur-lg rounded-2xl p-6 shadow-2xl">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">Profil Bilgileri</h2>
                {!editing ? (
                  <button
                    onClick={() => setEditing(true)}
                    className="flex items-center gap-2 bg-purple-600 text-white px-3 py-2 rounded-lg hover:bg-purple-700 transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                    Düzenle
                  </button>
                ) : (
                  <div className="flex gap-2">
                    <button
                      onClick={handleSave}
                      disabled={saving}
                      className="flex items-center gap-2 bg-green-600 text-white px-3 py-2 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                    >
                      {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                      Kaydet
                    </button>
                    <button
                      onClick={() => setEditing(false)}
                      className="flex items-center gap-2 bg-gray-600 text-white px-3 py-2 rounded-lg hover:bg-gray-700 transition-colors"
                    >
                      <X className="w-4 h-4" />
                      İptal
                    </button>
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <User className="w-5 h-5 text-purple-400" />
                  <div className="flex-1">
                    <label className="text-sm text-gray-400">Ad Soyad</label>
                    {editing ? (
                      <input
                        type="text"
                        value={editData.name}
                        onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                        className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white mt-1 focus:outline-none focus:border-purple-400"
                      />
                    ) : (
                      <p className="text-white font-medium">{user.name}</p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-purple-400" />
                  <div className="flex-1">
                    <label className="text-sm text-gray-400">E-posta</label>
                    {editing ? (
                      <input
                        type="email"
                        value={editData.email}
                        onChange={(e) => setEditData({ ...editData, email: e.target.value })}
                        className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white mt-1 focus:outline-none focus:border-purple-400"
                      />
                    ) : (
                      <p className="text-white font-medium">{user.email}</p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Coins className="w-5 h-5 text-yellow-400" />
                  <div className="flex-1">
                    <label className="text-sm text-gray-400">Coin Bakiyesi</label>
                    <p className="text-white font-medium">{user.coins} Coin</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-blue-400" />
                  <div className="flex-1">
                    <label className="text-sm text-gray-400">Kayıt Tarihi</label>
                    <p className="text-white font-medium">
                      {new Date(user.createdAt).toLocaleDateString('tr-TR')}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Hızlı İşlemler */}
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 shadow-2xl">
              <h2 className="text-2xl font-bold text-white mb-6">Hızlı İşlemler</h2>
              <div className="space-y-4">
                <Link href="/coins">
                  <button className="w-full flex items-center gap-3 bg-gradient-to-r from-yellow-500 to-orange-500 text-white p-4 rounded-lg hover:from-yellow-600 hover:to-orange-600 transition-all">
                    <CreditCard className="w-5 h-5" />
                    <span>Coin Satın Al</span>
                  </button>
                </Link>
                
                <Link href="/rituals">
                  <button className="w-full flex items-center gap-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white p-4 rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all">
                    <Sparkles className="w-5 h-5" />
                    <span>Ritüeller</span>
                  </button>
                </Link>

                <Link href="/transactions">
                  <button className="w-full flex items-center gap-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white p-4 rounded-lg hover:from-blue-600 hover:to-cyan-600 transition-all">
                    <ShoppingCart className="w-5 h-5" />
                    <span>İşlem Geçmişi</span>
                  </button>
                </Link>

                <button
                  onClick={logout}
                  className="w-full flex items-center gap-3 bg-gradient-to-r from-red-500 to-pink-500 text-white p-4 rounded-lg hover:from-red-600 hover:to-pink-600 transition-all"
                >
                  <LogOut className="w-5 h-5" />
                  <span>Çıkış Yap</span>
                </button>
              </div>
            </div>
          </div>

          {/* Satın Alınan Ritüeller */}
          <div className="mt-8 bg-white/10 backdrop-blur-lg rounded-2xl p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">Satın Alınan Ritüeller</h2>
              <button
                onClick={fetchRitualOrders}
                className="flex items-center gap-2 bg-purple-600 text-white px-3 py-2 rounded-lg hover:bg-purple-700 transition-colors"
              >
                <Sparkles className="w-4 h-4" />
                Yenile
              </button>
            </div>

            {loadingOrders ? (
              <div className="text-center py-8">
                <Loader2 className="w-8 h-8 text-white animate-spin mx-auto mb-4" />
                <p className="text-white">Ritüeller yükleniyor...</p>
              </div>
            ) : ritualOrders.length === 0 ? (
              <div className="text-center py-8">
                <Sparkles className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-300 text-lg mb-4">Henüz ritüel satın almadınız</p>
                <Link href="/rituals">
                  <button className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all">
                    Ritüel Satın Al
                  </button>
                </Link>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {ritualOrders.map((order) => (
                  <div key={order.id} className="bg-white/5 backdrop-blur-lg rounded-xl p-4 border border-white/10">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-lg font-semibold text-white">{order.type}</h3>
                      <span className={`text-sm font-medium ${getStatusColor(order.status)}`}>
                        {getStatusText(order.status)}
                      </span>
                    </div>
                    
                    <p className="text-gray-300 text-sm mb-3">{order.description}</p>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Coins className="w-4 h-4 text-yellow-400" />
                        <span className="text-white font-medium">{order.price} Coin</span>
                      </div>
                      
                      <div className="text-right">
                        <p className="text-gray-400 text-xs">Satın Alma</p>
                        <p className="text-white text-sm">
                          {new Date(order.createdAt).toLocaleDateString('tr-TR')}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
