'use client';

import { ArrowLeft, HelpCircle, MessageCircle, Mail, Phone } from 'lucide-react';
import Link from 'next/link';
import Navigation from '@/components/Navigation';

export default function HelpPage() {
  const faqs = [
    {
      question: 'Fal nasıl baktırılır?',
      answer: 'Fal türünü seçin, fotoğrafınızı yükleyin ve AI destekli yorumunuzu alın.'
    },
    {
      question: 'Koin nasıl kazanılır?',
      answer: 'Günlük giriş yaparak, fal baktırarak ve arkadaşlarınızı davet ederek koin kazanabilirsiniz.'
    },
    {
      question: 'Ritüel nasıl satın alınır?',
      answer: 'Ritüeller sayfasından istediğiniz ritüeli seçin ve koin ile satın alın.'
    },
    {
      question: 'Hesabımı nasıl silerim?',
      answer: 'Ayarlar sayfasından hesap silme işlemini gerçekleştirebilirsiniz.'
    }
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
          <h1 className="text-4xl font-bold text-white mb-4">Yardım</h1>
          <p className="text-gray-300 text-lg">
            Sık sorulan sorular ve destek kanalları.
          </p>
        </div>

        <div className="space-y-6">
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 shadow-2xl">
            <h2 className="text-xl font-semibold text-white mb-6 flex items-center">
              <HelpCircle className="w-5 h-5 mr-2" />
              Sık Sorulan Sorular
            </h2>
            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <div key={index} className="border-b border-white/20 pb-4 last:border-b-0">
                  <h3 className="text-white font-medium mb-2">{faq.question}</h3>
                  <p className="text-gray-300">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 shadow-2xl text-center">
              <MessageCircle className="w-12 h-12 text-blue-400 mx-auto mb-4" />
              <h3 className="text-white font-semibold mb-2">Canlı Destek</h3>
              <p className="text-gray-300 mb-4">7/24 canlı destek hizmeti</p>
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                Başlat
              </button>
            </div>

            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 shadow-2xl text-center">
              <Mail className="w-12 h-12 text-green-400 mx-auto mb-4" />
              <h3 className="text-white font-semibold mb-2">E-posta</h3>
              <p className="text-gray-300 mb-4">destek@falplatform.com</p>
              <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors">
                Gönder
              </button>
            </div>

            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 shadow-2xl text-center">
              <Phone className="w-12 h-12 text-purple-400 mx-auto mb-4" />
              <h3 className="text-white font-semibold mb-2">Telefon</h3>
              <p className="text-gray-300 mb-4">+90 212 123 45 67</p>
              <button className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors">
                Ara
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
