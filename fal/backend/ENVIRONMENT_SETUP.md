# Backend Environment Setup

## Environment Variables

Backend uygulaması için gerekli environment variables'ları ayarlamak için:

### 1. .env Dosyası Oluşturun

`backend` klasöründe `.env` dosyası oluşturun:

```bash
cd backend
cp env.example .env
```

### 2. Environment Variables'ları Ayarlayın

`.env` dosyasında aşağıdaki değerleri ayarlayın:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/fal_platform"

# JWT
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
JWT_EXPIRES_IN="7d"

# Server
PORT=5000
NODE_ENV="development"

# Stripe
STRIPE_SECRET_KEY="sk_test_your_stripe_secret_key"
STRIPE_PUBLISHABLE_KEY="pk_test_your_stripe_publishable_key"
STRIPE_WEBHOOK_SECRET="whsec_your_webhook_secret"

# OpenAI
OPENAI_API_KEY="sk-your-openai-api-key"

# Google Generative AI
GOOGLE_AI_API_KEY="your-google-ai-api-key"

# File Upload
MAX_FILE_SIZE=5242880
UPLOAD_PATH="./uploads"

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# CORS
CORS_ORIGIN="http://localhost:3000"

# Admin
ADMIN_EMAIL="admin@falplatform.com"
ADMIN_PASSWORD="admin123"
```

### 3. Production Deployment

Vercel'de deployment yaparken, Vercel dashboard'da Environment Variables bölümünden:

- `DATABASE_URL`: Production veritabanı URL'inizi girin
- `JWT_SECRET`: Güçlü bir JWT secret key girin
- `STRIPE_SECRET_KEY`: Stripe production secret key
- `OPENAI_API_KEY`: OpenAI API key'inizi girin
- `GOOGLE_AI_API_KEY`: Google AI API key'inizi girin
- `CORS_ORIGIN`: Frontend URL'inizi girin

### 4. Development Server'ı Başlatın

```bash
npm run dev
```

### 5. Build ve Start

```bash
npm run build
npm start
```

## Önemli Notlar

- `.env` dosyası git'e commit edilmez (güvenlik için)
- Production'da environment variables'ları Vercel dashboard'dan ayarlayın
- JWT_SECRET production'da güçlü bir değer kullanın
- API key'lerinizi güvenli tutun ve asla kod içinde hardcode etmeyin
