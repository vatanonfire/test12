'use client';

import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  Filter, 
  Search, 
  Star, 
  Sparkles,
  Moon,
  Sun,
  Heart,
  Shield,
  DollarSign,
  Zap,
  Leaf
} from 'lucide-react';
import Link from 'next/link';
import Navigation from '@/components/Navigation';
import RitualCard from '@/components/RitualCard';
import { useAuth } from '@/components/AuthContext';
import { rituals, ritualCategories, Ritual } from '@/data/rituals';
import { getPurchasedRituals, addPurchasedRitual, isRitualPurchased } from '@/utils/ritualStorage';
import toast from 'react-hot-toast';

export default function RitualsPage() {
  const { user, updateUser, logout } = useAuth();
  const [filteredRituals, setFilteredRituals] = useState<Ritual[]>(rituals);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [purchasing, setPurchasing] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  // Fetch rituals from backend
  const fetchRituals = async () => {
    if (!user) return;
    
    console.log('🔄 Fetching rituals from backend...');
    setIsLoading(true);
    setError(null);
    
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.log('❌ No token found, redirecting to login');
        logout();
        return;
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/rituals?type=available`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      
      console.log('📡 Rituals response:', { status: response.status, data });

      if (!response.ok) {
        if (response.status === 401) {
          console.log('🔐 Token expired, redirecting to login');
          logout();
          return;
        }
        throw new Error(data.message || 'Ritüeller yüklenemedi');
      }

      if (data.success) {
        console.log('✅ Rituals loaded successfully:', data.data?.length || 0, 'items');
        // Backend'den gelen ritüelleri kullan, yoksa dummy data'yı kullan
        const backendRituals = data.data || [];
        setFilteredRituals(backendRituals.length > 0 ? backendRituals : rituals);
        setError(null);
      } else {
        throw new Error(data.message || 'Ritüeller yüklenemedi');
      }
    } catch (error) {
      console.error('💥 Error fetching rituals:', error);
      setError(error instanceof Error ? error.message : 'Ritüeller yüklenirken hata oluştu');
      // Hata durumunda dummy data'yı kullan
      setFilteredRituals(rituals);
    } finally {
      setIsLoading(false);
    }
  };

  // Load rituals on component mount
  useEffect(() => {
    if (user) {
      fetchRituals();
    }
  }, [user, retryCount]);

  // Filter rituals based on category and search term
  useEffect(() => {
    let filtered = filteredRituals;

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(ritual => ritual.category === selectedCategory);
    }

    if (searchTerm) {
      filtered = filtered.filter(ritual => 
        ritual.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ritual.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ritual.shortDescription.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredRituals(filtered);
  }, [selectedCategory, searchTerm]);

  // Retry function
  const handleRetry = () => {
    console.log('🔄 Retry button clicked, attempt:', retryCount + 1);
    setRetryCount(prev => prev + 1);
  };

  const handlePurchase = async (ritual: Ritual) => {
    if (!user) {
      toast.error('Ritüel satın almak için giriş yapmalısınız');
      return;
    }

    if (user.coins < ritual.price) {
      toast.error(`Yeterli coin yok. Gerekli: ${ritual.price} coin, Mevcut: ${user.coins} coin`);
      return;
    }

    setPurchasing(ritual.id);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Add to localStorage
      addPurchasedRitual(user.id, ritual);
      
      // Update user coins
      const newCoins = user.coins - ritual.price;
      updateUser({ coins: newCoins });
      
      toast.success(`${ritual.name} başarıyla satın alındı! Ritüellerim bölümünden erişebilirsiniz.`);
      
    } catch (error) {
      console.error('Purchase error:', error);
      toast.error('Ritüel satın alma sırasında hata oluştu');
    } finally {
      setPurchasing(null);
    }
  };

  const getCategoryIcon = (categoryId: string) => {
    const category = ritualCategories.find(cat => cat.id === categoryId);
    return category ? category.icon : '🔮';
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900"></div>
          <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%239C92AC%22%20fill-opacity%3D%220.1%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%222%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-20"></div>
        </div>

        <Navigation />
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 py-8">
          <div className="mb-8">
            <Link 
              href="/"
              className="inline-flex items-center space-x-2 text-white hover:text-purple-300 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Ana Sayfaya Dön</span>
            </Link>
          </div>
          
          <div className="text-center py-16">
            <div className="mb-8">
              <div className="text-6xl mb-4">✨</div>
              <h1 className="text-5xl font-bold text-white mb-4 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Ritüeller
              </h1>
              <p className="text-gray-300 text-xl max-w-2xl mx-auto leading-relaxed">
                Hayatınızı değiştirecek kadim ritüeller, size özel hazırlanır.
              </p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 max-w-md mx-auto border border-white/20">
              <h2 className="text-2xl font-bold text-white mb-4">🔐 Giriş Gerekli</h2>
              <p className="text-gray-300 mb-6">
                Ritüelleri görüntülemek ve satın almak için lütfen giriş yapın.
              </p>
              <Link href="/auth/login">
                <button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-3 rounded-full font-semibold hover:from-purple-700 hover:to-pink-700 transition-all duration-200 transform hover:scale-105 shadow-lg">
                  Giriş Yap
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900"></div>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%239C92AC%22%20fill-opacity%3D%220.1%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%222%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-20"></div>
        
        {/* Floating Stars */}
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white/30 rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 2}s`
            }}
          />
        ))}
      </div>

      <Navigation />
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 py-8">
        {/* Back Button */}
        <div className="mb-8">
          <Link 
            href="/"
            className="inline-flex items-center space-x-2 text-white hover:text-purple-300 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Ana Sayfaya Dön</span>
          </Link>
        </div>

        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="mb-8">
            <div className="text-6xl mb-4 animate-pulse">✨</div>
            <h1 className="text-5xl font-bold text-white mb-4 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Ritüeller
            </h1>
            <p className="text-gray-300 text-xl max-w-2xl mx-auto leading-relaxed">
              Hayatınızı değiştirecek kadim ritüeller, size özel hazırlanır.
            </p>
          </div>
          
          {/* User Balance */}
          <div className="inline-flex items-center space-x-2 bg-yellow-500/20 px-6 py-3 rounded-full border border-yellow-500/30">
            <span className="text-yellow-400 font-medium text-2xl">🪙</span>
            <span className="text-white font-bold text-lg">Mevcut Bakiye: {user.coins} Coin</span>
          </div>
        </div>

        {/* Filters */}
        {!isLoading && !error && (
          <div className="mb-8">
            <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
              {/* Search */}
              <div className="relative w-full lg:w-96">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Ritüel ara..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                />
              </div>

              {/* Filter Toggle */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center space-x-2 px-4 py-3 bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl text-white hover:bg-white/20 transition-all"
              >
                <Filter className="w-5 h-5" />
                <span>Kategoriler</span>
              </button>
            </div>

            {/* Category Filters */}
            {showFilters && (
              <div className="mt-4 p-4 bg-white/10 backdrop-blur-lg rounded-xl border border-white/20">
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setSelectedCategory('all')}
                    className={`px-4 py-2 rounded-lg transition-all ${
                      selectedCategory === 'all'
                        ? 'bg-purple-600 text-white shadow-lg'
                        : 'bg-white/20 text-white hover:bg-white/30'
                    }`}
                  >
                    Tümü
                  </button>
                  {ritualCategories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id)}
                      className={`px-4 py-2 rounded-lg transition-all flex items-center space-x-2 ${
                        selectedCategory === category.id
                          ? 'bg-purple-600 text-white shadow-lg'
                          : 'bg-white/20 text-white hover:bg-white/30'
                      }`}
                    >
                      <span>{category.icon}</span>
                      <span>{category.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4 animate-spin">⏳</div>
            <h3 className="text-2xl font-bold text-white mb-4">Ritüeller Yükleniyor...</h3>
            <p className="text-gray-300">Lütfen bekleyin, ritüelleriniz getiriliyor.</p>
          </div>
        )}

        {/* Error State */}
        {error && !isLoading && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">⚠️</div>
            <h3 className="text-2xl font-bold text-white mb-4">Ritüeller Yüklenemedi</h3>
            <p className="text-gray-300 mb-6 max-w-md mx-auto">
              {error}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={handleRetry}
                className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-full font-semibold hover:from-purple-700 hover:to-pink-700 transition-all duration-200 transform hover:scale-105"
              >
                🔄 Tekrar Dene
              </button>
              <Link href="/auth/login">
                <button className="bg-white/10 text-white px-6 py-3 rounded-full font-semibold hover:bg-white/20 transition-all duration-200 border border-white/20">
                  🔐 Giriş Yap
                </button>
              </Link>
            </div>
            <p className="text-gray-400 text-sm mt-4">
              Deneme sayısı: {retryCount}
            </p>
          </div>
        )}

        {/* Results Count */}
        {!isLoading && !error && (
          <div className="mb-6">
            <p className="text-white/80">
              {filteredRituals.length} ritüel bulundu
              {selectedCategory !== 'all' && (
                <span className="ml-2">
                  • {ritualCategories.find(cat => cat.id === selectedCategory)?.name}
                </span>
              )}
            </p>
          </div>
        )}

        {/* Rituals Grid */}
        {!isLoading && !error && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {filteredRituals.map((ritual) => (
              <RitualCard
                key={ritual.id}
                ritual={ritual}
                onPurchase={handlePurchase}
                isPurchasing={purchasing === ritual.id}
                userCoins={user.coins}
                isPurchased={isRitualPurchased(user.id, ritual.id)}
              />
            ))}
          </div>
        )}

        {/* No Results */}
        {!isLoading && !error && filteredRituals.length === 0 && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-2xl font-bold text-white mb-4">Ritüel Bulunamadı</h3>
            <p className="text-gray-300 mb-6">
              Aradığınız kriterlere uygun ritüel bulunamadı. Farklı arama terimleri deneyin.
            </p>
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('all');
              }}
              className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-full font-semibold hover:from-purple-700 hover:to-pink-700 transition-all duration-200"
            >
              Filtreleri Temizle
            </button>
          </div>
        )}

        {/* Special Offer */}
        <div className="mt-12">
          <div className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 backdrop-blur-lg rounded-2xl p-8 border border-white/20 text-center">
            <div className="text-4xl mb-4">🎁</div>
            <h2 className="text-2xl font-bold text-white mb-4">Özel Ritüel Paketi</h2>
            <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
              Size özel ritüel hazırlamak ister misiniz? Uzman falcılarımız sizin ihtiyaçlarınıza göre 
              özel ritüel hazırlar ve kişisel rehberlik sağlar.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-3 rounded-full font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-200">
                Özel Ritüel Talep Et
              </button>
              <button className="bg-white/10 text-white px-8 py-3 rounded-full font-semibold hover:bg-white/20 transition-all duration-200 border border-white/20">
                Uzmanlarla İletişim
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}