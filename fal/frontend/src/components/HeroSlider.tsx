'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Sparkles, Coffee, Hand, User, ArrowRight } from 'lucide-react';
import Link from 'next/link';

interface Slide {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  buttonText: string;
  buttonHref: string;
  icon: any;
  gradient: string;
  bgPattern: string;
}

interface HeroSliderProps {
  user?: any;
}

export default function HeroSlider({ user }: HeroSliderProps) {
  const slides: Slide[] = [
    {
      id: 1,
      title: 'Yapay Zeka Destekli Fal',
      subtitle: 'Modern Teknoloji',
      description: 'Google Gemini AI ile hassas ve detaylı fal yorumları. El, yüz ve kahve falı deneyimini yeni seviyeye taşıyın.',
      buttonText: user ? 'Fal Baktır' : 'Hemen Başla',
      buttonHref: user ? '/fortune/hand' : '/auth/login',
      icon: Sparkles,
      gradient: 'from-purple-600 via-pink-600 to-rose-600',
      bgPattern: 'radial-gradient(circle at 20% 50%, rgba(120, 119, 198, 0.3) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(255, 119, 198, 0.3) 0%, transparent 50%)'
    },
    {
      id: 2,
      title: 'Kahve, El ve Yüz Falı',
      subtitle: 'Geleneksel & Modern',
      description: 'Üç farklı fal türü ile geleceğinizi keşfedin. Her gün 3 ücretsiz hakkınız var. Ritüellere katılın ve deneyiminizi zenginleştirin.',
      buttonText: user ? 'Ritüellere Katıl' : 'Ücretsiz Kayıt Ol',
      buttonHref: user ? '/rituals' : '/auth/register',
      icon: Coffee,
      gradient: 'from-amber-500 via-orange-500 to-red-500',
      bgPattern: 'radial-gradient(circle at 30% 40%, rgba(245, 158, 11, 0.3) 0%, transparent 50%), radial-gradient(circle at 70% 60%, rgba(251, 146, 60, 0.3) 0%, transparent 50%)'
    },
    {
      id: 3,
      title: 'Geleceğini Keşfet',
      subtitle: 'Hemen Başla',
      description: 'Fal platformuna katılın ve geleceğinizin sırlarını öğrenin. Ücretsiz hesap oluşturun ve ilk falınızı baktırın.',
      buttonText: user ? 'Dashboard\'a Git' : 'Ücretsiz Başla',
      buttonHref: user ? '/dashboard' : '/auth/register',
      icon: Hand,
      gradient: 'from-blue-600 via-indigo-600 to-purple-600',
      bgPattern: 'radial-gradient(circle at 40% 30%, rgba(59, 130, 246, 0.3) 0%, transparent 50%), radial-gradient(circle at 60% 70%, rgba(147, 51, 234, 0.3) 0%, transparent 50%)'
    }
  ];
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Auto-play functionality
  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowLeft') {
        prevSlide();
      } else if (event.key === 'ArrowRight') {
        nextSlide();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Initial loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
    setIsAutoPlaying(false);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    setIsAutoPlaying(false);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
    setIsAutoPlaying(false);
  };

  // Touch handlers for mobile swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) {
      nextSlide();
    } else if (isRightSwipe) {
      prevSlide();
    }
  };

  const currentSlideData = slides[currentSlide];

  return (
    <section 
      className="relative h-[600px] md:h-[700px] overflow-hidden"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Background with pattern */}
      <div 
        className="absolute inset-0 bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900"
        style={{ backgroundImage: currentSlideData.bgPattern }}
      />
      
      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white/30 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.3, 0.8, 0.3],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>
      
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/20" />

      {/* Loading Overlay */}
      {isLoading && (
        <motion.div
          initial={{ opacity: 1 }}
          animate={{ opacity: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="absolute inset-0 bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 flex items-center justify-center z-50"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5 }}
            className="text-center text-white"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="w-16 h-16 border-4 border-white/30 border-t-white rounded-full mx-auto mb-4"
            />
            <p className="text-xl font-semibold">Fal Platform</p>
            <p className="text-purple-200">Yükleniyor...</p>
          </motion.div>
        </motion.div>
      )}

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white p-3 rounded-full transition-all duration-300 group"
        aria-label="Previous slide"
      >
        <ChevronLeft className="w-6 h-6 group-hover:scale-110 transition-transform" />
      </button>

      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white p-3 rounded-full transition-all duration-300 group"
        aria-label="Next slide"
      >
        <ChevronRight className="w-6 h-6 group-hover:scale-110 transition-transform" />
      </button>

      {/* Slide Content */}
      <div className="relative z-10 h-full flex items-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0, x: 100, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: -100, scale: 0.9 }}
              transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="text-center text-white"
            >
              {/* Icon */}
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="mb-8"
              >
                <div className={`w-24 h-24 mx-auto rounded-full bg-gradient-to-r ${currentSlideData.gradient} flex items-center justify-center shadow-2xl`}>
                  <currentSlideData.icon className="w-12 h-12 text-white" />
                </div>
              </motion.div>

              {/* Subtitle */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="text-lg md:text-xl text-purple-200 mb-4 font-medium"
              >
                {currentSlideData.subtitle}
              </motion.p>

              {/* Title */}
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight"
              >
                {currentSlideData.title}
              </motion.h1>

              {/* Description */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="text-lg md:text-xl text-gray-200 mb-8 max-w-3xl mx-auto leading-relaxed"
              >
                {currentSlideData.description}
              </motion.p>

              {/* CTA Button */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
              >
                <Link href={currentSlideData.buttonHref}>
                  <button className={`inline-flex items-center gap-3 bg-gradient-to-r ${currentSlideData.gradient} text-white px-8 py-4 rounded-full font-semibold text-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300 group relative overflow-hidden`}>
                    <span className="relative z-10">{currentSlideData.buttonText}</span>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform relative z-10" />
                    <motion.div
                      className="absolute inset-0 bg-white/20"
                      initial={{ x: "-100%" }}
                      whileHover={{ x: "100%" }}
                      transition={{ duration: 0.6 }}
                    />
                  </button>
                </Link>
              </motion.div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Dot Navigation */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10">
        <div className="flex space-x-3">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentSlide
                  ? 'bg-white scale-125'
                  : 'bg-white/50 hover:bg-white/75'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="absolute bottom-0 left-0 h-2 bg-white/10 w-full">
        <motion.div
          className="h-full bg-gradient-to-r from-purple-400 via-pink-400 to-rose-400 shadow-lg"
          initial={{ width: "0%" }}
          animate={{ width: "100%" }}
          transition={{ duration: 4, ease: "linear" }}
          key={currentSlide}
        />
      </div>

      {/* Pause on hover */}
      <div
        className="absolute inset-0 z-5"
        onMouseEnter={() => setIsAutoPlaying(false)}
        onMouseLeave={() => setIsAutoPlaying(true)}
      />
    </section>
  );
}
