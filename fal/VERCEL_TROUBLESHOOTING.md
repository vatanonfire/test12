# Vercel Deployment Troubleshooting Guide

## Yaygın Hatalar ve Çözümleri

### 1. INTERNAL_FUNCTION_INVOCATION_FAILED
**Sebep**: Backend serverless function düzgün çalışmıyor
**Çözüm**: 
- `backend/api/index.ts` dosyasının doğru oluşturulduğundan emin olun
- Environment variables'ların Vercel dashboard'da ayarlandığından emin olun
- Prisma client'ın doğru konfigüre edildiğinden emin olun
- Function timeout'u 30 saniyeye ayarlayın
- Memory limit'i 1024MB'a ayarlayın

### 2. DEPLOYMENT_BLOCKED
**Sebep**: Build sürecinde hata
**Çözüm**:
- `vercel.json` konfigürasyonunu kontrol edin
- Frontend ve backend build scriptlerinin doğru çalıştığından emin olun
- Node.js versiyonunun 18.x olduğundan emin olun
- TypeScript compilation hatalarını kontrol edin
- Dependencies eksikliğini kontrol edin

### 3. ROUTER_CANNOT_MATCH
**Sebep**: Route konfigürasyonu yanlış
**Çözüm**:
- `vercel.json`'daki routes ayarlarını kontrol edin
- API routes'ların `/api` prefix'i ile başladığından emin olun
- Function path'lerinin doğru olduğundan emin olun

### 4. CORS Hataları
**Sebep**: CORS konfigürasyonu eksik
**Çözüm**:
- `backend/api/index.ts`'de CORS ayarlarını kontrol edin
- Frontend URL'inin CORS origins'de olduğundan emin olun
- Preflight request'leri handle ettiğinizden emin olun

### 5. FUNCTION_TIMEOUT
**Sebep**: Function 30 saniyeyi aştı
**Çözüm**:
- Database query'lerini optimize edin
- Async operations'ları optimize edin
- Memory kullanımını azaltın
- Function'ı daha küçük parçalara bölün

### 6. FUNCTION_MEMORY_LIMIT_EXCEEDED
**Sebep**: Function memory limit'i aştı
**Çözüm**:
- Memory limit'i 1024MB'a çıkarın
- Unused variables'ları temizleyin
- Large objects'leri optimize edin
- Prisma connection'ları optimize edin

### 7. BUILD_FAILED
**Sebep**: Build process başarısız
**Çözüm**:
- TypeScript hatalarını düzeltin
- Dependencies eksikliğini kontrol edin
- Environment variables'ları kontrol edin
- Node.js versiyonunu kontrol edin

### 8. FUNCTION_NOT_FOUND
**Sebep**: Function bulunamadı
**Çözüm**:
- `vercel.json`'daki function path'ini kontrol edin
- Function dosyasının doğru yerde olduğundan emin olun
- Export default kullandığınızdan emin olun

### 9. INVALID_FUNCTION_CONFIGURATION
**Sebep**: Function konfigürasyonu yanlış
**Çözüm**:
- `vercel.json`'daki function ayarlarını kontrol edin
- Runtime versiyonunu kontrol edin
- Memory ve timeout ayarlarını kontrol edin

### 10. DATABASE_CONNECTION_ERROR
**Sebep**: Database bağlantı hatası
**Çözüm**:
- `DATABASE_URL`'in doğru olduğunu kontrol edin
- Database'in erişilebilir olduğunu kontrol edin
- Prisma migration'larını çalıştırın
- Connection pooling ayarlarını kontrol edin

## Environment Variables Checklist

### Frontend (Vercel Dashboard)
```
NEXT_PUBLIC_API_URL=https://your-domain.vercel.app/api
NEXT_PUBLIC_FRONTEND_URL=https://your-domain.vercel.app
```

### Backend (Vercel Dashboard)
```
DATABASE_URL=your-production-database-url
JWT_SECRET=your-super-secret-jwt-key
OPENAI_API_KEY=your-openai-api-key
GOOGLE_AI_API_KEY=your-google-ai-api-key
STRIPE_SECRET_KEY=your-stripe-secret-key
CORS_ORIGIN=https://your-domain.vercel.app
NODE_ENV=production
```

## Build Süreci Kontrolü

### 1. Local Test
```bash
# Frontend build test
cd frontend
npm run build

# Backend build test
cd backend
npm run build
```

### 2. Vercel CLI Test
```bash
# Vercel CLI ile test
vercel dev

# Production build test
vercel build
```

## Debug Adımları

### 1. Vercel Logs Kontrolü
```bash
vercel logs your-deployment-url
```

### 2. Function Logs
Vercel Dashboard > Functions > backend/api/index.ts > Logs

### 3. Build Logs
Vercel Dashboard > Deployments > Build Logs

## Performans Optimizasyonu

### 1. Prisma Client
- Singleton pattern kullanıldı
- Connection pooling aktif
- Graceful shutdown eklendi

### 2. CORS
- Dynamic origin checking
- Preflight request handling
- Production URL'ler için optimize edildi

### 3. Next.js
- Standalone output
- Image optimization
- Webpack fallbacks

## Deployment Checklist

- [ ] Environment variables ayarlandı
- [ ] Database bağlantısı test edildi
- [ ] API routes çalışıyor
- [ ] CORS ayarları doğru
- [ ] Build süreci başarılı
- [ ] Function timeout ayarlandı (30s)
- [ ] Prisma client konfigüre edildi
