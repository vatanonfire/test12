# Netlify Deployment Rehberi

Bu rehber, Fal Platform uygulamasını Netlify üzerinde deploy etmek için gerekli adımları içerir.

## Ön Gereksinimler

- GitHub repository'si
- Netlify hesabı
- Backend API'nin deploy edilmiş olması (Heroku, Railway, vb.)

## Deployment Adımları

### 1. GitHub Repository Hazırlığı

```bash
# Tüm değişiklikleri commit edin
git add .
git commit -m "Netlify deployment hazırlığı"
git push origin main
```

### 2. Netlify'de Site Oluşturma

1. [Netlify Dashboard](https://app.netlify.com/)'a gidin
2. "New site from Git" butonuna tıklayın
3. GitHub repository'nizi seçin
4. Build ayarlarını yapılandırın:
   - **Build command**: `npm run build:frontend`
   - **Publish directory**: `frontend/.next`
   - **Node version**: `18`

### 3. Environment Variables Ayarlama

Netlify dashboard'da Site Settings > Environment Variables bölümüne gidin ve şu değişkenleri ekleyin:

```
NEXT_PUBLIC_API_URL=https://your-backend-url.herokuapp.com
NEXT_PUBLIC_FRONTEND_URL=https://your-app-name.netlify.app
NODE_ENV=production
NEXT_TELEMETRY_DISABLED=1
```

### 4. Build Ayarları

`netlify.toml` dosyası zaten projeye dahil edilmiştir ve şu ayarları içerir:

- Node.js 18.x kullanımı
- Frontend build komutu
- Güvenlik headers
- Cache ayarları
- API proxy redirects

### 5. Custom Domain (Opsiyonel)

1. Site Settings > Domain Management
2. "Add custom domain" butonuna tıklayın
3. Domain'inizi ekleyin ve DNS ayarlarını yapın

## Önemli Notlar

### Backend API
- Backend API'nizin CORS ayarlarında Netlify domain'inizi eklemeyi unutmayın
- `CORS_ORIGIN` environment variable'ını güncelleyin

### Environment Variables
- Tüm `NEXT_PUBLIC_` ile başlayan değişkenler frontend'de kullanılabilir
- Hassas bilgiler (API keys, secrets) backend'de tutulmalıdır

### Build Optimizasyonu
- Next.js otomatik olarak static export yapar
- Image optimization devre dışı bırakılmıştır (Netlify uyumluluğu için)
- Trailing slash kullanımı aktif edilmiştir

## Sorun Giderme

### Build Hataları
- Node.js versiyonunu 18.x olarak ayarlayın
- `npm install` komutunu çalıştırın
- Environment variables'ların doğru ayarlandığından emin olun

### API Bağlantı Sorunları
- Backend API'nin çalıştığından emin olun
- CORS ayarlarını kontrol edin
- `NEXT_PUBLIC_API_URL` değişkeninin doğru olduğunu kontrol edin

### Performance
- Netlify CDN otomatik olarak aktif olur
- Static dosyalar için cache ayarları yapılandırılmıştır
- Image optimization için Netlify Image Optimization kullanabilirsiniz

## Monitoring

- Netlify Analytics'i aktif edin
- Build logs'ları kontrol edin
- Function logs'ları izleyin (eğer Netlify Functions kullanıyorsanız)

## Güncelleme

Her yeni commit otomatik olarak deploy edilir. Manuel deploy için:

1. Netlify dashboard'da "Deploys" sekmesine gidin
2. "Trigger deploy" butonuna tıklayın
3. "Deploy site" seçeneğini seçin
