# Vercel Deployment Guide

## Proje Yapısı

Bu proje monorepo yapısında organize edilmiştir:
- **Frontend**: Next.js uygulaması (`frontend/` klasörü)
- **Backend**: Node.js/Express API (`backend/` klasörü)

## Vercel Konfigürasyonu

### vercel.json
```json
{
  "version": 2,
  "builds": [
    { "src": "frontend/package.json", "use": "@vercel/next" },
    { "src": "backend/api/index.ts", "use": "@vercel/node" }
  ],
  "routes": [
    { "src": "/api/(.*)", "dest": "/backend/api/index.ts" },
    { "src": "/(.*)", "dest": "/frontend/$1" }
  ],
  "env": {
    "NODE_ENV": "production"
  },
  "functions": {
    "backend/api/index.ts": {
      "runtime": "nodejs18.x",
      "maxDuration": 30
    }
  }
}
```

## Deployment Adımları

### 1. Vercel CLI ile Deploy

```bash
# Vercel CLI'yi yükleyin
npm i -g vercel

# Proje root'unda deploy edin
vercel

# Production'a deploy edin
vercel --prod
```

### 2. Vercel Dashboard ile Deploy

1. [Vercel Dashboard](https://vercel.com/dashboard)'a gidin
2. "New Project" butonuna tıklayın
3. GitHub repository'nizi bağlayın
4. Root directory olarak proje root'unu seçin
5. Build Command: `npm run build`
6. Output Directory: `frontend/.next`

### 3. Environment Variables Ayarlayın

Vercel Dashboard'da Environment Variables bölümünden:

#### Frontend Variables:
```
NEXT_PUBLIC_API_URL=https://your-domain.vercel.app/api
NEXT_PUBLIC_FRONTEND_URL=https://your-domain.vercel.app
```

#### Backend Variables:
```
DATABASE_URL=your-production-database-url
JWT_SECRET=your-super-secret-jwt-key
STRIPE_SECRET_KEY=your-stripe-secret-key
OPENAI_API_KEY=your-openai-api-key
GOOGLE_AI_API_KEY=your-google-ai-api-key
CORS_ORIGIN=https://your-domain.vercel.app
```

## Route Yapısı

- **Frontend Routes**: `https://your-domain.vercel.app/` (Next.js)
- **Backend API Routes**: `https://your-domain.vercel.app/api/*` (Express)

### API Endpoints:
- `GET /api/health` - Health check
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `POST /api/fortune/coffee` - Coffee fortune
- `POST /api/fortune/hand` - Hand fortune
- `POST /api/fortune/face` - Face fortune
- `POST /api/ai-chat` - AI chat
- `GET /api/coins/packages` - Coin packages
- Ve diğer API endpoints...

## Build Süreci

1. **Backend Build**: TypeScript → JavaScript (dist/ klasörü) + Prisma Generate
2. **Frontend Build**: Next.js build (.next/ klasörü)
3. **Workspaces**: npm workspaces ile otomatik bağımlılık yönetimi

### Local Development
```bash
# Tek komutla hem backend hem frontend başlatma
npm run dev

# Ayrı ayrı başlatma
npm run dev:backend
npm run dev:frontend
```

### Production Build
```bash
# Tüm projeyi build etme
npm run build

# Vercel otomatik build
vercel --prod
```

## Önemli Notlar

- Backend serverless function olarak çalışır
- Frontend static olarak serve edilir
- API routes `/api` prefix'i ile başlar
- CORS ayarları production URL'ler için yapılandırılmalı
- Environment variables production'da ayarlanmalı

## Troubleshooting

### Build Hataları:
- Node.js versiyonu 18.x olmalı
- Tüm dependencies yüklenmeli
- Environment variables eksik olmamalı

### API Hataları:
- CORS ayarlarını kontrol edin
- Database bağlantısını kontrol edin
- API key'lerin doğru olduğundan emin olun

### Frontend Hataları:
- NEXT_PUBLIC_* variables'ların doğru olduğundan emin olun
- API URL'lerin doğru olduğundan emin olun
