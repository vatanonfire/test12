'use client';

import { useState, useEffect } from 'react';
import { ArrowLeft, ShoppingCart, CreditCard, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import Navigation from '@/components/Navigation';
import { useAuth } from '@/components/AuthContext';
import toast from 'react-hot-toast';

interface CoinPackage {
  id: string;
  name: string;
  coins: number;
  price: number; // in cents
  description?: string;
  discount?: number;
  isActive: boolean;
}

export default function CoinsPage() {
  const { user } = useAuth();
  const [packages, setPackages] = useState<CoinPackage[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPackage, setSelectedPackage] = useState<CoinPackage | null>(null);
  const [showPayment, setShowPayment] = useState(false);

  useEffect(() => {
    fetchCoinPackages();
  }, []);

  const fetchCoinPackages = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/coins/packages`);
      const data = await response.json();
      
      console.log('API Response:', data); // Debug için
      
      if (data.success) {
        console.log('Packages:', data.data.packages); // Debug için
        setPackages(data.data.packages);
      } else {
        toast.error('Coin paketleri yüklenemedi');
      }
    } catch (error) {
      console.error('Error fetching packages:', error);
      toast.error('Coin paketleri yüklenemedi');
    } finally {
      setLoading(false);
    }
  };

  const handlePackageSelect = (pkg: CoinPackage) => {
    setSelectedPackage(pkg);
    setShowPayment(true);
  };

  const formatPrice = (priceInCents: number) => {
    return (priceInCents / 100).toFixed(2);
  };

  const calculateDiscountedPrice = (price: number, discount: number) => {
    return price * (1 - discount / 100);
  };

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
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-8">
        <div className="mb-4 sm:mb-8">
          <Link 
            href="/"
            className="inline-flex items-center space-x-2 text-white hover:text-purple-300 transition-colors text-sm sm:text-base"
          >
            <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="hidden sm:inline">Ana Sayfaya Dön</span>
            <span className="sm:hidden">Geri</span>
          </Link>
        </div>

        <div className="text-center mb-8 sm:mb-12">
          <h1 className="text-2xl sm:text-4xl font-bold text-white mb-2 sm:mb-4">Coin Satın Al</h1>
          <p className="text-gray-300 text-sm sm:text-lg px-4">
            Fal baktırmak ve ritüeller için coin satın alın
          </p>
          
          {user && (
            <div className="mt-6 inline-flex items-center space-x-2 bg-yellow-500/20 px-4 py-2 rounded-lg">
              <span className="text-yellow-400 font-medium">🪙</span>
              <span className="text-white font-bold">Mevcut Bakiye: {user.coins} Coin</span>
            </div>
          )}
        </div>

        {!showPayment ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {packages.map((pkg) => (
              <div
                key={pkg.id}
                className="bg-white/10 backdrop-blur-lg rounded-2xl p-4 sm:p-6 shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105"
              >
                {pkg.discount && pkg.discount > 0 && (
                  <div className="absolute -top-2 -right-2 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                    %{pkg.discount} İndirim
                  </div>
                )}
                
                <div className="text-center">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                    <span className="text-white font-bold text-lg sm:text-xl">🪙</span>
                  </div>
                  
                  <h3 className="text-lg sm:text-xl font-semibold text-white mb-2">
                    {pkg.name}
                  </h3>
                  
                  <div className="mb-3 sm:mb-4">
                    <span className="text-2xl sm:text-3xl font-bold text-yellow-400">
                      {pkg.coins}
                    </span>
                    <span className="text-gray-300 ml-2 text-sm sm:text-base">Coin</span>
                  </div>
                  
                  <div className="mb-4 sm:mb-6">
                    {pkg.discount && pkg.discount > 0 ? (
                      <div>
                        <span className="text-gray-400 line-through text-base sm:text-lg">
                          {formatPrice(pkg.price)} TL
                        </span>
                        <div className="text-xl sm:text-2xl font-bold text-white">
                          {formatPrice(calculateDiscountedPrice(pkg.price, pkg.discount))} TL
                        </div>
                      </div>
                    ) : (
                      <div className="text-xl sm:text-2xl font-bold text-white">
                        {formatPrice(pkg.price)} TL
                      </div>
                    )}
                  </div>
                  
                  {pkg.description && (
                    <p className="text-gray-300 text-xs sm:text-sm mb-4 sm:mb-6 px-2">
                      {pkg.description}
                    </p>
                  )}
                  
                  <button
                    onClick={() => handlePackageSelect(pkg)}
                    className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-2 sm:py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-blue-700 transition-all duration-200 flex items-center justify-center space-x-2 text-sm sm:text-base"
                  >
                    <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span>Satın Al</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <PaymentForm 
            selectedPackage={selectedPackage!}
            onBack={() => setShowPayment(false)}
            onSuccess={() => {
              setShowPayment(false);
              setSelectedPackage(null);
              toast.success('Coin satın alma işlemi başarılı!');
            }}
          />
        )}
      </div>
    </div>
  );
}

interface PaymentFormProps {
  selectedPackage: CoinPackage;
  onBack: () => void;
  onSuccess: () => void;
}

function PaymentForm({ selectedPackage, onBack, onSuccess }: PaymentFormProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    cardNumber: '',
    cardName: '',
    expiryMonth: '',
    expiryYear: '',
    cvv: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Here you would integrate with Iyzico or Stripe
      // For now, we'll simulate a successful payment
      
      // Add coins to user
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/coins/user/add-coins`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          transactionId: selectedPackage.id,
          coins: selectedPackage.coins,
          amount: selectedPackage.price,
          paymentId: `payment_${Date.now()}`
        })
      });

      if (response.ok) {
        onSuccess();
      } else {
        toast.error('Ödeme işlemi başarısız oldu');
      }
    } catch (error) {
      console.error('Payment error:', error);
      toast.error('Ödeme işlemi başarısız oldu');
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (priceInCents: number) => {
    return (priceInCents / 100).toFixed(2);
  };

  return (
    <div className="max-w-md mx-auto">
      <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-2xl">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-white mb-2">Ödeme</h2>
          <p className="text-gray-300">Kart bilgilerinizi girin</p>
        </div>

        <div className="mb-6 p-4 bg-white/5 rounded-lg">
          <div className="flex justify-between items-center">
            <span className="text-gray-300">Seçilen Paket:</span>
            <span className="text-white font-semibold">{selectedPackage.name}</span>
          </div>
          <div className="flex justify-between items-center mt-2">
            <span className="text-gray-300">Tutar:</span>
            <span className="text-yellow-400 font-bold text-lg">
              {formatPrice(selectedPackage.price)} TL
            </span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-300 text-sm font-medium mb-2">
              Kart Numarası
            </label>
            <input
              type="text"
              value={formData.cardNumber}
              onChange={(e) => setFormData({...formData, cardNumber: e.target.value})}
              className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
              placeholder="1234 5678 9012 3456"
              required
            />
          </div>

          <div>
            <label className="block text-gray-300 text-sm font-medium mb-2">
              Kart Sahibinin Adı
            </label>
            <input
              type="text"
              value={formData.cardName}
              onChange={(e) => setFormData({...formData, cardName: e.target.value})}
              className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
              placeholder="Ad Soyad"
              required
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-gray-300 text-sm font-medium mb-2">
                Ay
              </label>
              <input
                type="text"
                value={formData.expiryMonth}
                onChange={(e) => setFormData({...formData, expiryMonth: e.target.value})}
                className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
                placeholder="MM"
                required
              />
            </div>
            <div>
              <label className="block text-gray-300 text-sm font-medium mb-2">
                Yıl
              </label>
              <input
                type="text"
                value={formData.expiryYear}
                onChange={(e) => setFormData({...formData, expiryYear: e.target.value})}
                className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
                placeholder="YY"
                required
              />
            </div>
            <div>
              <label className="block text-gray-300 text-sm font-medium mb-2">
                CVV
              </label>
              <input
                type="text"
                value={formData.cvv}
                onChange={(e) => setFormData({...formData, cvv: e.target.value})}
                className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
                placeholder="123"
                required
              />
            </div>
          </div>

          <div className="flex space-x-4 pt-4">
            <button
              type="button"
              onClick={onBack}
              className="flex-1 px-4 py-3 border border-gray-400 text-white rounded-lg hover:bg-white/10 transition-colors"
            >
              Geri
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-200 disabled:opacity-50 flex items-center justify-center space-x-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>İşleniyor...</span>
                </>
              ) : (
                <>
                  <CreditCard className="w-5 h-5" />
                  <span>Ödemeyi Tamamla</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
