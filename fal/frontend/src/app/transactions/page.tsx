'use client';

import { useState, useEffect } from 'react';
import { ArrowLeft, Calendar, CreditCard, CheckCircle, XCircle, Clock } from 'lucide-react';
import Link from 'next/link';
import Navigation from '@/components/Navigation';
import { useAuth } from '@/components/AuthContext';
import toast from 'react-hot-toast';

interface Transaction {
  id: string;
  amount: number;
  coins: number;
  paymentMethod: 'IYZICO' | 'STRIPE';
  status: 'PENDING' | 'COMPLETED' | 'FAILED' | 'REFUNDED';
  transactionDate: string;
  description?: string;
  coinPackage: {
    name: string;
    coins: number;
  };
}

export default function TransactionsPage() {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchTransactions();
  }, [page]);

  const fetchTransactions = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/coins/user/transactions?page=${page}&limit=10`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      const data = await response.json();
      
      if (data.success) {
        setTransactions(data.data.transactions);
        setTotalPages(data.data.pagination.pages);
      } else {
        toast.error('İşlem geçmişi yüklenemedi');
      }
    } catch (error) {
      console.error('Error fetching transactions:', error);
      toast.error('İşlem geçmişi yüklenemedi');
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'FAILED':
        return <XCircle className="w-5 h-5 text-red-500" />;
      case 'PENDING':
        return <Clock className="w-5 h-5 text-yellow-500" />;
      default:
        return <Clock className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return 'Tamamlandı';
      case 'FAILED':
        return 'Başarısız';
      case 'PENDING':
        return 'Beklemede';
      case 'REFUNDED':
        return 'İade Edildi';
      default:
        return status;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return 'text-green-400';
      case 'FAILED':
        return 'text-red-400';
      case 'PENDING':
        return 'text-yellow-400';
      case 'REFUNDED':
        return 'text-blue-400';
      default:
        return 'text-gray-400';
    }
  };

  const formatPrice = (priceInCents: number) => {
    return (priceInCents / 100).toFixed(2);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
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
      
      <div className="max-w-6xl mx-auto px-4 py-8">
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
          <h1 className="text-4xl font-bold text-white mb-4">İşlem Geçmişi</h1>
          <p className="text-gray-300 text-lg">
            Coin satın alma işlemlerinizin geçmişi
          </p>
          
          {user && (
            <div className="mt-6 inline-flex items-center space-x-2 bg-yellow-500/20 px-4 py-2 rounded-lg">
              <span className="text-yellow-400 font-medium">🪙</span>
              <span className="text-white font-bold">Mevcut Bakiye: {user.coins} Coin</span>
            </div>
          )}
        </div>

        {transactions.length === 0 ? (
          <div className="text-center">
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-12 shadow-2xl">
              <CreditCard className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">Henüz İşlem Yok</h3>
              <p className="text-gray-300 mb-6">
                Henüz coin satın alma işlemi yapmadınız.
              </p>
              <Link
                href="/coins"
                className="inline-flex items-center space-x-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-200"
              >
                <span>Coin Satın Al</span>
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {transactions.map((transaction) => (
              <div
                key={transaction.id}
                className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 shadow-2xl"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold">🪙</span>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-semibold text-white">
                        {transaction.coinPackage.name}
                      </h3>
                      <p className="text-gray-300 text-sm">
                        {transaction.coins} Coin
                      </p>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="text-xl font-bold text-white">
                      {formatPrice(transaction.amount)} TL
                    </div>
                    <div className="flex items-center space-x-2 mt-1">
                      {getStatusIcon(transaction.status)}
                      <span className={`text-sm font-medium ${getStatusColor(transaction.status)}`}>
                        {getStatusText(transaction.status)}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="mt-4 pt-4 border-t border-white/10">
                  <div className="flex items-center justify-between text-sm text-gray-300">
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4" />
                      <span>{formatDate(transaction.transactionDate)}</span>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <CreditCard className="w-4 h-4" />
                      <span>{transaction.paymentMethod}</span>
                    </div>
                  </div>
                  
                  {transaction.description && (
                    <p className="text-gray-400 text-sm mt-2">
                      {transaction.description}
                    </p>
                  )}
                </div>
              </div>
            ))}
            
            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center space-x-2 mt-8">
                <button
                  onClick={() => setPage(page - 1)}
                  disabled={page === 1}
                  className="px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Önceki
                </button>
                
                <span className="px-4 py-2 text-white">
                  Sayfa {page} / {totalPages}
                </span>
                
                <button
                  onClick={() => setPage(page + 1)}
                  disabled={page === totalPages}
                  className="px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Sonraki
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
