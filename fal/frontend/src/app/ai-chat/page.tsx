'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, MessageCircle, Coffee, Hand, User, Moon, Sparkles, X } from 'lucide-react';
import Link from 'next/link';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

const ALLOWED_TOPICS = [
  'kahve falı',
  'el falı', 
  'yüz falı',
  'rüya tabiri',
  'fal',
  'kahve',
  'el',
  'yüz',
  'rüya'
];

export default function AIChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Merhaba! Ben fal ve rüya tabiri konusunda size yardımcı olabilirim. Kahve falı, el falı, yüz falı veya rüya tabiri hakkında sorularınızı sorabilirsiniz.',
      isUser: false,
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const isTopicAllowed = (text: string): boolean => {
    const lowerText = text.toLowerCase();
    return ALLOWED_TOPICS.some(topic => lowerText.includes(topic));
  };

  const handleSendMessage = async () => {
    if (!inputText.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);
    setIsTyping(true);

    // Konu kontrolü
    if (!isTopicAllowed(inputText)) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: 'Üzgünüm, sadece kahve falı, el falı, yüz falı ve rüya tabiri konularında sorular sorabilirsiniz. Lütfen bu konulardan birini seçin.',
        isUser: false,
        timestamp: new Date()
      };
      
      setTimeout(() => {
        setMessages(prev => [...prev, errorMessage]);
        setIsLoading(false);
        setIsTyping(false);
      }, 1000);
      return;
    }

    try {
      // API çağrısı burada yapılacak
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/ai-chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: inputText,
          topic: ALLOWED_TOPICS.find(topic => inputText.toLowerCase().includes(topic))
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const aiMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: data.response,
          isUser: false,
          timestamp: new Date()
        };
        
        setTimeout(() => {
          setMessages(prev => [...prev, aiMessage]);
          setIsLoading(false);
          setIsTyping(false);
        }, 1500);
      } else {
        throw new Error('API yanıt vermedi');
      }
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: 'Üzgünüm, şu anda yapay zeka servisine bağlanamıyorum. Lütfen daha sonra tekrar deneyin.',
        isUser: false,
        timestamp: new Date()
      };
      
      setTimeout(() => {
        setMessages(prev => [...prev, errorMessage]);
        setIsLoading(false);
        setIsTyping(false);
      }, 1000);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const clearChat = () => {
    setMessages([
      {
        id: '1',
        text: 'Merhaba! Ben fal ve rüya tabiri konusunda size yardımcı olabilirim. Kahve falı, el falı, yüz falı veya rüya tabiri hakkında sorularınızı sorabilirsiniz.',
        isUser: false,
        timestamp: new Date()
      }
    ]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      {/* Header */}
      <div className="bg-white/10 backdrop-blur-lg border-b border-white/20">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Link href="/" className="flex items-center space-x-2 text-cyan-300 hover:text-cyan-200 transition-colors">
                <Hand className="w-5 h-5" />
                <span>Geri</span>
              </Link>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2">
                <MessageCircle className="w-6 h-6 text-purple-400" />
                <h1 className="text-2xl font-bold text-white">AI Fal Asistanı</h1>
              </div>
            </div>

            <button
              onClick={clearChat}
              className="flex items-center space-x-2 px-3 py-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors"
            >
              <X className="w-4 h-4" />
              <span className="hidden sm:inline">Sohbeti Temizle</span>
            </button>
          </div>
        </div>
      </div>

      {/* Chat Container */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 shadow-2xl">
          {/* Allowed Topics Info */}
          <div className="p-4 border-b border-white/20">
            <div className="flex items-center space-x-2 mb-3">
              <Sparkles className="w-5 h-5 text-yellow-400" />
              <h3 className="text-lg font-semibold text-white">İzin Verilen Konular</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {ALLOWED_TOPICS.map((topic, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-gradient-to-r from-purple-500/20 to-blue-500/20 text-purple-200 rounded-full text-sm border border-purple-500/30"
                >
                  {topic}
                </span>
              ))}
            </div>
          </div>

          {/* Messages */}
          <div className="h-96 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl ${
                    message.isUser
                      ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white'
                      : 'bg-white/10 text-gray-200 border border-white/20'
                  }`}
                >
                  <p className="text-sm leading-relaxed">{message.text}</p>
                  <p className={`text-xs mt-2 ${
                    message.isUser ? 'text-purple-200' : 'text-gray-400'
                  }`}>
                    {message.timestamp.toLocaleTimeString('tr-TR', {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
              </div>
            ))}
            
            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-white/10 border border-white/20 rounded-2xl px-4 py-3">
                  <div className="flex items-center space-x-2">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                    <span className="text-sm text-gray-400">AI düşünüyor...</span>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-4 border-t border-white/20">
            <div className="flex items-end space-x-3">
              <div className="flex-1">
                <textarea
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Kahve falı, el falı, yüz falı veya rüya tabiri hakkında soru sorun..."
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  rows={2}
                  disabled={isLoading}
                />
                <p className="text-xs text-gray-400 mt-2">
                  Sadece fal ve rüya tabiri konularında soru sorabilirsiniz.
                </p>
              </div>
              
              <button
                onClick={handleSendMessage}
                disabled={!inputText.trim() || isLoading}
                className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl hover:from-purple-700 hover:to-blue-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                <Send className="w-5 h-5" />
                <span className="hidden sm:inline">Gönder</span>
              </button>
            </div>
          </div>
        </div>

        {/* Quick Questions */}
        <div className="mt-6">
          <h3 className="text-lg font-semibold text-white mb-4 text-center">Örnek Sorular</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {[
              'Kahve falında kuş görmek ne anlama gelir?',
              'El falında yaşam çizgisi kısa ne demek?',
              'Yüz falında büyük gözler neyi ifade eder?',
              'Rüyada su görmek ne anlama gelir?'
            ].map((question, index) => (
              <button
                key={index}
                onClick={() => setInputText(question)}
                className="p-3 bg-white/5 hover:bg-white/10 border border-white/20 rounded-lg text-left text-sm text-gray-300 hover:text-white transition-all duration-200"
              >
                {question}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
