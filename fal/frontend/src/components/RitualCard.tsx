'use client';

import React, { useState } from 'react';
import { 
  Star, 
  Clock, 
  Zap, 
  Heart, 
  Shield, 
  DollarSign, 
  Sparkles,
  ChevronDown,
  ChevronUp,
  ShoppingCart,
  Info,
  CheckCircle
} from 'lucide-react';
import { Ritual } from '@/data/rituals';
import toast from 'react-hot-toast';

interface RitualCardProps {
  ritual: Ritual;
  onPurchase: (ritual: Ritual) => void;
  isPurchasing?: boolean;
  userCoins?: number;
  isPurchased?: boolean;
}

export default function RitualCard({ ritual, onPurchase, isPurchasing = false, userCoins = 0, isPurchased = false }: RitualCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

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

  const canPurchase = userCoins >= ritual.price;

  return (
    <div className="group relative">
      {/* Main Card */}
      <div className={`
        relative overflow-hidden rounded-2xl shadow-2xl transition-all duration-500 transform
        hover:scale-105 hover:shadow-3xl
        bg-gradient-to-br ${ritual.gradient}
        border border-white/20
        backdrop-blur-sm
      `}>
        {/* Animated Background */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
        </div>

        {/* Floating Particles */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-white/30 rounded-full animate-pulse"
              style={{
                left: `${20 + i * 15}%`,
                top: `${30 + (i % 3) * 20}%`,
                animationDelay: `${i * 0.5}s`,
                animationDuration: `${2 + i * 0.5}s`
              }}
            />
          ))}
        </div>

        <div className="relative p-6">
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="text-3xl">{getCategoryIcon(ritual.category)}</div>
              <div>
                <h3 className="text-xl font-bold text-white mb-1">{ritual.name}</h3>
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getDifficultyColor(ritual.difficulty)}`}>
                    {ritual.difficulty}
                  </span>
                  <span className="text-white/80 text-sm">•</span>
                  <span className="text-white/80 text-sm">{ritual.duration}</span>
                </div>
              </div>
            </div>
            
            <div className="text-right">
              <div className="text-2xl font-bold text-white mb-1">{ritual.price}</div>
              <div className="text-white/80 text-sm">Coin</div>
            </div>
          </div>

          {/* Description */}
          <p className="text-white/90 text-sm mb-4 leading-relaxed">
            {ritual.shortDescription}
          </p>

          {/* Energy & Best Time */}
          <div className="flex items-center justify-between mb-4 text-xs text-white/80">
            <div className="flex items-center space-x-1">
              <Zap className="w-3 h-3" />
              <span>{ritual.energy}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Clock className="w-3 h-3" />
              <span>{ritual.bestTime}</span>
            </div>
          </div>

          {/* Benefits */}
          <div className="mb-4">
            <div className="flex flex-wrap gap-1">
              {ritual.benefits.slice(0, 3).map((benefit, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-white/20 text-white/90 text-xs rounded-full border border-white/30"
                >
                  {benefit}
                </span>
              ))}
              {ritual.benefits.length > 3 && (
                <span className="px-2 py-1 bg-white/20 text-white/90 text-xs rounded-full border border-white/30">
                  +{ritual.benefits.length - 3} daha
                </span>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-2">
            <button
              onClick={() => setShowDetails(!showDetails)}
              className="flex-1 flex items-center justify-center space-x-2 py-2 px-4 bg-white/20 hover:bg-white/30 text-white rounded-lg transition-all duration-200 border border-white/30 hover:border-white/50"
            >
              <Info className="w-4 h-4" />
              <span className="text-sm font-medium">Detaylar</span>
            </button>
            
            {!isPurchased && (
              <button
                onClick={() => onPurchase(ritual)}
                disabled={!canPurchase || isPurchasing}
                className={`
                  flex-1 flex items-center justify-center space-x-2 py-2 px-4 rounded-lg transition-all duration-200 font-medium
                  ${canPurchase 
                    ? 'bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white shadow-lg hover:shadow-xl transform hover:scale-105' 
                    : 'bg-gray-500 text-gray-300 cursor-not-allowed'
                  }
                  ${isPurchasing ? 'opacity-50 cursor-not-allowed' : ''}
                `}
              >
                <ShoppingCart className="w-4 h-4" />
                <span className="text-sm">
                  {isPurchasing ? 'Satın Alınıyor...' : canPurchase ? 'Satın Al' : 'Yetersiz Coin'}
                </span>
              </button>
            )}
            
            {isPurchased && (
              <div className="flex-1 flex items-center justify-center space-x-2 py-2 px-4 bg-green-500/20 text-green-300 rounded-lg border border-green-500/30">
                <CheckCircle className="w-4 h-4" />
                <span className="text-sm font-medium">Satın Alındı</span>
              </div>
            )}
          </div>

          {/* Expand Button */}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="w-full mt-3 flex items-center justify-center space-x-2 py-2 text-white/80 hover:text-white transition-colors"
          >
            <span className="text-sm">Daha Fazla Bilgi</span>
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>

        {/* Expanded Content */}
        {isExpanded && (
          <div className="border-t border-white/20 bg-black/20 backdrop-blur-sm">
            <div className="p-6 space-y-4">
              {/* Full Description */}
              <div>
                <h4 className="text-white font-semibold mb-2">Açıklama</h4>
                <p className="text-white/90 text-sm leading-relaxed">{ritual.description}</p>
              </div>

              {/* Materials */}
              <div>
                <h4 className="text-white font-semibold mb-2">Gerekli Malzemeler</h4>
                <div className="grid grid-cols-2 gap-2">
                  {ritual.materials.map((material, index) => (
                    <div key={index} className="flex items-center space-x-2 text-white/80 text-sm">
                      <div className="w-1.5 h-1.5 bg-white/60 rounded-full"></div>
                      <span>{material}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Steps Preview */}
              <div>
                <h4 className="text-white font-semibold mb-2">Adımlar (Önizleme)</h4>
                <div className="space-y-1">
                  {ritual.steps.slice(0, 2).map((step, index) => (
                    <div key={index} className="flex items-start space-x-2 text-white/80 text-sm">
                      <span className="w-5 h-5 bg-white/20 rounded-full flex items-center justify-center text-xs font-bold mt-0.5">
                        {index + 1}
                      </span>
                      <span className="leading-relaxed">{step}</span>
                    </div>
                  ))}
                  {ritual.steps.length > 2 && (
                    <div className="text-white/60 text-xs italic">
                      +{ritual.steps.length - 2} adım daha...
                    </div>
                  )}
                </div>
              </div>

              {/* Special Notes */}
              <div>
                <h4 className="text-white font-semibold mb-2">Özel Notlar</h4>
                <p className="text-white/80 text-sm leading-relaxed">{ritual.specialNotes}</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Detailed Modal */}
      {showDetails && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className="text-3xl">{getCategoryIcon(ritual.category)}</div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">{ritual.name}</h2>
                    <p className="text-gray-400">{ritual.shortDescription}</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowDetails(false)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  ✕
                </button>
              </div>

              {/* Purchase Required Warning */}
              {!isPurchased && (
                <div className="mb-6 p-4 bg-yellow-500/20 border border-yellow-500/30 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="text-2xl">🔒</div>
                    <div>
                      <h3 className="text-yellow-300 font-semibold mb-1">Detaylar Kilitli</h3>
                      <p className="text-yellow-200 text-sm">
                        Bu ritüelin detaylarını görmek için satın almanız gerekiyor.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Content */}
              <div className="space-y-6">
                {/* Description - Always visible */}
                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">Açıklama</h3>
                  <p className="text-gray-300 leading-relaxed">{ritual.description}</p>
                </div>

                {/* Benefits - Always visible */}
                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">Faydalar</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {ritual.benefits.map((benefit, index) => (
                      <div key={index} className="p-2 bg-green-500/20 text-green-300 text-sm rounded-lg text-center border border-green-500/30">
                        {benefit}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Detailed content - Only for purchased rituals */}
                {isPurchased ? (
                  <>
                    {/* Materials */}
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-3">Gerekli Malzemeler</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {ritual.materials.map((material, index) => (
                          <div key={index} className="flex items-center space-x-2 text-gray-300">
                            <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                            <span>{material}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Steps */}
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-3">Adım Adım Yapılışı</h3>
                      <div className="space-y-3">
                        {ritual.steps.map((step, index) => (
                          <div key={index} className="flex items-start space-x-3 p-3 bg-gray-800/50 rounded-lg">
                            <span className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-sm font-bold text-white">
                              {index + 1}
                            </span>
                            <p className="text-gray-300 leading-relaxed">{step}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Special Notes */}
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-3">Özel Notlar</h3>
                      <p className="text-gray-300 leading-relaxed">{ritual.specialNotes}</p>
                    </div>
                  </>
                ) : (
                  /* Purchase Button for non-purchased rituals */
                  <div className="pt-4 border-t border-gray-700">
                    <button
                      onClick={() => {
                        onPurchase(ritual);
                        setShowDetails(false);
                      }}
                      disabled={!canPurchase || isPurchasing}
                      className={`
                        w-full py-3 px-6 rounded-lg font-semibold transition-all duration-200
                        ${canPurchase 
                          ? 'bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white shadow-lg hover:shadow-xl transform hover:scale-105' 
                          : 'bg-gray-500 text-gray-300 cursor-not-allowed'
                        }
                        ${isPurchasing ? 'opacity-50 cursor-not-allowed' : ''}
                      `}
                    >
                      {isPurchasing ? 'Satın Alınıyor...' : canPurchase ? `${ritual.price} Coin ile Satın Al` : 'Yetersiz Coin'}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
