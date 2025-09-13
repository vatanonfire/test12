# Fal Platform Kurulum Rehberi

## 🚀 Hızlı Başlangıç

### Gereksinimler
- Node.js (v18+)
- PostgreSQL
- npm veya yarn

### 1. Projeyi Klonlayın
```bash
git clone <repository-url>
cd fal-rituel-platform
```

### 2. Bağımlılıkları Yükleyin
```bash
# Ana bağımlılıkları yükleyin
npm install

# Backend bağımlılıklarını yükleyin
cd backend
npm install

# Frontend bağımlılıklarını yükleyin
cd ../frontend
npm install
```

### 3. Veritabanını Kurun

#### PostgreSQL Kurulumu
1. PostgreSQL'i sisteminize kurun
2. Yeni bir veritabanı oluşturun:
```sql
CREATE DATABASE fal_platform;
```

#### Environment Değişkenlerini Ayarlayın
```bash
# Backend için .env dosyası oluşturun
cd backend
cp env.example .env
```

`.env` dosyasını düzenleyin:
```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/fal_platform"

# JWT
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
JWT_EXPIRES_IN="7d"

# Server
PORT=5000
NODE_ENV="development"

# Stripe (opsiyonel - test için)
STRIPE_SECRET_KEY="sk_test_your_stripe_secret_key"
STRIPE_PUBLISHABLE_KEY="pk_test_your_stripe_publishable_key"

# OpenAI (gerekli)
OPENAI_API_KEY="sk-your-openai-api-key"

# CORS
CORS_ORIGIN="http://localhost:3000"
```

### 4. Veritabanı Migration'larını Çalıştırın
```bash
cd backend
npx prisma generate
npx prisma migrate dev --name init
```

### 5. Uygulamayı Başlatın

#### Development Modunda
```bash
# Ana dizinde
npm run dev
```

Bu komut hem backend (port 5000) hem de frontend (port 3000) sunucularını başlatacaktır.

#### Ayrı Ayrı Başlatma
```bash
# Backend
cd backend
npm run dev

# Frontend (yeni terminal)
cd frontend
npm run dev
```

### 6. Uygulamayı Test Edin
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000
- Health Check: http://localhost:5000/health

## 📁 Proje Yapısı

```
fal-rituel-platform/
├── backend/                 # Backend API
│   ├── src/
│   │   ├── controllers/     # Route controllers
│   │   ├── routes/         # API routes
│   │   ├── middleware/     # Custom middleware
│   │   ├── config/         # Configuration files
│   │   └── index.ts        # Main server file
│   ├── prisma/             # Database schema
│   ├── uploads/            # Uploaded images
│   └── package.json
├── frontend/               # Next.js frontend
│   ├── src/
│   │   ├── app/           # Next.js 13+ app directory
│   │   ├── components/    # React components
│   │   └── lib/          # Utility functions
│   ├── public/           # Static files
│   └── package.json
└── package.json          # Root package.json
```

## 🔧 Geliştirme

### Backend Geliştirme
```bash
cd backend
npm run dev          # Development server
npm run build        # Build for production
npm run migrate      # Run database migrations
npm run studio       # Open Prisma Studio
```

### Frontend Geliştirme
```bash
cd frontend
npm run dev          # Development server
npm run build        # Build for production
npm run lint         # Run ESLint
```

## 🚀 Production Deployment

### Backend Deployment
1. Environment değişkenlerini production için ayarlayın
2. Build alın: `npm run build`
3. PM2 veya benzeri process manager kullanın

### Frontend Deployment
1. Build alın: `npm run build`
2. Vercel, Netlify veya benzeri platformlara deploy edin

## 🔒 Güvenlik

- JWT secret'ını production'da değiştirin
- CORS origin'lerini production URL'leri ile güncelleyin
- Rate limiting ayarlarını kontrol edin
- File upload limitlerini ayarlayın

## 📊 Monitoring

- Health check endpoint: `/health`
- API documentation: Swagger/OpenAPI (gelecek)
- Error logging: Console + file logging
- Performance monitoring: (gelecek)

## 🐛 Troubleshooting

### Yaygın Sorunlar

1. **Database Connection Error**
   - PostgreSQL servisinin çalıştığından emin olun
   - DATABASE_URL'yi kontrol edin
   - Veritabanının oluşturulduğundan emin olun

2. **Port Already in Use**
   - Port 5000 veya 3000'i kullanan diğer servisleri durdurun
   - Environment değişkenlerinde farklı port belirtin

3. **OpenAI API Error**
   - API key'in doğru olduğundan emin olun
   - API limitlerini kontrol edin

4. **File Upload Error**
   - Uploads klasörünün yazma izinlerini kontrol edin
   - File size limitlerini kontrol edin

## 📞 Destek

Sorun yaşarsanız:
1. Console loglarını kontrol edin
2. Health check endpoint'ini test edin
3. Database bağlantısını kontrol edin
4. Environment değişkenlerini doğrulayın
