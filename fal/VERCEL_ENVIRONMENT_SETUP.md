# Vercel Environment Variables Setup

## Gerekli Environment Variables

### Frontend Environment Variables (Vercel Dashboard)
```
NEXT_PUBLIC_API_URL=https://your-domain.vercel.app/api
NEXT_PUBLIC_FRONTEND_URL=https://your-domain.vercel.app
NODE_ENV=production
```

### Backend Environment Variables (Vercel Dashboard)
```
# Database
DATABASE_URL=your-production-database-url

# JWT Authentication
JWT_SECRET=your-super-secret-jwt-key-minimum-32-characters
JWT_EXPIRES_IN=7d

# AI Services
OPENAI_API_KEY=sk-your-openai-api-key
GOOGLE_AI_API_KEY=your-google-ai-api-key

# Stripe Payment
STRIPE_SECRET_KEY=sk_live_your-stripe-secret-key
STRIPE_PUBLISHABLE_KEY=pk_live_your-stripe-publishable-key
STRIPE_WEBHOOK_SECRET=whsec_your-stripe-webhook-secret

# CORS Configuration
CORS_ORIGIN=https://your-domain.vercel.app

# Server Configuration
PORT=5000
NODE_ENV=production

# Admin Configuration
ADMIN_EMAIL=admin@falplatform.com
ADMIN_PASSWORD=your-secure-admin-password

# File Upload
MAX_FILE_SIZE=5242880
UPLOAD_PATH=./uploads

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

## Environment Variables Kurulum Adımları

### 1. Vercel Dashboard'a Giriş
1. [Vercel Dashboard](https://vercel.com/dashboard)'a gidin
2. Projenizi seçin
3. Settings > Environment Variables bölümüne gidin

### 2. Environment Variables Ekleme
Her bir environment variable için:
1. **Name**: Variable adını girin
2. **Value**: Variable değerini girin
3. **Environment**: Production, Preview, Development seçin
4. **Add** butonuna tıklayın

### 3. Önemli Notlar
- `NEXT_PUBLIC_*` prefix'li variables frontend'de kullanılabilir
- `JWT_SECRET` en az 32 karakter olmalı
- `DATABASE_URL` production database URL'i olmalı
- API key'lerinizi güvenli tutun
- Production'da test key'leri kullanmayın

## Database Konfigürasyonu

### PostgreSQL (Önerilen)
```env
DATABASE_URL=postgresql://username:password@host:port/database?schema=public
```

### MySQL
```env
DATABASE_URL=mysql://username:password@host:port/database
```

### SQLite (Development)
```env
DATABASE_URL=file:./dev.db
```

## CORS Konfigürasyonu

### Production CORS
```env
CORS_ORIGIN=https://your-domain.vercel.app
```

### Multiple Domains
```env
CORS_ORIGIN=https://your-domain.vercel.app,https://www.your-domain.com
```

## AI Services Konfigürasyonu

### OpenAI
1. [OpenAI Platform](https://platform.openai.com/)'a gidin
2. API Keys bölümünden yeni key oluşturun
3. `OPENAI_API_KEY` olarak ekleyin

### Google AI
1. [Google AI Studio](https://makersuite.google.com/)'ya gidin
2. API key oluşturun
3. `GOOGLE_AI_API_KEY` olarak ekleyin

## Stripe Konfigürasyonu

### Production Keys
1. [Stripe Dashboard](https://dashboard.stripe.com/)'a gidin
2. API Keys bölümünden Live keys'i alın
3. Webhook secret'ı oluşturun

### Test Keys (Development)
```env
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
```

## Troubleshooting

### Environment Variables Çalışmıyor
1. Vercel Dashboard'da variables'ların doğru eklendiğini kontrol edin
2. Production environment'da olduğundan emin olun
3. Projeyi yeniden deploy edin

### Database Bağlantı Hatası
1. `DATABASE_URL`'in doğru olduğunu kontrol edin
2. Database'in erişilebilir olduğunu kontrol edin
3. Prisma migration'larını çalıştırın

### CORS Hatası
1. `CORS_ORIGIN`'in doğru domain'i içerdiğini kontrol edin
2. Frontend URL'inin CORS origins'de olduğunu kontrol edin
3. HTTPS kullandığınızdan emin olun
