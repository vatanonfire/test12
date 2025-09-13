export interface Ritual {
  id: string;
  name: string;
  description: string;
  shortDescription: string;
  price: number;
  category: string;
  icon: string;
  color: string;
  gradient: string;
  duration: string;
  difficulty: 'Kolay' | 'Orta' | 'Zor';
  materials: string[];
  steps: string[];
  specialNotes: string;
  benefits: string[];
  bestTime: string;
  energy: string;
}

export const ritualCategories = [
  { id: 'moon', name: 'Ay Ritüelleri', icon: '🌙', color: 'from-indigo-500 to-purple-600' },
  { id: 'sun', name: 'Güneş Ritüelleri', icon: '☀️', color: 'from-yellow-500 to-orange-600' },
  { id: 'shaman', name: 'Şaman Ritüelleri', icon: '🦅', color: 'from-green-500 to-teal-600' },
  { id: 'healing', name: 'İyileşme Ritüelleri', icon: '💚', color: 'from-emerald-500 to-green-600' },
  { id: 'love', name: 'Aşk Ritüelleri', icon: '💕', color: 'from-pink-500 to-rose-600' },
  { id: 'protection', name: 'Koruma Ritüelleri', icon: '🛡️', color: 'from-blue-500 to-indigo-600' },
  { id: 'abundance', name: 'Bereket Ritüelleri', icon: '💰', color: 'from-yellow-400 to-amber-600' },
  { id: 'spiritual', name: 'Ruhsal Ritüelleri', icon: '✨', color: 'from-purple-500 to-violet-600' }
];

export const rituals: Ritual[] = [
  // Ay Ritüelleri
  {
    id: 'new-moon-ritual',
    name: 'Yeni Ay Ritüeli',
    description: 'Yeni başlangıçlar ve niyet belirleme için güçlü bir ritüel. Yeni ay enerjisi ile hayallerinizi gerçeğe dönüştürün.',
    shortDescription: 'Yeni başlangıçlar ve niyet belirleme',
    price: 150,
    category: 'moon',
    icon: '🌙',
    color: 'bg-indigo-100 text-indigo-800',
    gradient: 'from-indigo-500 to-purple-600',
    duration: '30-45 dakika',
    difficulty: 'Kolay',
    materials: ['Beyaz mum', 'Kâğıt ve kalem', 'Temiz su', 'Tuz'],
    steps: [
      'Temiz bir alan hazırlayın ve rahatsız edilmeyeceğinizden emin olun',
      'Beyaz mumu yakın ve niyetinizi kâğıda yazın',
      'Niyetinizi 3 kez yüksek sesle okuyun',
      'Kâğıdı mum alevinde yakın ve küllerini toprağa gömün',
      'Mumun tamamen yanmasını bekleyin ve teşekkür edin'
    ],
    specialNotes: 'Yeni ay gününde yapılması en etkilidir. Ayın görünür olduğu saatlerde yapın.',
    benefits: ['Yeni başlangıçlar', 'Niyet güçlendirme', 'Enerji temizliği', 'Odaklanma'],
    bestTime: 'Yeni ay günü, akşam saatleri',
    energy: 'Yenilenme ve başlangıç'
  },
  {
    id: 'full-moon-ritual',
    name: 'Dolunay Ritüeli',
    description: 'Dolunay enerjisi ile güçlendirme ve şükran ritüeli. Bu güçlü enerji döneminde hayatınızı dönüştürün.',
    shortDescription: 'Güçlendirme ve şükran ritüeli',
    price: 200,
    category: 'moon',
    icon: '🌕',
    color: 'bg-purple-100 text-purple-800',
    gradient: 'from-purple-500 to-pink-600',
    duration: '45-60 dakika',
    difficulty: 'Orta',
    materials: ['Gümüş mum', 'Kristaller', 'Şifalı otlar', 'Ayna'],
    steps: [
      'Dolunay ışığında oturun ve kristallerinizi temizleyin',
      'Aynaya bakarak kendinize şükranlarınızı ifade edin',
      'Gümüş mumu yakın ve güçlendirmek istediğiniz alanları düşünün',
      'Şifalı otları mum alevinde yakın ve enerjiyi içinize çekin',
      'Dolunay ışığında meditasyon yapın'
    ],
    specialNotes: 'Dolunay gecesi yapılması en etkilidir. Ay ışığının görünür olduğu saatlerde yapın.',
    benefits: ['Enerji güçlendirme', 'Şükran duygusu', 'Ruhsal temizlik', 'Güç artışı'],
    bestTime: 'Dolunay gecesi, gece saatleri',
    energy: 'Güçlendirme ve dönüşüm'
  },
  {
    id: 'lunar-eclipse-ritual',
    name: 'Ay Tutulması Ritüeli',
    description: 'Ay tutulması sırasında yapılan güçlü dönüşüm ritüeli. Eski enerjileri temizleyip yeni enerjileri kabul edin.',
    shortDescription: 'Güçlü dönüşüm ve temizlik ritüeli',
    price: 300,
    category: 'moon',
    icon: '🌑',
    color: 'bg-gray-100 text-gray-800',
    gradient: 'from-gray-600 to-indigo-700',
    duration: '60-90 dakika',
    difficulty: 'Zor',
    materials: ['Siyah mum', 'Beyaz mum', 'Temizlik tuzu', 'Sage', 'Kâğıt'],
    steps: [
      'Tutulma başlamadan önce alanınızı temizleyin',
      'Siyah mumu yakın ve bırakmak istediğiniz şeyleri kâğıda yazın',
      'Tutulma sırasında kâğıdı yakın ve küllerini suya atın',
      'Beyaz mumu yakın ve yeni niyetlerinizi belirleyin',
      'Sage ile alanınızı temizleyin'
    ],
    specialNotes: 'Ay tutulması sırasında yapılması gereklidir. Tutulma takvimini kontrol edin.',
    benefits: ['Derin temizlik', 'Güçlü dönüşüm', 'Eski enerji temizliği', 'Yeni başlangıçlar'],
    bestTime: 'Ay tutulması sırasında',
    energy: 'Dönüşüm ve yenilenme'
  },

  // Güneş Ritüelleri
  {
    id: 'sunrise-ritual',
    name: 'Gün Doğumu Ritüeli',
    description: 'Güneş doğarken yapılan enerji toplama ve günlük niyet belirleme ritüeli. Yeni güne pozitif başlayın.',
    shortDescription: 'Enerji toplama ve günlük niyet belirleme',
    price: 120,
    category: 'sun',
    icon: '🌅',
    color: 'bg-yellow-100 text-yellow-800',
    gradient: 'from-yellow-400 to-orange-500',
    duration: '20-30 dakika',
    difficulty: 'Kolay',
    materials: ['Sarı mum', 'Turuncu kristal', 'Su', 'Kâğıt'],
    steps: [
      'Güneş doğmadan 15 dakika önce hazırlanın',
      'Doğu yönüne bakarak oturun',
      'Sarı mumu yakın ve günlük niyetinizi belirleyin',
      'Güneş doğarken ellerinizi gökyüzüne kaldırın',
      'Güneş enerjisini içinize çekin'
    ],
    specialNotes: 'Güneş doğmadan önce başlayın. Açık havada yapılması idealdir.',
    benefits: ['Enerji artışı', 'Pozitif başlangıç', 'Günlük motivasyon', 'Doğal enerji'],
    bestTime: 'Güneş doğumu, sabah erken',
    energy: 'Enerji ve motivasyon'
  },
  {
    id: 'solar-eclipse-ritual',
    name: 'Güneş Tutulması Ritüeli',
    description: 'Güneş tutulması sırasında yapılan güçlü manifestasyon ritüeli. Hayallerinizi gerçeğe dönüştürün.',
    shortDescription: 'Güçlü manifestasyon ve hayal gerçekleştirme',
    price: 350,
    category: 'sun',
    icon: '☀️',
    color: 'bg-orange-100 text-orange-800',
    gradient: 'from-orange-500 to-red-600',
    duration: '45-75 dakika',
    difficulty: 'Zor',
    materials: ['Altın mum', 'Güneş taşı', 'Kâğıt ve altın kalem', 'Sandal ağacı tütsüsü'],
    steps: [
      'Tutulma başlamadan önce alanınızı hazırlayın',
      'Altın mumu yakın ve hayalinizi detaylıca yazın',
      'Tutulma sırasında hayalinizi görselleştirin',
      'Güneş taşını tutarak enerjiyi içinize çekin',
      'Tutulma bittikten sonra kâğıdı güvenli bir yerde saklayın'
    ],
    specialNotes: 'Güneş tutulması sırasında yapılması gereklidir. Göz koruması kullanın.',
    benefits: ['Güçlü manifestasyon', 'Hayal gerçekleştirme', 'Enerji artışı', 'Dönüşüm'],
    bestTime: 'Güneş tutulması sırasında',
    energy: 'Manifestasyon ve güç'
  },

  // Şaman Ritüelleri
  {
    id: 'shaman-journey',
    name: 'Şaman Yolculuğu',
    description: 'Şamanik yolculuk ile ruhsal rehberlik alma ritüeli. Bilinçaltınızla bağlantı kurun.',
    shortDescription: 'Ruhsal rehberlik ve bilinçaltı bağlantısı',
    price: 400,
    category: 'shaman',
    icon: '🦅',
    color: 'bg-green-100 text-green-800',
    gradient: 'from-green-500 to-teal-600',
    duration: '90-120 dakika',
    difficulty: 'Zor',
    materials: ['Drum veya rattle', 'Sage', 'Kristaller', 'Göz bandı', 'Rahat yastık'],
    steps: [
      'Rahat bir pozisyonda uzanın ve gözlerinizi kapatın',
      'Sage ile alanınızı temizleyin',
      'Drum ritmi ile trans haline geçin',
      'Ruhsal rehberinizi çağırın',
      'Yolculuk sonrası deneyimlerinizi kaydedin'
    ],
    specialNotes: 'Deneyimli bir rehber eşliğinde yapılması önerilir. Güvenli bir ortamda yapın.',
    benefits: ['Ruhsal rehberlik', 'Bilinçaltı erişim', 'İçsel bilgelik', 'Dönüşüm'],
    bestTime: 'Gece saatleri, sessiz ortam',
    energy: 'Ruhsal bağlantı ve bilgelik'
  },
  {
    id: 'animal-spirit-ritual',
    name: 'Hayvan Ruhu Ritüeli',
    description: 'Hayvan ruhları ile bağlantı kurma ve onlardan güç alma ritüeli. Doğal güçlerinizi keşfedin.',
    shortDescription: 'Hayvan ruhları ile bağlantı ve güç alma',
    price: 250,
    category: 'shaman',
    icon: '🐺',
    color: 'bg-teal-100 text-teal-800',
    gradient: 'from-teal-500 to-green-600',
    duration: '60-90 dakika',
    difficulty: 'Orta',
    materials: ['Hayvan figürleri', 'Doğal tüyler', 'Toprak', 'Su', 'Mum'],
    steps: [
      'Doğal bir ortamda oturun',
      'Hayvan figürlerini önünüze yerleştirin',
      'Mum yakın ve hayvan ruhlarını çağırın',
      'Hangi hayvanın size yaklaştığını hissedin',
      'O hayvanın gücünü içinize çekin'
    ],
    specialNotes: 'Doğal ortamda yapılması en etkilidir. Sessizlik önemlidir.',
    benefits: ['Doğal güç', 'Hayvan rehberliği', 'İçsel güç', 'Doğa bağlantısı'],
    bestTime: 'Doğal ortam, sessiz saatler',
    energy: 'Doğal güç ve rehberlik'
  },

  // İyileşme Ritüelleri
  {
    id: 'reiki-healing',
    name: 'Reiki İyileşme Ritüeli',
    description: 'Reiki enerjisi ile fiziksel ve ruhsal iyileşme ritüeli. Evrensel yaşam enerjisini kullanın.',
    shortDescription: 'Reiki enerjisi ile fiziksel ve ruhsal iyileşme',
    price: 180,
    category: 'healing',
    icon: '💚',
    color: 'bg-emerald-100 text-emerald-800',
    gradient: 'from-emerald-500 to-green-600',
    duration: '45-60 dakika',
    difficulty: 'Orta',
    materials: ['Reiki kristalleri', 'Beyaz mum', 'Temiz su', 'Rahat yastık'],
    steps: [
      'Rahat bir pozisyonda oturun veya uzanın',
      'Beyaz mumu yakın ve Reiki sembollerini çizin',
      'Ellerinizi vücudunuzun üzerinde gezdirin',
      'Reiki enerjisini problemli alanlara yönlendirin',
      'İyileşme enerjisini içinize çekin'
    ],
    specialNotes: 'Reiki eğitimi almış kişiler tarafından yapılması önerilir.',
    benefits: ['Fiziksel iyileşme', 'Ruhsal temizlik', 'Enerji dengeleme', 'Stres azaltma'],
    bestTime: 'Sessiz ortam, rahat saatler',
    energy: 'İyileşme ve dengeleme'
  },
  {
    id: 'chakra-balancing',
    name: 'Çakra Dengeleme Ritüeli',
    description: 'Çakraları dengeleme ve enerji akışını düzenleme ritüeli. İçsel dengeyi sağlayın.',
    shortDescription: 'Çakra dengeleme ve enerji akışı düzenleme',
    price: 220,
    category: 'healing',
    icon: '🌀',
    color: 'bg-violet-100 text-violet-800',
    gradient: 'from-violet-500 to-purple-600',
    duration: '60-75 dakika',
    difficulty: 'Orta',
    materials: ['Çakra kristalleri', 'Çakra mumları', 'Tütsü', 'Müzik'],
    steps: [
      'Her çakra için uygun kristali yerleştirin',
      'Çakra mumlarını yakın',
      'Her çakra için uygun renkte ışık görselleştirin',
      'Çakra sembollerini çizin',
      'Enerji akışını dengeleyin'
    ],
    specialNotes: 'Her çakra için uygun renk ve kristal kullanın.',
    benefits: ['Enerji dengeleme', 'Çakra temizliği', 'İçsel denge', 'Ruhsal sağlık'],
    bestTime: 'Sessiz ortam, rahat saatler',
    energy: 'Dengeleme ve uyum'
  },

  // Aşk Ritüelleri
  {
    id: 'love-attraction',
    name: 'Aşk Çekme Ritüeli',
    description: 'Gerçek aşkı hayatınıza çekme ritüeli. Kalp çakrasını açın ve sevgi enerjisini yayın.',
    shortDescription: 'Gerçek aşkı hayatınıza çekme',
    price: 280,
    category: 'love',
    icon: '💕',
    color: 'bg-pink-100 text-pink-800',
    gradient: 'from-pink-500 to-rose-600',
    duration: '50-70 dakika',
    difficulty: 'Orta',
    materials: ['Pembe mum', 'Gül yaprakları', 'Rose quartz', 'Kâğıt ve kalem'],
    steps: [
      'Pembe mumu yakın ve gül yapraklarını etrafına serpin',
      'Rose quartz kristalini kalp çakranızın üzerine koyun',
      'İdeal partnerinizin özelliklerini kâğıda yazın',
      'Sevgi enerjisini kalp çakranızdan yayın',
      'Niyetinizi evrene gönderin'
    ],
    specialNotes: 'Cuma günleri yapılması en etkilidir. Kalp çakrası odaklı çalışın.',
    benefits: ['Aşk çekme', 'Kalp çakrası açma', 'Sevgi enerjisi', 'İlişki güçlendirme'],
    bestTime: 'Cuma günleri, akşam saatleri',
    energy: 'Sevgi ve çekim'
  },
  {
    id: 'relationship-healing',
    name: 'İlişki İyileştirme Ritüeli',
    description: 'Mevcut ilişkinizi güçlendirme ve iyileştirme ritüeli. Bağları güçlendirin.',
    shortDescription: 'Mevcut ilişkiyi güçlendirme ve iyileştirme',
    price: 320,
    category: 'love',
    icon: '💖',
    color: 'bg-rose-100 text-rose-800',
    gradient: 'from-rose-500 to-pink-600',
    duration: '70-90 dakika',
    difficulty: 'Orta',
    materials: ['İki pembe mum', 'İki rose quartz', 'Gül suyu', 'Kırmızı ip'],
    steps: [
      'İki pembe mumu yan yana yakın',
      'Her iki rose quartz kristalini mumların arasına koyun',
      'Kırmızı ipi iki kristali bağlayacak şekilde yerleştirin',
      'İlişkinizin güçlü yanlarını düşünün',
      'Pozitif enerjiyi ilişkinize yönlendirin'
    ],
    specialNotes: 'Partnerinizle birlikte yapılması en etkilidir.',
    benefits: ['İlişki güçlendirme', 'Bağ güçlendirme', 'Sevgi artışı', 'Uyum'],
    bestTime: 'Birlikte, akşam saatleri',
    energy: 'Sevgi ve uyum'
  },

  // Koruma Ritüelleri
  {
    id: 'protection-shield',
    name: 'Koruma Kalkanı Ritüeli',
    description: 'Negatif enerjilerden korunma ve enerji kalkanı oluşturma ritüeli. Güvenliğinizi sağlayın.',
    shortDescription: 'Negatif enerjilerden korunma ve enerji kalkanı',
    price: 200,
    category: 'protection',
    icon: '🛡️',
    color: 'bg-blue-100 text-blue-800',
    gradient: 'from-blue-500 to-indigo-600',
    duration: '40-60 dakika',
    difficulty: 'Orta',
    materials: ['Mavi mum', 'Lapis lazuli', 'Tuz', 'Sage', 'Kâğıt'],
    steps: [
      'Mavi mumu yakın ve koruma niyetinizi belirleyin',
      'Lapis lazuli kristalini tutun',
      'Çevrenizde enerji kalkanı görselleştirin',
      'Sage ile alanınızı temizleyin',
      'Koruma enerjisini içinize çekin'
    ],
    specialNotes: 'Her gün tekrarlanabilir. Güçlü niyet önemlidir.',
    benefits: ['Negatif enerji koruması', 'Enerji kalkanı', 'Güvenlik', 'Ruhsal koruma'],
    bestTime: 'Herhangi bir zaman',
    energy: 'Koruma ve güvenlik'
  },
  {
    id: 'evil-eye-removal',
    name: 'Nazar Kaldırma Ritüeli',
    description: 'Nazar ve kötü göz etkilerini kaldırma ritüeli. Negatif enerjileri temizleyin.',
    shortDescription: 'Nazar ve kötü göz etkilerini kaldırma',
    price: 150,
    category: 'protection',
    icon: '👁️',
    color: 'bg-indigo-100 text-indigo-800',
    gradient: 'from-indigo-500 to-blue-600',
    duration: '30-45 dakika',
    difficulty: 'Kolay',
    materials: ['Beyaz mum', 'Tuz', 'Su', 'Nazar boncuğu', 'Limon'],
    steps: [
      'Beyaz mumu yakın ve nazar kaldırma niyetinizi belirleyin',
      'Tuz ve su karışımı hazırlayın',
      'Nazar boncuğunu suya batırın',
      'Limon suyu ile alanınızı temizleyin',
      'Negatif enerjileri uzaklaştırın'
    ],
    specialNotes: 'Perşembe günleri yapılması en etkilidir.',
    benefits: ['Nazar kaldırma', 'Negatif enerji temizliği', 'Koruma', 'Enerji temizliği'],
    bestTime: 'Perşembe günleri',
    energy: 'Temizlik ve koruma'
  },

  // Bereket Ritüelleri
  {
    id: 'abundance-manifestation',
    name: 'Bereket Manifestasyonu',
    description: 'Maddi ve manevi bereketi hayatınıza çekme ritüeli. Bolluk enerjisini yayın.',
    shortDescription: 'Maddi ve manevi bereketi hayatınıza çekme',
    price: 300,
    category: 'abundance',
    icon: '💰',
    color: 'bg-yellow-100 text-yellow-800',
    gradient: 'from-yellow-400 to-amber-600',
    duration: '60-80 dakika',
    difficulty: 'Orta',
    materials: ['Altın mum', 'Citrine kristali', 'Yeşil kâğıt', 'Altın kalem', 'Para'],
    steps: [
      'Altın mumu yakın ve bereket niyetinizi belirleyin',
      'Citrine kristalini tutun',
      'Bereket isteklerinizi yeşil kâğıda yazın',
      'Para enerjisini görselleştirin',
      'Bolluk enerjisini içinize çekin'
    ],
    specialNotes: 'Perşembe günleri yapılması en etkilidir. Şükran duygusu önemlidir.',
    benefits: ['Maddi bereket', 'Manevi zenginlik', 'Bolluk enerjisi', 'Şükran'],
    bestTime: 'Perşembe günleri, öğle saatleri',
    energy: 'Bereket ve bolluk'
  },
  {
    id: 'money-attraction',
    name: 'Para Çekme Ritüeli',
    description: 'Para enerjisini hayatınıza çekme ve finansal durumunuzu iyileştirme ritüeli.',
    shortDescription: 'Para enerjisini hayatınıza çekme',
    price: 250,
    category: 'abundance',
    icon: '💎',
    color: 'bg-amber-100 text-amber-800',
    gradient: 'from-amber-500 to-yellow-600',
    duration: '50-70 dakika',
    difficulty: 'Orta',
    materials: ['Yeşil mum', 'Pyrite kristali', 'Kâğıt para', 'Yeşil kâğıt'],
    steps: [
      'Yeşil mumu yakın ve para niyetinizi belirleyin',
      'Pyrite kristalini tutun',
      'Para isteklerinizi yeşil kâğıda yazın',
      'Kâğıt parayı kristalin yanına koyun',
      'Para enerjisini içinize çekin'
    ],
    specialNotes: 'Cuma günleri yapılması en etkilidir. Pozitif para enerjisi önemlidir.',
    benefits: ['Para çekme', 'Finansal iyileşme', 'Para enerjisi', 'Maddi güvenlik'],
    bestTime: 'Cuma günleri, öğle saatleri',
    energy: 'Para ve bereket'
  },

  // Ruhsal Ritüelleri
  {
    id: 'tibetan-mantra',
    name: 'Tibet Mantraları',
    description: 'Tibet mantraları ile ruhsal güçlenme ve içsel huzur bulma ritüeli. Kadim bilgeliği kullanın.',
    shortDescription: 'Tibet mantraları ile ruhsal güçlenme',
    price: 180,
    category: 'spiritual',
    icon: '🕉️',
    color: 'bg-purple-100 text-purple-800',
    gradient: 'from-purple-500 to-violet-600',
    duration: '45-60 dakika',
    difficulty: 'Orta',
    materials: ['Mala tesbih', 'Mum', 'Rahat yastık', 'Sessiz ortam'],
    steps: [
      'Rahat bir pozisyonda oturun',
      'Mum yakın ve niyetinizi belirleyin',
      'Mala tesbih ile mantrayı tekrarlayın',
      'Her boncuk için bir kez mantrayı söyleyin',
      '108 kez tekrarlayın'
    ],
    specialNotes: 'Sessiz ortamda yapılması önemlidir. Doğru telaffuz önemlidir.',
    benefits: ['Ruhsal güçlenme', 'İçsel huzur', 'Mantra gücü', 'Meditasyon'],
    bestTime: 'Sabah erken veya akşam',
    energy: 'Ruhsal güç ve huzur'
  },
  {
    id: 'third-eye-opening',
    name: 'Üçüncü Göz Açma',
    description: 'Üçüncü göz çakrasını açma ve ruhsal görü yeteneklerini geliştirme ritüeli.',
    shortDescription: 'Üçüncü göz çakrasını açma ve ruhsal görü',
    price: 350,
    category: 'spiritual',
    icon: '👁️‍🗨️',
    color: 'bg-violet-100 text-violet-800',
    gradient: 'from-violet-500 to-purple-600',
    duration: '75-90 dakika',
    difficulty: 'Zor',
    materials: ['Amethyst kristali', 'İndigo mum', 'Lavanta tütsüsü', 'Ayna'],
    steps: [
      'Amethyst kristalini alnınızın ortasına koyun',
      'İndigo mumu yakın',
      'Üçüncü göz çakrasını görselleştirin',
      'Lavanta tütsüsü ile alanınızı temizleyin',
      'Ruhsal görü yeteneklerinizi açın'
    ],
    specialNotes: 'Deneyimli rehber eşliğinde yapılması önerilir. Sabır gereklidir.',
    benefits: ['Ruhsal görü', 'Üçüncü göz açma', 'Sezgisel güç', 'Ruhsal farkındalık'],
    bestTime: 'Gece saatleri, sessiz ortam',
    energy: 'Ruhsal görü ve farkındalık'
  }
];


