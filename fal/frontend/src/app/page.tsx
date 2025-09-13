'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Hand, 
  User, 
  Coffee, 
  Sparkles, 
  Star, 
  Heart, 
  Zap,
  ArrowRight,
  Camera,
  Upload,
  LogOut,
  Shield,
  MessageCircle,
  Zap as ZapIcon,
  Moon
} from 'lucide-react';
import Link from 'next/link';
import Navigation from '@/components/Navigation';
import HeroSlider from '@/components/HeroSlider';
import { useFortuneLimits } from '@/hooks/useFortuneLimits';
import { useAuth } from '@/components/AuthContext';

export default function HomePage() {
  const [selectedFortune, setSelectedFortune] = useState<string | null>(null);
  const { user, loading: authLoading } = useAuth();
  const { limits, loading: limitsLoading, hasRemainingRights } = useFortuneLimits();

  // Fallback function for when user is not logged in
  const hasRemainingRightsFallback = (type: string): boolean => {
    if (!user) return true; // Allow access when not logged in
    return hasRemainingRights(type);
  };

  const fortuneTypes = [
    {
      id: 'hand',
      title: 'El Falı',
      description: 'El çizgilerinizden geleceğinizi okuyun',
      icon: Hand,
      color: 'from-pink-500 to-rose-500',
      price: limitsLoading ? 'Yükleniyor...' : `Ücretsiz (${hasRemainingRightsFallback('HAND') ? 'Kullanılabilir' : 'Hak doldu'})`,
      href: '/fortune/hand',
      buttonText: hasRemainingRightsFallback('HAND') ? 'Fal Baktır' : 'Coin Satın Al',
      disabled: !hasRemainingRightsFallback('HAND')
    },
    {
      id: 'face',
      title: 'Yüz Falı',
      description: 'Yüz hatlarınızdan karakterinizi keşfedin',
      icon: User,
      color: 'from-blue-500 to-cyan-500',
      price: limitsLoading ? 'Yükleniyor...' : `Ücretsiz (${hasRemainingRightsFallback('FACE') ? 'Kullanılabilir' : 'Hak doldu'})`,
      href: '/fortune/face',
      buttonText: hasRemainingRightsFallback('FACE') ? 'Yüz Falı' : 'Coin Satın Al',
      disabled: !hasRemainingRightsFallback('FACE')
    },
    {
      id: 'coffee',
      title: 'Kahve Falı',
      description: 'Kahve fincanından geleceğinizi görün',
      icon: Coffee,
      color: 'from-amber-500 to-orange-500',
      price: limitsLoading ? 'Yükleniyor...' : `Ücretsiz (${hasRemainingRightsFallback('COFFEE') ? 'Kullanılabilir' : 'Hak doldu'})`,
      href: '/fortune/coffee',
      buttonText: hasRemainingRightsFallback('COFFEE') ? 'Kahve Falı' : 'Coin Satın Al',
      disabled: !hasRemainingRightsFallback('COFFEE')
    },
    {
      id: 'tarot',
      title: 'Tarot Kartları',
      description: '78 karttan 3 tanesini seçerek geleceğinizi keşfedin',
      icon: ZapIcon,
      color: 'from-purple-500 to-indigo-500',
      price: limitsLoading ? 'Yükleniyor...' : `Ücretsiz (${hasRemainingRightsFallback('TAROT') ? 'Kullanılabilir' : 'Hak doldu'})`,
      href: '/fortune/tarot',
      buttonText: hasRemainingRightsFallback('TAROT') ? 'Tarot Oku' : 'Coin Satın Al',
      disabled: !hasRemainingRightsFallback('TAROT')
    },
    {
      id: 'astrology',
      title: 'Astroloji ve Yükselen Hesaplama',
      description: 'Doğum bilgilerinizle burcunuzu ve yükselen burcunuzu hesaplayın',
      icon: Moon,
      color: 'from-indigo-500 to-purple-500',
      price: 'Ücretsiz',
      href: '/astroloji',
      buttonText: 'Hesapla',
      disabled: false
    }
  ];

  const features = [
    {
      icon: Sparkles,
      title: 'AI Destekli',
      description: 'Yapay zeka ile hassas fal yorumları'
    },
    {
      icon: Star,
      title: 'Uzman Kalitesi',
      description: 'Deneyimli falcıların yorumları'
    },
    {
      icon: Heart,
      title: 'Güvenli',
      description: 'Kişisel verileriniz güvende'
    },
    {
      icon: Zap,
      title: 'Hızlı',
      description: 'Saniyeler içinde sonuç alın'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      {/* Navigation */}
      <Navigation />

      {/* Hero Slider */}
      <HeroSlider user={user} />

      {/* Fortune Types Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Fal Türleri
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Beş farklı fal türü ile geleceğinizi keşfedin. 
              Her gün 3 ücretsiz hakkınız var!
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {fortuneTypes.map((fortune, index) => (
              <motion.div
                key={fortune.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="relative group"
              >
                <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-8 border border-gray-100">
                  <div className={`w-16 h-16 rounded-full bg-gradient-to-r ${fortune.color} flex items-center justify-center mb-6 mx-auto group-hover:scale-110 transition-transform duration-300`}>
                    <fortune.icon className="w-8 h-8 text-white" />
                  </div>
                  
                  <h3 className="text-xl font-semibold text-gray-900 mb-3 text-center">
                    {fortune.title}
                  </h3>
                  
                  <p className="text-gray-600 text-center mb-4">
                    {fortune.description}
                  </p>
                  
                  <div className="text-center space-y-2">
                    <span className="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                      {fortune.price}
                    </span>
                  </div>

                  <div className="mt-6">
                    {fortune.disabled ? (
                      <button 
                        disabled
                        className="w-full bg-gray-400 text-white py-3 rounded-lg font-semibold cursor-not-allowed flex items-center justify-center gap-2"
                      >
                        <Shield className="w-5 h-5" />
                        Hak Doldu
                      </button>
                    ) : (
                      <Link href={fortune.href}>
                        <button className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 rounded-lg font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-200 flex items-center justify-center gap-2">
                          <fortune.icon className="w-5 h-5" />
                          {fortune.buttonText}
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      </Link>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}

            {/* AI Chat Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="relative group"
            >
              <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-8 border border-gray-100">
                <div className="w-16 h-16 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 flex items-center justify-center mb-6 mx-auto group-hover:scale-110 transition-transform duration-300">
                  <MessageCircle className="w-8 h-8 text-white" />
                </div>
                
                <h3 className="text-xl font-semibold text-gray-900 mb-3 text-center">
                  AI Fal Asistanı
                </h3>
                
                <p className="text-gray-600 text-center mb-4">
                  Yapay zeka ile fal ve rüya tabiri sorularınızı yanıtlayın
                </p>
                
                <div className="text-center space-y-2">
                  <span className="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                    {limitsLoading ? 'Yükleniyor...' : `Ücretsiz (${hasRemainingRightsFallback('AI_CHAT') ? 'Kullanılabilir' : 'Hak doldu'})`}
                  </span>
                </div>

                <div className="mt-6">
                  {!hasRemainingRightsFallback('AI_CHAT') ? (
                    <button 
                      disabled
                      className="w-full bg-gray-400 text-white py-3 rounded-lg font-semibold cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      <Shield className="w-5 h-5" />
                      Hak Doldu
                    </button>
                  ) : (
                    <Link href="/ai-chat">
                      <button className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 text-white py-3 rounded-lg font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-200 flex items-center justify-center gap-2">
                        <MessageCircle className="w-5 h-5" />
                        Sohbete Başla
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </Link>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gradient-to-br from-purple-50 to-pink-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Neden Fal Platform?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Modern teknoloji ve geleneksel falcılığın mükemmel birleşimi
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section - Only show for non-logged in users */}
      {!authLoading && !user && (
        <section className="py-20 bg-gradient-to-r from-purple-600 to-pink-600">
          <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Geleceğinizi Keşfetmeye Hazır mısınız?
            </h2>
            <p className="text-xl text-purple-100 mb-8">
              Hemen ücretsiz hesap oluşturun ve ilk falınızı baktırın!
            </p>
            <Link href="/auth/register">
              <button className="bg-white text-purple-600 px-8 py-3 rounded-full font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-200">
                Ücretsiz Başla
              </button>
            </Link>
          </div>
        </section>
      )}
    </div>
  );
}
