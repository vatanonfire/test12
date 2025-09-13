'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { 
  User, 
  Home, 
  LogOut, 
  Menu, 
  X, 
  LogIn, 
  UserPlus,
  Hand,
  Coffee,
  Sparkles,
  Settings,
  HelpCircle,
  Info,
  ChevronDown,
  ChevronRight,
  Coins,
  CreditCard,
  Shield,
  Calendar,
  Moon
} from 'lucide-react';
import Link from 'next/link';
import { useAuth } from './AuthContext';
import NotificationBell from './NotificationBell';
import RitualCalendar from './RitualCalendar';
import MyRituals from './MyRituals';

interface MenuItem {
  title: string;
  href: string;
  icon: any;
  onClick?: () => void;
}

interface MenuCategory {
  id: string;
  title: string;
  icon: any;
  showWhenLoggedIn?: boolean;
  items: MenuItem[];
}

export default function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [isMyRitualsOpen, setIsMyRitualsOpen] = useState(false);
  const { user, logout } = useAuth();
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories(prev => 
      prev.includes(categoryId) 
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const menuCategories: MenuCategory[] = [
    {
      id: 'main',
      title: 'Ana Menü',
      icon: Home,
      items: [
        {
          title: 'Ana Sayfa',
          href: '/',
          icon: Home
        },
        {
          title: 'Ritüel Takvimi',
          href: '#',
          icon: Calendar,
          onClick: () => setIsCalendarOpen(true)
        },
        {
          title: 'Ritüellerim',
          href: '#',
          icon: Sparkles,
          onClick: () => setIsMyRitualsOpen(true)
        }
      ]
    },
    {
      id: 'fortune',
      title: 'Fal Hizmetleri',
      icon: Sparkles,
      items: [
        {
          title: 'El Falı',
          href: '/fortune/hand',
          icon: Hand
        },
        {
          title: 'Yüz Falı',
          href: '/fortune/face',
          icon: User
        },
        {
          title: 'Kahve Falı',
          href: '/fortune/coffee',
          icon: Coffee
        },
        {
          title: 'Tarot Kartları',
          href: '/fortune/tarot',
          icon: Sparkles
        }
      ]
    },
    {
      id: 'services',
      title: 'Özel Hizmetler',
      icon: Sparkles,
      items: [
        {
          title: 'Ritüeller',
          href: '/rituals',
          icon: Sparkles
        }
      ]
    },
    {
      id: 'coins',
      title: 'Coin İşlemleri',
      icon: Coins,
      showWhenLoggedIn: true,
      items: [
        {
          title: 'Coin Satın Al',
          href: '/coins',
          icon: Coins
        },
        {
          title: 'İşlem Geçmişi',
          href: '/transactions',
          icon: CreditCard
        }
      ]
    },
    {
      id: 'account',
      title: 'Hesap',
      icon: User,
      showWhenLoggedIn: true,
      items: [
        {
          title: 'Profil',
          href: '/profile',
          icon: User
        },
        {
          title: 'Ayarlar',
          href: '/settings',
          icon: Settings
        }
      ]
    },
    {
      id: 'support',
      title: 'Destek',
      icon: HelpCircle,
      items: [
        {
          title: 'Yardım',
          href: '/help',
          icon: HelpCircle
        },
        {
          title: 'Hakkında',
          href: '/about',
          icon: Info
        }
      ]
    }
  ];

  // Masaüstü için ana menü öğeleri (yatay menüde gösterilecek)
  const mainMenuItems = [
    { title: 'Ana Sayfa', href: '/', icon: Home },
    { title: 'Ritüeller', href: '/rituals', icon: Sparkles },
    { title: 'El Falı', href: '/fortune/hand', icon: Hand },
    { title: 'Yüz Falı', href: '/fortune/face', icon: User },
    { title: 'Kahve Falı', href: '/fortune/coffee', icon: Coffee },
    { title: 'Astroloji', href: '/astroloji', icon: Moon },
  ];

  const filteredCategories = menuCategories.filter(category => 
    !category.showWhenLoggedIn || (category.showWhenLoggedIn && user)
  );

  return (
    <div className="relative">
      <nav className="bg-white/10 backdrop-blur-lg border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            {/* Logo */}
            <div className="flex items-center">
              <Link href="/" className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">F</span>
                </div>
                <span className="text-white font-bold text-xl">Fal Platform</span>
              </Link>
            </div>

            {/* Desktop Navigation - Yatay Menü (lg ve üzeri) */}
            <div className="hidden lg:flex items-center space-x-1">
              {/* Ana Menü Öğeleri */}
              {mainMenuItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                    isActive(item.href)
                      ? 'bg-purple-600/20 text-purple-300 border-b-2 border-purple-400'
                      : 'text-gray-300 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <item.icon className="w-4 h-4" />
                  <span className="font-medium">{item.title}</span>
                </Link>
              ))}
            </div>

            {/* Desktop Auth Section (lg ve üzeri) */}
            <div className="hidden lg:flex items-center space-x-4">
              {user ? (
                <>
                  {/* Admin Panel Link - Sadece Admin için */}
                  {user.role === 'ADMIN' && (
                    <Link
                      href="/admin"
                      className="flex items-center space-x-2 px-3 py-2 text-purple-400 hover:text-purple-300 hover:bg-purple-500/10 rounded-lg transition-colors"
                    >
                      <Shield className="w-5 h-5" />
                      <span>Admin</span>
                    </Link>
                  )}

                  {/* Bildirim Bell */}
                  <NotificationBell />

                  <div className="flex items-center space-x-2 bg-yellow-500/20 px-3 py-2 rounded-lg">
                    <span className="text-yellow-400 font-medium">🪙</span>
                    <span className="text-white font-bold">{user.coins}</span>
                  </div>
                  <button
                    onClick={logout}
                    className="flex items-center space-x-2 px-3 py-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors"
                  >
                    <LogOut className="w-5 h-5" />
                    <span>Çıkış</span>
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/auth/login"
                    className="flex items-center space-x-2 px-3 py-2 text-blue-400 hover:text-blue-300 hover:bg-blue-500/10 rounded-lg transition-colors"
                  >
                    <LogIn className="w-5 h-5" />
                    <span>Giriş</span>
                  </Link>
                  <Link
                    href="/auth/register"
                    className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-200"
                  >
                    <UserPlus className="w-5 h-5" />
                    <span>Kayıt Ol</span>
                  </Link>
                </>
              )}
            </div>

            {/* Mobile/Tablet Auth Section (md ve altı) */}
            <div className="flex lg:hidden items-center space-x-2">
              {user && (
                <>
                  <NotificationBell />
                  <div className="flex items-center space-x-1 bg-yellow-500/20 px-2 py-1 rounded-lg">
                    <span className="text-yellow-400 font-medium text-sm">🪙</span>
                    <span className="text-white font-bold text-sm">{user.coins}</span>
                  </div>
                </>
              )}
            </div>

            {/* Hamburger Menu Button (md ve altı) */}
            <div className="flex lg:hidden items-center">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-gray-300 hover:text-white p-2 transition-colors"
                aria-label="Toggle menu"
              >
                {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile & Tablet Hamburger Menu (lg altı) */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 lg:hidden" onClick={() => setIsMenuOpen(false)}>
          <div 
            className="absolute top-16 left-0 right-0 bg-white/10 backdrop-blur-lg border-b border-white/20 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
              <div className="space-y-4">
                {/* Ana Menü Öğeleri - Mobilde de göster */}
                <div className="space-y-2">
                  <h3 className="text-white font-semibold text-sm uppercase tracking-wider mb-3">Ana Menü</h3>
                  {mainMenuItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                        isActive(item.href)
                          ? 'bg-purple-600 text-white'
                          : 'text-gray-300 hover:text-white hover:bg-white/10'
                      }`}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <item.icon className="w-4 h-4" />
                      <span>{item.title}</span>
                    </Link>
                  ))}
                </div>

                {/* Menu Categories */}
                {filteredCategories.map((category) => (
                  <div key={category.id} className="space-y-2">
                    <button
                      onClick={() => toggleCategory(category.id)}
                      className="flex items-center justify-between w-full px-3 py-2 text-white hover:bg-white/10 rounded-lg transition-colors"
                    >
                      <div className="flex items-center space-x-3">
                        <category.icon className="w-5 h-5" />
                        <span className="font-semibold">{category.title}</span>
                      </div>
                      {expandedCategories.includes(category.id) ? (
                        <ChevronDown className="w-5 h-5" />
                      ) : (
                        <ChevronRight className="w-5 h-5" />
                      )}
                    </button>
                    
                    {expandedCategories.includes(category.id) && (
                      <div className="ml-8 space-y-1">
                        {category.items.map((item) => {
                          if ('onClick' in item && item.onClick) {
                            return (
                              <button
                                key={item.href}
                                onClick={() => {
                                  item.onClick?.();
                                  setIsMenuOpen(false);
                                }}
                                className="flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors text-gray-300 hover:text-white hover:bg-white/10 w-full text-left"
                              >
                                <item.icon className="w-4 h-4" />
                                <span>{item.title}</span>
                              </button>
                            );
                          }
                          return (
                            <Link
                              key={item.href}
                              href={item.href}
                              className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                                isActive(item.href)
                                  ? 'bg-purple-600 text-white'
                                  : 'text-gray-300 hover:text-white hover:bg-white/10'
                              }`}
                              onClick={() => setIsMenuOpen(false)}
                            >
                              <item.icon className="w-4 h-4" />
                              <span>{item.title}</span>
                            </Link>
                          );
                        })}
                      </div>
                    )}
                  </div>
                ))}

                {/* User Section */}
                <div className="border-t border-white/20 pt-4">
                  {user ? (
                    <>
                      {/* Admin Panel Link - Mobilde de göster */}
                      {user.role === 'ADMIN' && (
                        <Link
                          href="/admin"
                          className="flex items-center space-x-3 px-3 py-2 text-purple-400 hover:text-purple-300 hover:bg-purple-500/10 rounded-lg transition-colors mb-2"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          <Shield className="w-5 h-5" />
                          <span>Admin Panel</span>
                        </Link>
                      )}
                      
                      <div className="flex items-center space-x-2 bg-yellow-500/20 px-3 py-2 rounded-lg mb-2">
                        <span className="text-yellow-400 font-medium">🪙</span>
                        <span className="text-white font-bold">{user.coins}</span>
                      </div>
                      <button
                        onClick={() => {
                          logout();
                          setIsMenuOpen(false);
                        }}
                        className="flex items-center space-x-3 px-3 py-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors w-full"
                      >
                        <LogOut className="w-5 h-5" />
                        <span>Çıkış Yap</span>
                      </button>
                    </>
                  ) : (
                    <div className="space-y-2">
                      <Link
                        href="/auth/login"
                        className="flex items-center space-x-3 px-3 py-2 text-blue-400 hover:text-blue-300 hover:bg-blue-500/10 rounded-lg transition-colors"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <LogIn className="w-5 h-5" />
                        <span>Giriş Yap</span>
                      </Link>
                      <Link
                        href="/auth/register"
                        className="flex items-center space-x-3 px-3 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-200"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <UserPlus className="w-5 h-5" />
                        <span>Kayıt Ol</span>
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Ritual Calendar Modal */}
      <RitualCalendar 
        isOpen={isCalendarOpen} 
        onClose={() => setIsCalendarOpen(false)} 
      />

      {/* My Rituals Modal */}
      <MyRituals 
        isOpen={isMyRitualsOpen} 
        onClose={() => setIsMyRitualsOpen(false)}
        userId={user?.id || ''}
      />
    </div>
  );
}
