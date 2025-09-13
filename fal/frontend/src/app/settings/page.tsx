'use client';

import { ArrowLeft, Bell, Shield, Moon, Globe } from 'lucide-react';
import Link from 'next/link';
import Navigation from '@/components/Navigation';

export default function SettingsPage() {
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
          <h1 className="text-4xl font-bold text-white mb-4">Ayarlar</h1>
          <p className="text-gray-300 text-lg">
            Hesap ayarlarınızı yönetin ve tercihlerinizi belirleyin.
          </p>
        </div>

        <div className="space-y-6">
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 shadow-2xl">
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
              <Bell className="w-5 h-5 mr-2" />
              Bildirimler
            </h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-300">E-posta bildirimleri</span>
                <input type="checkbox" className="toggle" defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-300">Push bildirimleri</span>
                <input type="checkbox" className="toggle" />
              </div>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 shadow-2xl">
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
              <Shield className="w-5 h-5 mr-2" />
              Gizlilik
            </h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-300">Profil görünürlüğü</span>
                <select className="bg-white/20 text-white rounded-lg px-3 py-2">
                  <option>Herkese açık</option>
                  <option>Arkadaşlara açık</option>
                  <option>Gizli</option>
                </select>
              </div>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 shadow-2xl">
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
              <Moon className="w-5 h-5 mr-2" />
              Görünüm
            </h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-300">Karanlık tema</span>
                <input type="checkbox" className="toggle" defaultChecked />
              </div>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 shadow-2xl">
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
              <Globe className="w-5 h-5 mr-2" />
              Dil
            </h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-300">Dil seçimi</span>
                <select className="bg-white/20 text-white rounded-lg px-3 py-2">
                  <option>Türkçe</option>
                  <option>English</option>
                  <option>Deutsch</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
