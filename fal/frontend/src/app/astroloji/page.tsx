'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Star, 
  Moon, 
  Sun,
  Sparkles,
  ArrowRight,
  Loader2,
  CheckCircle,
  Info
} from 'lucide-react';
import Navigation from '@/components/Navigation';
import { calculateAstrology, validateBirthDate, validateBirthTime, validateBirthPlace } from '@/utils/astrologyCalculations';
import type { BirthInfo, AstrologyResult } from '@/utils/astrologyCalculations';

export default function AstrologyPage() {
  const [birthInfo, setBirthInfo] = useState<BirthInfo>({
    date: '',
    time: '',
    place: ''
  });
  const [result, setResult] = useState<AstrologyResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Partial<BirthInfo>>({});
  const [showResult, setShowResult] = useState(false);

  const handleInputChange = (field: keyof BirthInfo, value: string) => {
    setBirthInfo(prev => ({ ...prev, [field]: value }));
    // Hata mesajını temizle
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<BirthInfo> = {};

    if (!birthInfo.date) {
      newErrors.date = 'Doğum tarihi gereklidir';
    } else if (!validateBirthDate(birthInfo.date)) {
      newErrors.date = 'Geçerli bir doğum tarihi giriniz';
    }

    if (!birthInfo.time) {
      newErrors.time = 'Doğum saati gereklidir';
    } else if (!validateBirthTime(birthInfo.time)) {
      newErrors.time = 'Geçerli bir doğum saati giriniz (HH:MM)';
    }

    if (!birthInfo.place) {
      newErrors.place = 'Doğum yeri gereklidir';
    } else if (!validateBirthPlace(birthInfo.place)) {
      newErrors.place = 'En az 2 karakter giriniz';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setShowResult(false);

    // Simüle edilmiş loading süresi
    setTimeout(() => {
      const astrologyResult = calculateAstrology(birthInfo);
      
      if (astrologyResult) {
        setResult(astrologyResult);
        setShowResult(true);
      } else {
        setErrors({ date: 'Hesaplama sırasında bir hata oluştu' });
      }
      
      setLoading(false);
    }, 2000);
  };

  const resetForm = () => {
    setBirthInfo({ date: '', time: '', place: '' });
    setResult(null);
    setErrors({});
    setShowResult(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      <Navigation />
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center">
              <Moon className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Astroloji ve Yükselen Hesaplama
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Doğum bilgilerinizi girerek burcunuzu, yükselen burcunuzu ve Çin takvimine göre hayvan burcunuzu öğrenin
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Form Section */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-white rounded-2xl shadow-xl p-8"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
              <Calendar className="w-6 h-6 text-indigo-500" />
              Doğum Bilgileri
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Doğum Tarihi */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Doğum Tarihi *
                </label>
                <div className="relative">
                  <input
                    type="date"
                    value={birthInfo.date}
                    onChange={(e) => handleInputChange('date', e.target.value)}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 ${
                      errors.date ? 'border-red-500' : 'border-gray-300'
                    }`}
                    max={new Date().toISOString().split('T')[0]}
                  />
                  <Calendar className="absolute right-3 top-3.5 w-5 h-5 text-gray-400" />
                </div>
                {errors.date && (
                  <p className="mt-1 text-sm text-red-600">{errors.date}</p>
                )}
              </div>

              {/* Doğum Saati */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Doğum Saati *
                </label>
                <div className="relative">
                  <input
                    type="time"
                    value={birthInfo.time}
                    onChange={(e) => handleInputChange('time', e.target.value)}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 ${
                      errors.time ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  <Clock className="absolute right-3 top-3.5 w-5 h-5 text-gray-400" />
                </div>
                {errors.time && (
                  <p className="mt-1 text-sm text-red-600">{errors.time}</p>
                )}
              </div>

              {/* Doğum Yeri */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Doğum Yeri *
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={birthInfo.place}
                    onChange={(e) => handleInputChange('place', e.target.value)}
                    placeholder="Örn: İstanbul, Türkiye"
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 ${
                      errors.place ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  <MapPin className="absolute right-3 top-3.5 w-5 h-5 text-gray-400" />
                </div>
                {errors.place && (
                  <p className="mt-1 text-sm text-red-600">{errors.place}</p>
                )}
              </div>

              {/* Submit Button */}
              <motion.button
                type="submit"
                disabled={loading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white py-4 rounded-lg font-semibold hover:shadow-lg transform transition-all duration-200 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Hesaplanıyor...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    Burçlarımı Hesapla
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </motion.button>
            </form>

            {/* Info Box */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200"
            >
              <div className="flex items-start gap-3">
                <Info className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-blue-700">
                  <p className="font-medium mb-1">Bilgi:</p>
                  <p>Yükselen burç hesaplaması için doğum saati ve yeri önemlidir. Daha hassas sonuçlar için doğum saatinizi mümkün olduğunca doğru giriniz.</p>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Results Section */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="space-y-6"
          >
            <AnimatePresence>
              {showResult && result && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.6 }}
                  className="space-y-6"
                >
                  {/* Zodiac Sign Card */}
                  <div className="bg-white rounded-2xl shadow-xl p-6 border-l-4 border-indigo-500">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center">
                        <Star className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-900">
                          {result.zodiacSign.symbol} {result.zodiacSign.name} Burcu
                        </h3>
                        <p className="text-sm text-gray-600">
                          {result.zodiacSign.dates} • {result.zodiacSign.element} • {result.zodiacSign.quality}
                        </p>
                      </div>
                    </div>
                    <p className="text-gray-700 mb-4">{result.zodiacSign.traits.general}</p>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-semibold text-green-600 mb-2">Olumlu Yönler</h4>
                        <ul className="text-sm text-gray-600 space-y-1">
                          {result.zodiacSign.traits.positive.map((trait, index) => (
                            <li key={index} className="flex items-center gap-2">
                              <CheckCircle className="w-4 h-4 text-green-500" />
                              {trait}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold text-red-600 mb-2">Olumsuz Yönler</h4>
                        <ul className="text-sm text-gray-600 space-y-1">
                          {result.zodiacSign.traits.negative.map((trait, index) => (
                            <li key={index} className="flex items-center gap-2">
                              <div className="w-4 h-4 rounded-full bg-red-500 flex items-center justify-center">
                                <span className="text-white text-xs">×</span>
                              </div>
                              {trait}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* Rising Sign Card */}
                  <div className="bg-white rounded-2xl shadow-xl p-6 border-l-4 border-purple-500">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                        <Sun className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-900">
                          {result.risingSign.name}
                        </h3>
                        <p className="text-sm text-gray-600">Yükselen Burç</p>
                      </div>
                    </div>
                    <p className="text-gray-700 mb-4">{result.risingSign.description}</p>
                    <div>
                      <h4 className="font-semibold text-purple-600 mb-2">Kişilik Özellikleri</h4>
                      <div className="flex flex-wrap gap-2">
                        {result.risingSign.traits.map((trait, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm"
                          >
                            {trait}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Chinese Sign Card */}
                  <div className="bg-white rounded-2xl shadow-xl p-6 border-l-4 border-orange-500">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center">
                        <Moon className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-900">
                          {result.chineseSign.name} ({result.chineseSign.element})
                        </h3>
                        <p className="text-sm text-gray-600">Çin Takvimi</p>
                      </div>
                    </div>
                    <p className="text-gray-700 mb-4">{result.chineseSign.traits.general}</p>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-semibold text-green-600 mb-2">Güçlü Yönler</h4>
                        <ul className="text-sm text-gray-600 space-y-1">
                          {result.chineseSign.traits.positive.map((trait, index) => (
                            <li key={index} className="flex items-center gap-2">
                              <CheckCircle className="w-4 h-4 text-green-500" />
                              {trait}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold text-orange-600 mb-2">Şanslı Sayılar</h4>
                        <div className="flex flex-wrap gap-2">
                          {result.chineseSign.luckyNumbers.map((number, index) => (
                            <span
                              key={index}
                              className="w-8 h-8 bg-orange-100 text-orange-700 rounded-full flex items-center justify-center text-sm font-semibold"
                            >
                              {number}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Reset Button */}
                  <motion.button
                    onClick={resetForm}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full bg-gray-100 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-all duration-200"
                  >
                    Yeni Hesaplama Yap
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Placeholder when no result */}
            {!showResult && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-white rounded-2xl shadow-xl p-8 text-center"
              >
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Sparkles className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Burç Hesaplama Sonuçları
                </h3>
                <p className="text-gray-600">
                  Doğum bilgilerinizi girerek burç analizinizi görüntüleyin
                </p>
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}

