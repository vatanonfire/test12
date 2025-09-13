'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  User, 
  Crown, 
  Coins, 
  Calendar,
  LogOut,
  Hand,
  Coffee,
  Camera
} from 'lucide-react';

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const userData = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    
    if (!userData || !token) {
      router.push('/auth/login');
      return;
    }

    setUser(JSON.parse(userData));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/');
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-lg border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">Merhaba, {user.name}</span>
              <button
                onClick={handleLogout}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Çıkış
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* User Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <User className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Kullanıcı</p>
                <p className="text-2xl font-bold text-gray-900">{user.name}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Crown className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Premium</p>
                <p className="text-2xl font-bold text-gray-900">
                  {user.isPremium ? 'Aktif' : 'Pasif'}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <Coins className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Coin</p>
                <p className="text-2xl font-bold text-gray-900">{user.coins || 0}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Calendar className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Ücretsiz Fal</p>
                <p className="text-2xl font-bold text-gray-900">{user.dailyFreeFortunes || 3}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Fortune Types */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Fal Türleri</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <Link href="/fortune/hand">
              <div className="bg-gradient-to-r from-pink-500 to-rose-500 rounded-lg p-6 text-white hover:shadow-lg transition-all duration-200 cursor-pointer">
                <div className="flex items-center mb-4">
                  <Hand className="h-8 w-8 mr-3" />
                  <h3 className="text-xl font-semibold">El Falı</h3>
                </div>
                <p className="text-pink-100">El çizgilerinizden geleceğinizi okuyun</p>
              </div>
            </Link>

            <Link href="/fortune/face">
              <div className="bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg p-6 text-white hover:shadow-lg transition-all duration-200 cursor-pointer">
                <div className="flex items-center mb-4">
                  <Camera className="h-8 w-8 mr-3" />
                  <h3 className="text-xl font-semibold">Yüz Falı</h3>
                </div>
                <p className="text-blue-100">Yüz hatlarınızdan karakterinizi keşfedin</p>
              </div>
            </Link>

            <Link href="/fortune/coffee">
              <div className="bg-gradient-to-r from-amber-500 to-orange-500 rounded-lg p-6 text-white hover:shadow-lg transition-all duration-200 cursor-pointer">
                <div className="flex items-center mb-4">
                  <Coffee className="h-8 w-8 mr-3" />
                  <h3 className="text-xl font-semibold">Kahve Falı</h3>
                </div>
                <p className="text-amber-100">Kahve fincanından geleceğinizi görün</p>
              </div>
            </Link>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow-sm p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Hızlı İşlemler</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <Link href="/rituals">
              <div className="border-2 border-purple-200 rounded-lg p-6 hover:border-purple-400 hover:bg-purple-50 transition-all duration-200 cursor-pointer">
                <div className="flex items-center mb-4">
                  <Crown className="h-8 w-8 text-purple-600 mr-3" />
                  <h3 className="text-xl font-semibold text-gray-900">Ritüeller</h3>
                </div>
                <p className="text-gray-600">Özel ritüeller ve büyüler</p>
              </div>
            </Link>

            <Link href="/coins">
              <div className="border-2 border-green-200 rounded-lg p-6 hover:border-green-400 hover:bg-green-50 transition-all duration-200 cursor-pointer">
                <div className="flex items-center mb-4">
                  <Coins className="h-8 w-8 text-green-600 mr-3" />
                  <h3 className="text-xl font-semibold text-gray-900">Coin Satın Al</h3>
                </div>
                <p className="text-gray-600">Daha fazla fal için coin satın alın</p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
