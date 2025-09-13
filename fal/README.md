# Fal Platform

Modern fal baktırma ve ritüel platformu. El falı, yüz falı, kahve falı ve AI destekli yorumlar sunan web uygulaması.

## Özellikler

- 🔐 Kullanıcı kayıt ve giriş sistemi
- 👤 Profil yönetimi
- 🪙 Koin sistemi
- 📱 Responsive tasarım
- 🎨 Modern UI/UX
- 🔒 Güvenli API
- 📊 Admin paneli

## Teknolojiler

### Frontend
- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Framer Motion
- React Hot Toast
- Lucide React Icons

### Backend
- Node.js
- Express.js
- TypeScript
- Prisma ORM
- PostgreSQL
- JWT Authentication
- bcryptjs

## Kurulum

### Gereksinimler
- Node.js 18+
- PostgreSQL
- npm veya yarn

### 1. Repository'yi klonlayın
```bash
git clone <repository-url>
cd fal
```

### 2. Backend kurulumu
```bash
cd backend
npm install
```

### 3. Veritabanı kurulumu
```bash
# .env dosyasını oluşturun
cp env.example .env

# Veritabanı URL'sini güncelleyin
# DATABASE_URL="postgresql://username:password@localhost:5432/fal_platform"

# Prisma migration'ları çalıştırın
npx prisma migrate dev

# Seed data (opsiyonel)
npx prisma db seed
```

### 4. Backend'i başlatın
```bash
npm run dev
# http://localhost:5000
```

### 5. Frontend kurulumu
```bash
cd ../frontend
npm install
```

### 6. Frontend'i başlatın
```bash
npm run dev
# http://localhost:3000
```

### 7. Kolay Başlatma (Windows)
```bash
# PowerShell ile (önerilen)
.\start-system.ps1

# Veya Batch dosyası ile
start-system.bat
```

### 8. Servisleri Durdurma
```bash
# PowerShell ile
.\stop-system.ps1

# Veya Batch dosyası ile
stop-system.bat
```

### 9. Production Deployment
```bash
# Netlify için frontend build
cd frontend && npm run build

# Backend için production build
cd backend && npm run build
```

**Not**: Production deployment için Netlify ve Heroku kullanılabilir. Detaylar için `NETLIFY_DEPLOYMENT.md` dosyasına bakın.

## Script'ler

### Ana Script'ler
```bash
npm run dev              # Backend ve frontend'i aynı anda başlatır (workspaces ile)
npm run build            # Backend ve frontend'i build eder
npm run install:all      # Tüm bağımlılıkları kurar
npm run setup            # Tam kurulum (bağımlılıklar + veritabanı)
```

### Ayrı Script'ler
```bash
npm run dev:backend      # Sadece backend'i başlatır (--prefix ile)
npm run dev:frontend     # Sadece frontend'i başlatır (--prefix ile)
npm run build:backend    # Sadece backend'i build eder (--prefix ile)
npm run build:frontend   # Sadece frontend'i build eder (--prefix ile)
```

### Workspaces Kullanımı
```bash
# Workspaces ile direkt komut çalıştırma
npm run dev --prefix frontend    # Frontend'i başlatır
npm run dev --prefix backend     # Backend'i başlatır
npm run build --prefix frontend  # Frontend'i build eder
npm run build --prefix backend   # Backend'i build eder
```

## Kullanım

### Kullanıcı İşlemleri
1. **Kayıt Ol**: `/auth/register` sayfasından yeni hesap oluşturun
2. **Giriş Yap**: `/auth/login` sayfasından giriş yapın
3. **Profil**: `/profile` sayfasından bilgilerinizi düzenleyin

### Fal İşlemleri
- El falı, yüz falı, kahve falı seçenekleri
- Günlük 3 ücretsiz fal hakkı
- AI destekli yorumlar
- Koin ile ek fal hakkı satın alma

### Admin Panel
- Kullanıcı yönetimi
- Fal istatistikleri
- Sistem ayarları

## API Endpoints

### Auth
- `POST /api/auth/register` - Kullanıcı kaydı
- `POST /api/auth/login` - Kullanıcı girişi
- `GET /api/auth/me` - Mevcut kullanıcı bilgileri
- `POST /api/auth/logout` - Çıkış

### User
- `PUT /api/user/profile` - Profil güncelleme

### Fortune
- `POST /api/fortune/hand` - El falı
- `POST /api/fortune/face` - Yüz falı
- `POST /api/fortune/coffee` - Kahve falı

## Ortam Değişkenleri

### Environment Variables Setup

Proje environment variables kullanarak farklı ortamlar için konfigürasyon yönetimi sağlar.

#### 1. Local Development

**Root klasörde `.env.local` dosyası oluşturun:**
```env
# API Base URL
NEXT_PUBLIC_API_URL=http://localhost:5000

# Frontend Base URL
NEXT_PUBLIC_FRONTEND_URL=http://localhost:3000

# Backend API Configuration
API_PORT=5000
API_HOST=localhost

# Database Configuration (Backend için)
DATABASE_URL=file:./prisma/dev.db

# JWT Secret (Backend için)
JWT_SECRET=your-super-secret-jwt-key-here

# Admin Configuration
ADMIN_EMAIL=admin@falplatform.com
ADMIN_PASSWORD=admin123
```

**Frontend klasöründe `.env.local` dosyası oluşturun:**
```env
# API Base URL
NEXT_PUBLIC_API_URL=http://localhost:5000

# Frontend Base URL
NEXT_PUBLIC_FRONTEND_URL=http://localhost:3000

# Development Mode
NODE_ENV=development
```

#### 2. Production Environment

**Frontend klasöründe `.env.production` dosyası oluşturun:**
```env
# Production API URL (Vercel/Heroku backend URL'i)
NEXT_PUBLIC_API_URL=https://your-backend-api.vercel.app

# Production Frontend URL (Vercel frontend URL'i)
NEXT_PUBLIC_FRONTEND_URL=https://your-frontend.vercel.app

# Production Mode
NODE_ENV=production
```

#### 3. Vercel Deployment

Vercel dashboard'da Environment Variables ekleyin:
- `NEXT_PUBLIC_API_URL`: Backend API URL'iniz
- `NEXT_PUBLIC_FRONTEND_URL`: Frontend URL'iniz

#### 4. Environment Variables Kullanımı

Kod içinde environment variables şu şekilde kullanılır:

```typescript
// API URL'i kullanma
const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

// Frontend URL'i kullanma
const frontendUrl = process.env.NEXT_PUBLIC_FRONTEND_URL || 'http://localhost:3000';

// API çağrısı örneği
const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/endpoint`);
```

### Backend (.env)
```env
DATABASE_URL="postgresql://username:password@localhost:5432/fal_platform"
JWT_SECRET="your-secret-key"
CORS_ORIGIN="http://localhost:3000"
PORT=5000
NODE_ENV=development
```

### Environment Files Priority

1. `.env.local` (local development için)
2. `.env.production` (production build için)
3. `.env` (genel ayarlar)
4. Default values (fallback)

## Geliştirme

### Veritabanı şemasını güncelleme
```bash
cd backend
npx prisma migrate dev --name migration_name
```

### Production build
```bash
# Backend
cd backend
npm run build
npm start

# Frontend
cd frontend
npm run build
npm start
```

## Katkıda Bulunma

1. Fork yapın
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Commit yapın (`git commit -m 'Add amazing feature'`)
4. Push yapın (`git push origin feature/amazing-feature`)
5. Pull Request oluşturun

## Lisans

Bu proje MIT lisansı altında lisanslanmıştır.

## İletişim

Proje Sahibi - [@your-username](https://github.com/your-username)

Proje Linki: [https://github.com/your-username/fal-platform](https://github.com/your-username/fal-platform)
