# Frontend Environment Setup

## Environment Variables

Frontend uygulaması için gerekli environment variables'ları ayarlamak için:

### 1. .env.local Dosyası Oluşturun

`frontend` klasöründe `.env.local` dosyası oluşturun:

```bash
cd frontend
cp env.example .env.local
```

### 2. Environment Variables'ları Ayarlayın

`.env.local` dosyasında aşağıdaki değerleri ayarlayın:

```env
# Backend API URL - Local development için localhost, production için gerçek URL
NEXT_PUBLIC_API_URL=http://localhost:5000

# Frontend URL - Local development için localhost, production için gerçek URL
NEXT_PUBLIC_FRONTEND_URL=http://localhost:3000
```

### 3. Production Deployment

Vercel'de deployment yaparken, Vercel dashboard'da Environment Variables bölümünden:

- `NEXT_PUBLIC_API_URL`: Backend API URL'inizi girin
- `NEXT_PUBLIC_FRONTEND_URL`: Frontend URL'inizi girin

### 4. Development Server'ı Başlatın

```bash
npm run dev
```

## Önemli Notlar

- `NEXT_PUBLIC_` prefix'i olan environment variables'lar frontend'de kullanılabilir
- `.env.local` dosyası git'e commit edilmez (güvenlik için)
- Production'da environment variables'ları Vercel dashboard'dan ayarlayın
