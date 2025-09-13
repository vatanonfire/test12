'use client';

import { useState } from 'react';
import { Upload, Sparkles, Eye, Hand } from 'lucide-react';
import Link from 'next/link';

export default function HandFortune() {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [fortuneResult, setFortuneResult] = useState<string>('');
  const [imageDescription, setImageDescription] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [showLoadingMessage, setShowLoadingMessage] = useState(false);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      setImagePreview(URL.createObjectURL(file));
      setFortuneResult('');
    }
  };

  const handleSubmit = async () => {
    console.log('🖐️ Hand Fortune - Starting submission');
    setIsLoading(true);
    setShowLoadingMessage(true);
    setFortuneResult('');

    try {
      // 15-20 saniye bekleme (gerçekçi fal deneyimi için)
      console.log('🖐️ Processing fortune request...');
      const waitTime = Math.floor(Math.random() * 5000) + 15000; // 15-20 saniye arası
      console.log(`🖐️ Waiting ${waitTime/1000} seconds...`);
      await new Promise(resolve => setTimeout(resolve, waitTime));

      // Get token from localStorage
      const token = localStorage.getItem('token');
      console.log('🖐️ Token found:', !!token);
      
      if (!token) {
        console.log('🖐️ No token found, redirecting to login');
        setFortuneResult('Giriş yapmanız gerekiyor. Lütfen önce giriş yapın.');
        return;
      }

      console.log('🖐️ Sending request to API...');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/fortune/hand`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ imageDescription: imageDescription || 'El çizgileri analiz ediliyor' }),
      });

      console.log('🖐️ Response status:', response.status);
      if (response.ok) {
        const data = await response.json();
        console.log('🖐️ Fortune result received:', data.fortune?.substring(0, 100) + '...');
        setFortuneResult(data.fortune);
      } else {
        const errorData = await response.json();
        console.log('🖐️ Error response:', errorData);
        setFortuneResult('Üzgünüm, fal baktırılırken bir hata oluştu. Lütfen tekrar deneyin.');
      }
    } catch (error) {
      console.error('🖐️ Hand Fortune Error:', error);
      setFortuneResult('Üzgünüm, fal baktırılırken bir hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      console.log('🖐️ Hand Fortune - Process completed');
      setIsLoading(false);
      setShowLoadingMessage(false);
    }
  };

  const resetFortune = () => {
    setSelectedImage(null);
    setImagePreview('');
    setFortuneResult('');
    setImageDescription('');
    setShowLoadingMessage(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white">
      {/* Header */}
      <div className="bg-white/10 backdrop-blur-lg border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/" className="text-blue-300 hover:text-blue-200 transition-colors">
                ← Geri Dön
              </Link>
              <h1 className="text-2xl font-bold">El Falı</h1>
            </div>
            <div className="flex items-center space-x-2">
              <Hand className="w-6 h-6 text-green-400" />
              <span className="text-green-400 font-medium">El Falı</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!fortuneResult ? (
          <div className="space-y-8">
            {/* Image Upload Section */}
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
              <div className="text-center space-y-4">
                <div className="w-20 h-20 mx-auto bg-gradient-to-r from-green-400 to-teal-500 rounded-full flex items-center justify-center">
                  <Upload className="w-10 h-10 text-white" />
                </div>
                <h2 className="text-xl font-semibold">El Fotoğrafı</h2>
                <p className="text-gray-300">El çizgilerinizin fotoğrafını yükleyin (opsiyonel)</p>
                
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="image-upload"
                />
                <label
                  htmlFor="image-upload"
                  className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-green-500 to-teal-500 text-white rounded-lg hover:from-green-600 hover:to-teal-600 transition-all duration-200 cursor-pointer"
                >
                  <Upload className="w-5 h-5 mr-2" />
                  Fotoğraf Yükle
                </label>
              </div>

              {imagePreview && (
                <div className="mt-6 text-center">
                  <img
                    src={imagePreview}
                    alt="El fotoğrafı"
                    className="w-32 h-32 object-cover rounded-lg mx-auto border-2 border-green-400"
                  />
                </div>
              )}
            </div>

            {/* Description Input - Opsiyonel */}
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
              <h3 className="text-lg font-semibold mb-4 text-center">El Çizgilerinizi Açıklayın (Opsiyonel)</h3>
              <textarea
                value={imageDescription}
                onChange={(e) => setImageDescription(e.target.value)}
                placeholder="İsterseniz el çizgilerinizi, şekilleri ve detayları buraya yazabilirsiniz... (Boş bırakabilirsiniz)"
                className="w-full h-32 px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-gray-300 resize-none focus:outline-none focus:ring-2 focus:ring-green-400"
              />
              <p className="text-sm text-gray-400 mt-2 text-center">Bu alan opsiyoneldir. Boş bırakırsanız da fal baktırabilirsiniz.</p>
            </div>

            {/* Submit Button */}
            <div className="text-center">
              <button
                onClick={handleSubmit}
                disabled={isLoading}
                className="px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl hover:from-purple-700 hover:to-blue-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-lg font-semibold"
              >
                {isLoading ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Fal Baktırılıyor...</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <Sparkles className="w-5 h-5" />
                    <span>Falıma Baktır</span>
                  </div>
                )}
              </button>
            </div>

            {/* Loading Message */}
            {showLoadingMessage && (
              <div className="text-center space-y-4">
                <div className="w-16 h-16 mx-auto bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center animate-pulse">
                  <Eye className="w-8 h-8 text-white" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-semibold text-purple-300">Şuan Falınıza Bakılıyor...</h3>
                  <p className="text-gray-300">El çizgileriniz analiz ediliyor ve geleceğiniz okunuyor</p>
                  <div className="flex justify-center space-x-2">
                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          /* Fortune Result */
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
              <div className="text-center space-y-4">
                <div className="w-20 h-20 mx-auto bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                  <Sparkles className="w-10 h-10 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-purple-300">El Falınız Hazır!</h2>
                <div className="bg-white/20 rounded-xl p-6 text-left">
                  <p className="text-lg leading-relaxed whitespace-pre-line">{fortuneResult}</p>
                </div>
              </div>
            </div>

            <div className="text-center space-x-4">
              <button
                onClick={resetFortune}
                className="px-6 py-3 bg-gradient-to-r from-gray-600 to-gray-700 text-white rounded-lg hover:from-gray-700 hover:to-gray-800 transition-all duration-200"
              >
                Yeni Fal Baktır
              </button>
              <Link
                href="/"
                className="inline-block px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200"
              >
                Ana Sayfaya Dön
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
