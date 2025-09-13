'use client';

import { ArrowLeft, Users, Award, Shield, Heart } from 'lucide-react';
import Link from 'next/link';
import Navigation from '@/components/Navigation';

export default function AboutPage() {
  const stats = [
    { number: '10K+', label: 'Mutlu Müşteri', icon: Users },
    { number: '50K+', label: 'Fal Baktırıldı', icon: Award },
    { number: '99%', label: 'Güvenlik', icon: Shield },
    { number: '24/7', label: 'Destek', icon: Heart }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      <Navigation />
      
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-8">
          <Link 
            href="/"
            className="inline-flex items-center space-x-2 text-white hover:text-purple-300 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Ana Sayfaya Dön</span>
          </Link>
        </div>

        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">Hakkımızda</h1>
          <p className="text-gray-300 text-lg">
            Fal Platform, modern teknoloji ile geleneksel falcılığı birleştiren yenilikçi bir platformdur.
          </p>
        </div>

        <div className="space-y-8">
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-2xl">
            <h2 className="text-2xl font-bold text-white mb-6">Misyonumuz</h2>
            <p className="text-gray-300 leading-relaxed">
              Fal Platform olarak, insanların geleceklerini keşfetmelerine yardımcı olmak için 
              modern teknoloji ve geleneksel falcılık bilgisini bir araya getiriyoruz. 
              AI destekli yorumlarımız ve uzman falcılarımızla, herkesin güvenilir ve 
              doğru fal yorumlarına erişebilmesini sağlıyoruz.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-2xl">
            <h2 className="text-2xl font-bold text-white mb-6">Vizyonumuz</h2>
            <p className="text-gray-300 leading-relaxed">
              Falcılık alanında teknoloji lideri olmak ve dünya çapında milyonlarca 
              insanın güvendiği bir platform haline gelmek. Sürekli gelişen AI 
              teknolojimiz ve uzman ekibimizle, falcılık deneyimini yeniden tanımlıyoruz.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <div key={index} className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 shadow-2xl text-center">
                <stat.icon className="w-12 h-12 text-purple-400 mx-auto mb-4" />
                <div className="text-3xl font-bold text-white mb-2">{stat.number}</div>
                <div className="text-gray-300">{stat.label}</div>
              </div>
            ))}
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-2xl">
            <h2 className="text-2xl font-bold text-white mb-6">Değerlerimiz</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-xl font-semibold text-white mb-3">Güvenilirlik</h3>
                <p className="text-gray-300">
                  Müşterilerimizin güvenini kazanmak ve korumak en önemli değerimizdir.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-white mb-3">Yenilikçilik</h3>
                <p className="text-gray-300">
                  Sürekli gelişen teknoloji ile hizmet kalitemizi artırıyoruz.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-white mb-3">Şeffaflık</h3>
                <p className="text-gray-300">
                  Tüm işlemlerimizde şeffaf ve dürüst davranıyoruz.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-white mb-3">Müşteri Odaklılık</h3>
                <p className="text-gray-300">
                  Müşteri memnuniyeti bizim için her şeyden önce gelir.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
