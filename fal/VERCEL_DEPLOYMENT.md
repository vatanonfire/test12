# Vercel Deployment Guide

## Proje Yapısı
Bu proje monorepo yapısında organize edilmiştir:
- `frontend/` - Next.js React uygulaması
- `backend/` - Node.js/Express API servisi

## Vercel Deploy Ayarları

### 1. Framework Preset
- **Framework**: Next.js
- **Root Directory**: `frontend`
- **Build Command**: `cd frontend && npm run build`
- **Output Directory**: `frontend/.next`

### 2. Environment Variables
Vercel dashboard'da aşağıdaki environment variable'ları ekleyin:
```
NEXT_PUBLIC_API_URL=https://your-backend-api.vercel.app
NEXT_PUBLIC_FRONTEND_URL=https://your-frontend.vercel.app
```

### 3. Build Settings
- **Node.js Version**: 18.x
- **Install Command**: `npm install && cd frontend && npm install`

## Deploy Adımları

1. **Vercel'e projeyi import edin**
2. **Root Directory'i `frontend` olarak ayarlayın**
3. **Environment variable'ları ekleyin**
4. **Deploy butonuna tıklayın**

## Sorun Giderme

### "No Next.js version detected" Hatası
- Root directory'in `frontend` olarak ayarlandığından emin olun
- `vercel.json` dosyasının doğru konfigüre edildiğini kontrol edin
- `frontend/package.json`'da Next.js bağımlılıklarının mevcut olduğunu doğrulayın

### Build Hataları
- Node.js versiyonunun 18.x olduğundan emin olun
- Tüm bağımlılıkların yüklendiğini kontrol edin
- TypeScript hatalarını kontrol edin

## Yerel Geliştirme
```bash
# Tüm bağımlılıkları yükle
npm run install:all

# Geliştirme sunucularını başlat
npm run dev
```

## Production Build
```bash
# Frontend build
cd frontend && npm run build

# Backend build (ayrı deploy gerekli)
cd backend && npm run build
```

