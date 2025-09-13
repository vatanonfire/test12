'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Sparkles, Eye, RotateCcw } from 'lucide-react';
import tarotCards from '@/data/tarotCards.json';

interface TarotCard {
  id: number;
  isim: string;
  anlam: string;
  ters: string;
}

interface SelectedCard extends TarotCard {
  isReversed: boolean;
  isSelected: boolean;
}

export default function TarotPage() {
  const [selectedCards, setSelectedCards] = useState<SelectedCard[]>([]);
  const [isReading, setIsReading] = useState(false);
  const [aiInterpretation, setAiInterpretation] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showCards, setShowCards] = useState(false);

  // 3 rastgele kart seç
  const selectRandomCards = () => {
    const shuffled = [...tarotCards].sort(() => 0.5 - Math.random());
    const threeCards = shuffled.slice(0, 3).map(card => ({
      ...card,
      isReversed: Math.random() > 0.5, // %50 ters gelme ihtimali
      isSelected: false
    }));
    setSelectedCards(threeCards);
    setShowCards(true);
    setAiInterpretation('');
  };

  // Kart seçimi
  const selectCard = (index: number) => {
    setSelectedCards(prev => 
      prev.map((card, i) => 
        i === index ? { ...card, isSelected: true } : card
      )
    );
  };

  // Tüm kartlar seçildi mi kontrol et
  useEffect(() => {
    if (selectedCards.length > 0 && selectedCards.every(card => card.isSelected)) {
      setTimeout(() => {
        generateAIInterpretation();
      }, 1000);
    }
  }, [selectedCards]);

  // AI yorumu oluştur
  const generateAIInterpretation = async () => {
    if (selectedCards.length === 0) return;

    setIsLoading(true);
    
    try {
      const selectedCardNames = selectedCards.map(card => 
        `${card.isim}${card.isReversed ? ' (Ters)' : ''}`
      ).join(', ');

      const prompt = `Kullanıcı şu kartları seçti: [${selectedCardNames}]. 
      Bu kartların anlamlarına göre kısa, samimi ve akıcı bir tarot yorumu yap. 
      Türkçe olarak yaz ve kişisel hissettir.`;

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/ai/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: prompt,
          topic: 'tarot'
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setAiInterpretation(data.response);
      } else {
        // Fallback yorum
        const fallbackInterpretation = generateFallbackInterpretation();
        setAiInterpretation(fallbackInterpretation);
      }
    } catch (error) {
      console.error('AI yorum hatası:', error);
      const fallbackInterpretation = generateFallbackInterpretation();
      setAiInterpretation(fallbackInterpretation);
    } finally {
      setIsLoading(false);
    }
  };

  // Fallback yorum oluştur
  const generateFallbackInterpretation = () => {
    const interpretations = [
      "Seçtiğin kartlar, hayatında önemli bir dönüm noktasında olduğunu gösteriyor. Bu dönemde sezgilerine güven ve iç sesini dinle.",
      "Kartların enerjisi, yakın gelecekte beklenmedik fırsatların kapını çalacağını işaret ediyor. Açık fikirli ol ve değişime direnme.",
      "Seçtiğin kartlar, iç dünyanda derin bir dönüşüm yaşadığını gösteriyor. Bu süreçte kendine karşı nazik ol ve sabırlı davran.",
      "Kartların mesajı net: Şu anda hayatında denge kurman gerekiyor. Hem mantığını hem de kalbini dinleyerek kararlar ver.",
      "Seçtiğin kartlar, uzun zamandır beklediğin bir şeyin gerçekleşmek üzere olduğunu gösteriyor. Umudunu koru ve hazır ol."
    ];
    
    return interpretations[Math.floor(Math.random() * interpretations.length)];
  };

  // Yeni okuma başlat
  const startNewReading = () => {
    setSelectedCards([]);
    setShowCards(false);
    setAiInterpretation('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              🔮 Tarot Kartları
            </h1>
            <p className="text-xl text-purple-200 max-w-2xl mx-auto">
              Ruhsal rehberliğin için 3 kart seç ve geleceğin hakkında bilgi al
            </p>
          </motion.div>
        </div>

        {/* Kart Seçimi */}
        {!showCards && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 max-w-md mx-auto">
              <div className="text-6xl mb-6">🎴</div>
              <h2 className="text-2xl font-semibold mb-4">Tarot Okuması Başlat</h2>
              <p className="text-purple-200 mb-8">
                3 kart seçerek kişisel tarot yorumunuzu alın
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={selectRandomCards}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-4 px-8 rounded-full text-lg transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                <Sparkles className="inline-block w-5 h-5 mr-2" />
                3 Kart Seç
              </motion.button>
            </div>
          </motion.div>
        )}

        {/* Seçilen Kartlar */}
        {showCards && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="mb-12"
          >
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-2">Seçilen Kartlar</h2>
              <p className="text-purple-200">Kartları tek tek seçerek açın</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              {selectedCards.map((card, index) => (
                <motion.div
                  key={card.id}
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                  className="relative"
                >
                  <div
                    onClick={() => !card.isSelected && selectCard(index)}
                    className={`cursor-pointer transition-all duration-500 ${
                      card.isSelected ? 'transform rotate-y-180' : 'hover:scale-105'
                    }`}
                  >
                    {/* Kart Arka Yüzü */}
                    {!card.isSelected && (
                      <motion.div
                        className="bg-gradient-to-br from-purple-800 to-blue-800 rounded-xl p-6 h-80 flex items-center justify-center border-2 border-purple-400 shadow-2xl"
                        whileHover={{ scale: 1.05 }}
                      >
                        <div className="text-center">
                          <div className="text-6xl mb-4">🎴</div>
                          <div className="text-2xl font-bold">Kart {index + 1}</div>
                          <div className="text-purple-200 mt-2">Seçmek için tıklayın</div>
                        </div>
                      </motion.div>
                    )}

                    {/* Kart Ön Yüzü */}
                    {card.isSelected && (
                      <motion.div
                        initial={{ rotateY: 180 }}
                        animate={{ rotateY: 0 }}
                        transition={{ duration: 0.8 }}
                        className="bg-gradient-to-br from-amber-100 to-yellow-100 text-gray-800 rounded-xl p-6 h-80 border-2 border-amber-400 shadow-2xl"
                      >
                        <div className="text-center h-full flex flex-col justify-between">
                          <div>
                            <div className="text-4xl mb-3">🎴</div>
                            <h3 className="text-xl font-bold mb-2">{card.isim}</h3>
                            <div className={`inline-block px-3 py-1 rounded-full text-sm font-medium mb-3 ${
                              card.isReversed 
                                ? 'bg-red-100 text-red-800 border border-red-300' 
                                : 'bg-green-100 text-green-800 border border-green-300'
                            }`}>
                              {card.isReversed ? 'Ters' : 'Düz'}
                            </div>
                          </div>
                          
                          <div className="text-sm">
                            <p className="font-semibold mb-2">Anlam:</p>
                            <p className="text-gray-700">{card.anlam}</p>
                            {card.isReversed && (
                              <>
                                <p className="font-semibold mt-3 mb-2">Ters Anlam:</p>
                                <p className="text-gray-700">{card.ters}</p>
                              </>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* AI Yorumu */}
        {aiInterpretation && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto"
          >
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
              <div className="text-center mb-6">
                <div className="text-4xl mb-4">✨</div>
                <h2 className="text-3xl font-bold mb-2">Tarot Yorumunuz</h2>
                <p className="text-purple-200">Seçtiğiniz kartların özel mesajı</p>
              </div>
              
              <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                <div className="flex items-start space-x-3">
                  <div className="text-2xl">🔮</div>
                  <div className="flex-1">
                    <p className="text-lg leading-relaxed text-white">
                      {aiInterpretation}
                    </p>
                  </div>
                </div>
              </div>

              <div className="text-center mt-8">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={startNewReading}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-full transition-all duration-300 inline-flex items-center"
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Yeni Okuma
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Yükleniyor */}
        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <div className="inline-flex items-center space-x-3 text-purple-200">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-400"></div>
              <span className="text-lg">Tarot yorumunuz hazırlanıyor...</span>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
