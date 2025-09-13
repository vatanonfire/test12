'use client';

import React, { useState } from 'react';
import { 
  Calendar, 
  Clock, 
  CheckCircle, 
  Circle, 
  Star, 
  Zap, 
  Heart,
  Shield,
  DollarSign,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Play,
  Pause,
  RotateCcw
} from 'lucide-react';
import { Ritual } from '@/data/rituals';
import { getPurchasedRituals, PurchasedRitual } from '@/utils/ritualStorage';

interface MyRitual extends Ritual {
  purchaseDate: string;
  scheduledDate?: string;
  isCompleted: boolean;
  progress: number; // 0-100
  notes?: string;
}

interface MyRitualsProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
}

// Dummy data for purchased rituals
const myRituals: MyRitual[] = [
  {
    id: 'new-moon-ritual',
    name: 'Yeni Ay Ritüeli',
    description: 'Yeni başlangıçlar ve niyet belirleme için güçlü bir ritüel. Yeni ay enerjisi ile hayallerinizi gerçeğe dönüştürün.',
    shortDescription: 'Yeni başlangıçlar ve niyet belirleme',
    price: 150,
    category: 'moon',
    icon: '🌙',
    color: 'bg-indigo-100 text-indigo-800',
    gradient: 'from-indigo-500 to-purple-600',
    duration: '30-45 dakika',
    difficulty: 'Kolay',
    materials: ['Beyaz mum', 'Kâğıt ve kalem', 'Temiz su', 'Tuz'],
    steps: [
      'Temiz bir alan hazırlayın ve rahatsız edilmeyeceğinizden emin olun',
      'Beyaz mumu yakın ve niyetinizi kâğıda yazın',
      'Niyetinizi 3 kez yüksek sesle okuyun',
      'Kâğıdı mum alevinde yakın ve küllerini toprağa gömün',
      'Mumun tamamen yanmasını bekleyin ve teşekkür edin'
    ],
    specialNotes: 'Yeni ay gününde yapılması en etkilidir. Ayın görünür olduğu saatlerde yapın.',
    benefits: ['Yeni başlangıçlar', 'Niyet güçlendirme', 'Enerji temizliği', 'Odaklanma'],
    bestTime: 'Yeni ay günü, akşam saatleri',
    energy: 'Yenilenme ve başlangıç',
    purchaseDate: '2024-01-15',
    scheduledDate: '2024-01-20',
    isCompleted: false,
    progress: 0,
    notes: 'Yeni ay 20 Ocak\'ta. Hazırlıklar tamamlandı.'
  },
  {
    id: 'love-attraction',
    name: 'Aşk Çekme Ritüeli',
    description: 'Gerçek aşkı hayatınıza çekme ritüeli. Kalp çakrasını açın ve sevgi enerjisini yayın.',
    shortDescription: 'Gerçek aşkı hayatınıza çekme',
    price: 280,
    category: 'love',
    icon: '💕',
    color: 'bg-pink-100 text-pink-800',
    gradient: 'from-pink-500 to-rose-600',
    duration: '50-70 dakika',
    difficulty: 'Orta',
    materials: ['Pembe mum', 'Gül yaprakları', 'Rose quartz', 'Kâğıt ve kalem'],
    steps: [
      'Pembe mumu yakın ve gül yapraklarını etrafına serpin',
      'Rose quartz kristalini kalp çakranızın üzerine koyun',
      'İdeal partnerinizin özelliklerini kâğıda yazın',
      'Sevgi enerjisini kalp çakranızdan yayın',
      'Niyetinizi evrene gönderin'
    ],
    specialNotes: 'Cuma günleri yapılması en etkilidir. Kalp çakrası odaklı çalışın.',
    benefits: ['Aşk çekme', 'Kalp çakrası açma', 'Sevgi enerjisi', 'İlişki güçlendirme'],
    bestTime: 'Cuma günleri, akşam saatleri',
    energy: 'Sevgi ve çekim',
    purchaseDate: '2024-01-10',
    scheduledDate: '2024-01-26',
    isCompleted: true,
    progress: 100,
    notes: 'Ritüel başarıyla tamamlandı. Pozitif enerji hissediliyor.'
  },
  {
    id: 'protection-shield',
    name: 'Koruma Kalkanı Ritüeli',
    description: 'Negatif enerjilerden korunma ve enerji kalkanı oluşturma ritüeli. Güvenliğinizi sağlayın.',
    shortDescription: 'Negatif enerjilerden korunma ve enerji kalkanı',
    price: 200,
    category: 'protection',
    icon: '🛡️',
    color: 'bg-blue-100 text-blue-800',
    gradient: 'from-blue-500 to-indigo-600',
    duration: '40-60 dakika',
    difficulty: 'Orta',
    materials: ['Mavi mum', 'Lapis lazuli', 'Tuz', 'Sage', 'Kâğıt'],
    steps: [
      'Mavi mumu yakın ve koruma niyetinizi belirleyin',
      'Lapis lazuli kristalini tutun',
      'Çevrenizde enerji kalkanı görselleştirin',
      'Sage ile alanınızı temizleyin',
      'Koruma enerjisini içinize çekin'
    ],
    specialNotes: 'Her gün tekrarlanabilir. Güçlü niyet önemlidir.',
    benefits: ['Negatif enerji koruması', 'Enerji kalkanı', 'Güvenlik', 'Ruhsal koruma'],
    bestTime: 'Herhangi bir zaman',
    energy: 'Koruma ve güvenlik',
    purchaseDate: '2024-01-05',
    scheduledDate: '2024-01-18',
    isCompleted: false,
    progress: 60,
    notes: 'Malzemeler hazırlandı. Ritüel için uygun zaman bekleniyor.'
  }
];

export default function MyRituals({ isOpen, onClose, userId }: MyRitualsProps) {
  const [selectedRitual, setSelectedRitual] = useState<PurchasedRitual | null>(null);
  const [showCompleted, setShowCompleted] = useState(true);
  const [showPending, setShowPending] = useState(true);
  const [purchasedRituals, setPurchasedRituals] = useState<PurchasedRitual[]>([]);

  // Load purchased rituals from localStorage
  React.useEffect(() => {
    if (isOpen && userId) {
      const rituals = getPurchasedRituals(userId);
      setPurchasedRituals(rituals);
    }
  }, [isOpen, userId]);

  const completedRituals = purchasedRituals.filter(ritual => ritual.ritual.id.includes('completed'));
  const pendingRituals = purchasedRituals.filter(ritual => !ritual.ritual.id.includes('completed'));

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'moon':
        return '🌙';
      case 'sun':
        return '☀️';
      case 'shaman':
        return '🦅';
      case 'healing':
        return '💚';
      case 'love':
        return '💕';
      case 'protection':
        return '🛡️';
      case 'abundance':
        return '💰';
      case 'spiritual':
        return '✨';
      default:
        return '🔮';
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Kolay':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'Orta':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Zor':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('tr-TR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="text-3xl">🔮</div>
              <div>
                <h2 className="text-2xl font-bold">Ritüellerim</h2>
                <p className="text-purple-100">Satın aldığınız ritüeller ve ilerleme durumunuz</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:text-purple-200 transition-colors p-2 rounded-full hover:bg-white hover:bg-opacity-20"
            >
              ✕
            </button>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row h-full">
          {/* Sidebar - Ritual List */}
          <div className="lg:w-80 bg-gray-50 p-6 border-r border-gray-200 overflow-y-auto">
            {/* Filters */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-semibold text-gray-900">Filtreler</h3>
              </div>
              <div className="space-y-2">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={showPending}
                    onChange={(e) => setShowPending(e.target.checked)}
                    className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                  />
                  <span className="text-sm text-gray-700">Bekleyen Ritüeller ({pendingRituals.length})</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={showCompleted}
                    onChange={(e) => setShowCompleted(e.target.checked)}
                    className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                  />
                  <span className="text-sm text-gray-700">Tamamlanan Ritüeller ({completedRituals.length})</span>
                </label>
              </div>
            </div>

            {/* Ritual List */}
            <div className="space-y-3">
              {purchasedRituals.length === 0 ? (
                <div className="text-center py-8">
                  <div className="text-4xl mb-3">🔮</div>
                  <p className="text-gray-500 text-sm">Henüz satın alınmış ritüel yok</p>
                  <p className="text-gray-400 text-xs mt-1">Ritüeller sayfasından satın alabilirsiniz</p>
                </div>
              ) : (
                <>
                  {/* Pending Rituals */}
                  {showPending && pendingRituals.map((purchasedRitual) => (
                    <div
                      key={purchasedRitual.id}
                      onClick={() => setSelectedRitual(purchasedRitual)}
                      className={`p-3 rounded-lg border-2 cursor-pointer transition-all ${
                        selectedRitual?.id === purchasedRitual.id
                          ? 'border-purple-500 bg-purple-50'
                          : 'border-gray-200 hover:border-gray-300 bg-white'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <div className="text-2xl">{getCategoryIcon(purchasedRitual.ritual.category)}</div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-gray-900 truncate">{purchasedRitual.ritual.name}</h4>
                          <p className="text-sm text-gray-500">Satın Alındı: {formatDate(purchasedRitual.purchaseDate)}</p>
                          <div className="flex items-center space-x-2 mt-1">
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div className="bg-purple-600 h-2 rounded-full w-1/3"></div>
                            </div>
                            <span className="text-xs text-gray-500">Bekliyor</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* Completed Rituals */}
                  {showCompleted && completedRituals.map((purchasedRitual) => (
                    <div
                      key={purchasedRitual.id}
                      onClick={() => setSelectedRitual(purchasedRitual)}
                      className={`p-3 rounded-lg border-2 cursor-pointer transition-all ${
                        selectedRitual?.id === purchasedRitual.id
                          ? 'border-green-500 bg-green-50'
                          : 'border-green-200 hover:border-green-300 bg-white'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <div className="text-2xl">{getCategoryIcon(purchasedRitual.ritual.category)}</div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2">
                            <h4 className="font-medium text-gray-900 truncate">{purchasedRitual.ritual.name}</h4>
                            <CheckCircle className="w-4 h-4 text-green-500" />
                          </div>
                          <p className="text-sm text-gray-500">Satın Alındı: {formatDate(purchasedRitual.purchaseDate)}</p>
                          <div className="flex items-center space-x-2 mt-1">
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div className="bg-green-500 h-2 rounded-full w-full"></div>
                            </div>
                            <span className="text-xs text-gray-500">Tamamlandı</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </>
              )}
            </div>
          </div>

          {/* Main Content - Ritual Details */}
          <div className="flex-1 p-6 overflow-y-auto">
            {selectedRitual ? (
              <div className="space-y-6">
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="text-4xl">{getCategoryIcon(selectedRitual.ritual.category)}</div>
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900">{selectedRitual.ritual.name}</h3>
                      <p className="text-gray-600">{selectedRitual.ritual.shortDescription}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`px-3 py-1 rounded-full text-sm font-medium border ${getDifficultyColor(selectedRitual.ritual.difficulty)}`}>
                      {selectedRitual.ritual.difficulty}
                    </div>
                  </div>
                </div>

                {/* Status */}
                <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-4 border border-purple-200">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-gray-900">Durum</h4>
                    <div className="flex items-center space-x-2">
                      <Circle className="w-5 h-5 text-gray-400" />
                      <span className="font-medium text-gray-600">Bekliyor</span>
                    </div>
                  </div>
                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex justify-between">
                      <span>Satın Alma Tarihi:</span>
                      <span>{formatDate(selectedRitual.purchaseDate)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Fiyat:</span>
                      <span>{selectedRitual.ritual.price} Coin</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Süre:</span>
                      <span>{selectedRitual.ritual.duration}</span>
                    </div>
                  </div>
                  <div className="mt-3">
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div className="bg-purple-600 h-3 rounded-full w-1/3"></div>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Açıklama</h4>
                  <p className="text-gray-600 leading-relaxed">{selectedRitual.ritual.description}</p>
                </div>

                {/* Materials */}
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Gerekli Malzemeler</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {selectedRitual.ritual.materials.map((material, index) => (
                      <div key={index} className="flex items-center space-x-2 text-gray-600">
                        <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                        <span className="text-sm">{material}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Steps */}
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Adım Adım Yapılışı</h4>
                  <div className="space-y-3">
                    {selectedRitual.ritual.steps.map((step, index) => (
                      <div key={index} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                        <span className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center text-sm font-bold text-white">
                          {index + 1}
                        </span>
                        <p className="text-gray-700 leading-relaxed">{step}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Special Notes */}
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Özel Notlar</h4>
                  <p className="text-gray-600 leading-relaxed">{selectedRitual.ritual.specialNotes}</p>
                </div>

                {/* Benefits */}
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Faydalar</h4>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {selectedRitual.ritual.benefits.map((benefit, index) => (
                      <div key={index} className="p-2 bg-green-50 text-green-700 text-sm rounded-lg text-center border border-green-200">
                        {benefit}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex space-x-3 pt-4 border-t border-gray-200">
                  <button className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white py-2 px-4 rounded-lg font-medium hover:shadow-lg transition-all duration-200 flex items-center justify-center space-x-2">
                    <Play className="w-4 h-4" />
                    <span>Ritüeli Başlat</span>
                  </button>
                  <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                    <RotateCcw className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <div className="text-6xl mb-4">🔮</div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Ritüel Seçin</h3>
                  <p className="text-gray-600">Detaylarını görmek için soldan bir ritüel seçin.</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
