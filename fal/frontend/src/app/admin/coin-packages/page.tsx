'use client';

import { useState, useEffect } from 'react';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  EyeOff, 
  TrendingUp, 
  DollarSign,
  Package,
  Users
} from 'lucide-react';
import Navigation from '@/components/Navigation';
import { useAuth } from '@/components/AuthContext';
import toast from 'react-hot-toast';

interface CoinPackage {
  id: string;
  name: string;
  coins: number;
  price: number;
  description?: string;
  discount: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface PackageStats {
  packageId: string;
  packageName: string;
  totalSales: number;
  totalRevenue: number;
  totalCoins: number;
}

export default function AdminCoinPackagesPage() {
  const { user } = useAuth();
  const [packages, setPackages] = useState<CoinPackage[]>([]);
  const [stats, setStats] = useState<PackageStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingPackage, setEditingPackage] = useState<CoinPackage | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    coins: '',
    price: '',
    description: '',
    discount: '0',
    isActive: true
  });

  useEffect(() => {
    if (user?.role !== 'ADMIN') {
      toast.error('Admin yetkisi gerekli');
      return;
    }
    fetchPackages();
    fetchStats();
  }, [user]);

  const fetchPackages = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/coins/packages`);
      const data = await response.json();
      
      if (data.success) {
        // API'den gelen verinin array olduğundan emin ol
        const packagesData = Array.isArray(data.data) ? data.data : [];
        setPackages(packagesData);
      } else {
        setPackages([]);
      }
    } catch (error) {
      console.error('Error fetching packages:', error);
      toast.error('Paketler yüklenemedi');
      setPackages([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/coins/admin/package-stats`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      
      if (data.success) {
        // API'den gelen verinin array olduğundan emin ol
        const statsData = Array.isArray(data.data) ? data.data : [];
        setStats(statsData);
      } else {
        setStats([]);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
      setStats([]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const url = editingPackage 
        ? `${process.env.NEXT_PUBLIC_API_URL}/api/coins/admin/packages/${editingPackage.id}`
        : `${process.env.NEXT_PUBLIC_API_URL}/api/coins/admin/packages`;
      
      const method = editingPackage ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          ...formData,
          coins: parseInt(formData.coins),
          price: parseInt(formData.price),
          discount: parseInt(formData.discount)
        })
      });

      const data = await response.json();

      if (data.success) {
        toast.success(editingPackage ? 'Paket güncellendi' : 'Paket oluşturuldu');
        setShowCreateModal(false);
        setEditingPackage(null);
        resetForm();
        fetchPackages();
      } else {
        toast.error(data.message || 'İşlem başarısız');
      }
    } catch (error) {
      console.error('Error saving package:', error);
      toast.error('İşlem başarısız');
    }
  };

  const handleDelete = async (packageId: string) => {
    if (!confirm('Bu paketi silmek istediğinizden emin misiniz?')) {
      return;
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/coins/admin/packages/${packageId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      const data = await response.json();

      if (data.success) {
        toast.success('Paket silindi');
        fetchPackages();
      } else {
        toast.error(data.message || 'Silme işlemi başarısız');
      }
    } catch (error) {
      console.error('Error deleting package:', error);
      toast.error('Silme işlemi başarısız');
    }
  };

  const handleEdit = (pkg: CoinPackage) => {
    setEditingPackage(pkg);
    setFormData({
      name: pkg.name,
      coins: pkg.coins.toString(),
      price: pkg.price.toString(),
      description: pkg.description || '',
      discount: pkg.discount.toString(),
      isActive: pkg.isActive
    });
    setShowCreateModal(true);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      coins: '',
      price: '',
      description: '',
      discount: '0',
      isActive: true
    });
  };

  const formatPrice = (priceInCents: number) => {
    return (priceInCents / 100).toFixed(2);
  };

  if (user?.role !== 'ADMIN') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
        <Navigation />
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-white text-xl">Admin yetkisi gerekli</div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
        <Navigation />
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-white text-xl">Yükleniyor...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Coin Paket Yönetimi</h1>
            <p className="text-gray-300">Coin paketlerini yönetin ve satış istatistiklerini görün</p>
          </div>
          <button
            onClick={() => {
              setEditingPackage(null);
              resetForm();
              setShowCreateModal(true);
            }}
            className="flex items-center space-x-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-2 rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-200"
          >
            <Plus className="w-5 h-5" />
            <span>Yeni Paket</span>
          </button>
        </div>

        {/* Statistics */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-300 text-sm">Toplam Paket</p>
                <p className="text-2xl font-bold text-white">{Array.isArray(packages) ? packages.length : 0}</p>
              </div>
              <Package className="w-8 h-8 text-blue-400" />
            </div>
          </div>
          
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-300 text-sm">Aktif Paket</p>
                <p className="text-2xl font-bold text-white">{Array.isArray(packages) ? packages.filter(p => p.isActive).length : 0}</p>
              </div>
              <Eye className="w-8 h-8 text-green-400" />
            </div>
          </div>
          
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-300 text-sm">Toplam Satış</p>
                <p className="text-2xl font-bold text-white">{Array.isArray(stats) ? stats.reduce((sum, stat) => sum + stat.totalSales, 0) : 0}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-yellow-400" />
            </div>
          </div>
          
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-300 text-sm">Toplam Gelir</p>
                <p className="text-2xl font-bold text-white">
                  {formatPrice(Array.isArray(stats) ? stats.reduce((sum, stat) => sum + stat.totalRevenue, 0) : 0)} TL
                </p>
              </div>
              <DollarSign className="w-8 h-8 text-green-400" />
            </div>
          </div>
        </div>

        {/* Package Sales Stats */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 mb-8">
          <h2 className="text-2xl font-bold text-white mb-6">Satış İstatistikleri</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-white/20">
                  <th className="text-gray-300 font-medium py-3">Paket</th>
                  <th className="text-gray-300 font-medium py-3">Satış Adedi</th>
                  <th className="text-gray-300 font-medium py-3">Toplam Gelir</th>
                  <th className="text-gray-300 font-medium py-3">Toplam Coin</th>
                </tr>
              </thead>
              <tbody>
                {Array.isArray(stats) && stats.map((stat) => (
                  <tr key={stat.packageId} className="border-b border-white/10">
                    <td className="text-white py-3">{stat.packageName}</td>
                    <td className="text-white py-3">{stat.totalSales}</td>
                    <td className="text-white py-3">{formatPrice(stat.totalRevenue)} TL</td>
                    <td className="text-white py-3">{stat.totalCoins}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Packages List */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6">
          <h2 className="text-2xl font-bold text-white mb-6">Coin Paketleri</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.isArray(packages) && packages.map((pkg) => (
              <div key={pkg.id} className="bg-white/5 rounded-xl p-6">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-semibold text-white">{pkg.name}</h3>
                  <div className="flex items-center space-x-2">
                    {pkg.isActive ? (
                      <Eye className="w-4 h-4 text-green-400" />
                    ) : (
                      <EyeOff className="w-4 h-4 text-red-400" />
                    )}
                  </div>
                </div>
                
                <div className="space-y-2 mb-4">
                  <p className="text-gray-300 text-sm">
                    <span className="text-yellow-400 font-bold">{pkg.coins}</span> Coin
                  </p>
                  <p className="text-gray-300 text-sm">
                    <span className="text-white font-bold">{formatPrice(pkg.price)}</span> TL
                  </p>
                  {pkg.discount > 0 && (
                    <p className="text-green-400 text-sm">
                      %{pkg.discount} İndirim
                    </p>
                  )}
                  {pkg.description && (
                    <p className="text-gray-400 text-sm">{pkg.description}</p>
                  )}
                </div>
                
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEdit(pkg)}
                    className="flex-1 flex items-center justify-center space-x-1 bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                    <span>Düzenle</span>
                  </button>
                  <button
                    onClick={() => handleDelete(pkg.id)}
                    className="flex items-center justify-center bg-red-600 text-white px-3 py-2 rounded-lg hover:bg-red-700 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Create/Edit Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 max-w-md w-full">
            <h2 className="text-2xl font-bold text-white mb-6">
              {editingPackage ? 'Paketi Düzenle' : 'Yeni Paket Oluştur'}
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  Paket Adı
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  Coin Miktarı
                </label>
                <input
                  type="number"
                  value={formData.coins}
                  onChange={(e) => setFormData({...formData, coins: e.target.value})}
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
                  required
                  min="1"
                />
              </div>
              
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  Fiyat (Kuruş)
                </label>
                <input
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({...formData, price: e.target.value})}
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
                  required
                  min="1"
                />
                <p className="text-gray-400 text-xs mt-1">Örnek: 5000 = 50 TL</p>
              </div>
              
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  İndirim (%)
                </label>
                <input
                  type="number"
                  value={formData.discount}
                  onChange={(e) => setFormData({...formData, discount: e.target.value})}
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
                  min="0"
                  max="100"
                />
              </div>
              
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  Açıklama
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
                  rows={3}
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
                  className="rounded"
                />
                <label htmlFor="isActive" className="text-gray-300 text-sm">
                  Aktif
                </label>
              </div>
              
              <div className="flex space-x-4 pt-4">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 px-4 py-3 border border-gray-400 text-white rounded-lg hover:bg-white/10 transition-colors"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-200"
                >
                  {editingPackage ? 'Güncelle' : 'Oluştur'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
