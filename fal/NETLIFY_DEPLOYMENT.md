# Netlify Deployment Rehberi

Bu rehber, Fal Platform projesini Netlify üzerinden yayına almak için gerekli adımları içerir.

## 🚀 Deployment Adımları

### 1. Netlify Hesabı ve Site Oluşturma

1. [Netlify](https://netlify.com) hesabınıza giriş yapın
2. "New site from Git" butonuna tıklayın
3. GitHub repository'nizi seçin
4. Branch: `main` veya `master` seçin

### 2. Build Ayarları

Netlify dashboard'da aşağıdaki ayarları yapın:

```
Build command: cd frontend && npm run build
Publish directory: frontend/.next
```

### 3. Environment Variables

Netlify dashboard > Site settings > Environment variables bölümünde aşağıdaki değişkenleri ekleyin:

```
NEXT_PUBLIC_API_URL=https://your-backend-url.herokuapp.com
NEXT_PUBLIC_FRONTEND_URL=https://your-app-name.netlify.app
NEXT_PUBLIC_GA_ID=your-google-analytics-id (opsiyonel)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your-stripe-key (opsiyonel)
```

### 4. Backend Deployment

Backend'i ayrı bir platformda deploy etmeniz gerekiyor (Heroku, Railway, Render, vb.):

#### Heroku için:
```bash
# Heroku CLI ile
heroku create your-backend-app-name
git subtree push --prefix backend heroku main
```

#### Railway için:
1. Railway hesabı oluşturun
2. GitHub repository'yi bağlayın
3. Backend klasörünü seçin
4. Environment variables ekleyin

### 5. CORS Ayarları

Backend'de CORS ayarlarını güncelleyin:

```typescript
// backend/src/index.ts
app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://your-app-name.netlify.app',
    'https://*.netlify.app'
  ],
  credentials: true
}));
```

### 6. Domain Ayarları

1. Netlify dashboard > Domain settings
2. Custom domain ekleyin (opsiyonel)
3. SSL sertifikası otomatik olarak sağlanır

## 📁 Dosya Yapısı

Deployment için gerekli dosyalar:

```
├── netlify.toml              # Netlify yapılandırması
├── frontend/
│   ├── next.config.js        # Next.js yapılandırması
│   ├── public/
│   │   ├── _redirects        # Redirect kuralları
│   │   └── _headers          # Header kuralları
│   └── env.example           # Environment variables örneği
└── NETLIFY_DEPLOYMENT.md     # Bu rehber
```

## 🔧 Troubleshooting

### Build Hataları
- Node.js versiyonunu 18 olarak ayarlayın
- `npm ci` kullanarak clean install yapın

### API Bağlantı Hataları
- Backend URL'ini doğru ayarlayın
- CORS ayarlarını kontrol edin
- Environment variables'ları doğrulayın

### Routing Hataları
- `_redirects` dosyasının doğru olduğundan emin olun
- Next.js routing yapılandırmasını kontrol edin

## 📊 Monitoring

1. Netlify Analytics'i etkinleştirin
2. Error tracking için Sentry ekleyin (opsiyonel)
3. Performance monitoring için Lighthouse kullanın

## 🔄 Otomatik Deployment

Her push'ta otomatik deployment için:
1. GitHub repository'yi Netlify'a bağlayın
2. Branch protection rules ayarlayın
3. Preview deployments'ı etkinleştirin

## 📝 Notlar

- Backend ve frontend ayrı ayrı deploy edilmelidir
- Environment variables'ları production'da güvenli tutun
- SSL sertifikaları otomatik olarak sağlanır
- CDN ve caching otomatik olarak yapılandırılır

