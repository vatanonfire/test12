import express from 'express';
import { body, validationResult } from 'express-validator';
import { googleAI, AI_CONFIG } from '../config/ai';
import { authenticateToken } from '../middleware/auth';
import { checkFortuneLimits, recordFortuneUsage } from '../middleware/fortuneLimits';

interface AuthRequest extends express.Request {
  user?: {
    id: string;
    email: string;
    role: string;
  };
}

const router = express.Router();

// Fal yorumları için çeşitli şablonlar
const COFFEE_FORTUNES = [
  {
    love: "Aşk hayatınızda yeni bir dönem başlayacak. Mevcut ilişkiniz varsa daha derin bağlar kurulacak, yoksa yakında hayatınıza özel biri girecek.",
    career: "Kariyer açısından yükselme ve tanınma dönemi yaşayacaksınız. Yeni projeler ve fırsatlar karşınıza çıkacak.",
    health: "Sağlığınıza dikkat etmeniz gereken bir dönem. Spor ve beslenme konularında kendinizi geliştirmeniz önerilir.",
    travel: "Yakın zamanda seyahat planlarınız olacak. Bu seyahat size yeni deneyimler ve mutluluk getirecek.",
    money: "Para konusunda dikkatli olmanız gerekiyor. Gereksiz harcamalardan kaçının, tasarruf yapın.",
    general: "Genel olarak önümüzdeki 3-6 ay içinde hayatınızda olumlu değişiklikler olacak. Sabırlı olun ve fırsatları değerlendirin."
  },
  {
    love: "Aşk konusunda sabırlı olmanız gerekiyor. Acele etmeyin, doğru kişi zamanı geldiğinde karşınıza çıkacak.",
    career: "İş hayatınızda zorluklar yaşayabilirsiniz ama bu zorluklar sizi güçlendirecek. Pes etmeyin.",
    health: "Sağlığınız genel olarak iyi. Ancak stres yönetimi konusunda kendinizi geliştirmeniz önerilir.",
    travel: "Seyahat planlarınız ertelenebilir. Bu süre zarfında kendinizi geliştirmeye odaklanın.",
    money: "Maddi durumunuz istikrarlı. Yeni yatırım fırsatları değerlendirebilirsiniz.",
    general: "Önümüzdeki dönemde hayatınızda denge kurmanız gerekiyor. İş ve özel hayat arasında denge sağlayın."
  },
  {
    love: "Aşk hayatınızda beklenmedik gelişmeler olacak. Eski bir aşk geri dönebilir veya yeni bir aşk başlayabilir.",
    career: "Kariyerinizde büyük bir sıçrama yapacaksınız. Yeni pozisyon veya iş teklifi alabilirsiniz.",
    health: "Sağlığınızda iyileşme göreceksiniz. Eski sağlık sorunlarınız çözülecek.",
    travel: "Uzak bir ülkeye seyahat edebilirsiniz. Bu seyahat hayatınızı değiştirecek.",
    money: "Beklenmedik bir gelir elde edebilirsiniz. Lotarya veya miras gibi durumlar olabilir.",
    general: "Hayatınızda büyük değişiklikler olacak. Bu değişiklikler sizi daha mutlu edecek."
  }
];

const HAND_FORTUNES = [
  {
    life: "Yaşam çizginiz güçlü ve belirgin. Bu, uzun ve sağlıklı bir yaşam süreceğinizi işaret ediyor.",
    love: "Aşk çizginiz derin ve net. Mevcut ilişkiniz varsa bu ilişki güçlenecek, yoksa yakında hayatınıza özel biri girecek.",
    career: "Kariyer çizginiz yükselen bir trend gösteriyor. İş hayatınızda başarılar elde edeceksiniz.",
    money: "Para çizginiz istikrarlı. Maddi açıdan rahat bir dönem yaşayacaksınız.",
    health: "Sağlık çizgileriniz güçlü. Genel olarak sağlıklı bir yaşam süreceksiniz.",
    character: "Karakter olarak kararlı, sabırlı ve çalışkan bir yapıya sahipsiniz. Bu özellikler hayatınızda başarı getirecek."
  },
  {
    life: "Yaşam çizginizde kısa ama yoğun dönemler var. Bu, her anı değerlendirmeniz gerektiğini gösteriyor.",
    love: "Aşk çizginizde dalgalanmalar var. Duygusal olarak iniş çıkışlar yaşayabilirsiniz ama sonunda mutlu olacaksınız.",
    career: "Kariyer çizginizde değişimler olacak. Yeni alanlara yönelmek isteyebilirsiniz.",
    money: "Para çizginizde dikkat edilmesi gereken noktalar var. Harcamalarınızı kontrol altında tutun.",
    health: "Sağlık çizgilerinizde dikkat edilmesi gereken noktalar var. Düzenli check-up yaptırın.",
    character: "Karakter olarak esnek ve uyumlu bir yapıya sahipsiniz. Bu özellik zorlukları aşmanızı sağlayacak."
  },
  {
    life: "Yaşam çizginizde uzun ve huzurlu dönemler var. Bu, sakin bir yaşam süreceğinizi gösteriyor.",
    love: "Aşk çizginizde sadakat ve güven var. Uzun süreli ve güvenilir ilişkiler kuracaksınız.",
    career: "Kariyer çizginizde istikrar var. Mevcut işinizde uzun süre kalabilirsiniz.",
    money: "Para çizginizde güvenlik var. Maddi açıdan güvende hissedeceksiniz.",
    health: "Sağlık çizgilerinizde güç var. Sağlıklı bir yaşam süreceksiniz.",
    character: "Karakter olarak güvenilir ve sadık bir yapıya sahipsiniz. Bu özellik size güven kazandıracak."
  }
];

const FACE_FORTUNES = [
  {
    character: "Güçlü bir iradeye sahipsiniz. Kararlarınızı verirken düşünceli davranırsınız ve bir kez karar verdikten sonra vazgeçmezsiniz.",
    love: "Aşk konusunda romantik ve duygusal bir yapıya sahipsiniz. İlişkilerinizde derinlik ararsınız ve partnerinize sadık kalırsınız.",
    career: "Kariyer hayatınızda liderlik özellikleriniz öne çıkıyor. Takım çalışmasında başarılısınız ve insanları yönlendirme konusunda yeteneklisiniz.",
    social: "Sosyal ilişkileriniz güçlü. İnsanlarla kolayca iletişim kurabiliyorsunuz ve çevrenizde sevilen bir kişisiniz.",
    strengths: "Güçlü yanlarınız arasında sabır, kararlılık ve empati bulunuyor.",
    weaknesses: "Zayıf yanlarınız ise bazen fazla mükemmeliyetçi olmanız.",
    future: "Gelecekte büyük başarılar elde edeceksiniz. Özellikle kariyer ve aşk hayatınızda mutlu olacaksınız."
  },
  {
    character: "Sezgisel güçleriniz gelişmiş. İçgüdülerinize güvenin, size doğru yolu gösterecekler.",
    love: "Aşk konusunda bağımsız bir yapıya sahipsiniz. İlişkilerinizde özgürlüğünüzü korumaya özen gösterirsiniz.",
    career: "Kariyer hayatınızda yaratıcılığınız öne çıkıyor. Yeni fikirler üretmekte başarılısınız.",
    social: "Sosyal ilişkilerinizde seçici davranırsınız. Az ama kaliteli arkadaşlıklar kurarsınız.",
    strengths: "Güçlü yanlarınız arasında yaratıcılık, sezgi ve bağımsızlık bulunuyor.",
    weaknesses: "Zayıf yanlarınız ise bazen fazla içe dönük olmanız.",
    future: "Gelecekte yaratıcı projelerde başarılı olacaksınız. Sanat veya tasarım alanlarında kendinizi geliştirebilirsiniz."
  },
  {
    character: "Analitik düşünme yeteneğiniz gelişmiş. Problemleri mantıklı bir şekilde çözmekte başarılısınız.",
    love: "Aşk konusunda mantıklı davranırsınız. Duygularınızı kontrol altında tutarsınız.",
    career: "Kariyer hayatınızda analiz yetenekleriniz öne çıkıyor. Veri analizi veya araştırma alanlarında başarılı olabilirsiniz.",
    social: "Sosyal ilişkilerinizde güvenilir bir kişi olarak tanınırsınız. Size danışılan bir kişi olursunuz.",
    strengths: "Güçlü yanlarınız arasında analiz, mantık ve güvenilirlik bulunuyor.",
    weaknesses: "Zayıf yanlarınız ise bazen fazla soğuk davranmanız.",
    future: "Gelecekte bilimsel veya teknik alanlarda başarılı olacaksınız. Araştırma projelerinde öne çıkacaksınız."
  }
];

// Rastgele fal seçimi için yardımcı fonksiyon
function getRandomFortune(fortunes: any[]) {
  return fortunes[Math.floor(Math.random() * fortunes.length)];
}

// Kahve Falı endpoint
router.post('/coffee', [
  body('imageDescription').notEmpty().withMessage('Görsel açıklaması boş olamaz')
], authenticateToken, checkFortuneLimits('COFFEE'), async (req: AuthRequest, res: express.Response) => {
  try {
    console.log('☕ Coffee Fortune - Request received');
    console.log('☕ Request body:', req.body);
    console.log('☕ User ID:', req.user?.id);
    
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log('☕ Validation errors:', errors.array());
      return res.status(400).json({
        success: false,
        message: 'Validation hatası',
        errors: errors.array()
      });
    }

    const { imageDescription } = req.body;
    console.log('☕ Image description:', imageDescription);

    try {
      console.log('☕ Starting Google AI analysis...');
      // Google AI ile kahve falı yorumu al
      const model = googleAI.getGenerativeModel({ model: AI_CONFIG.google.model });

      const prompt = `Sen deneyimli bir kahve falı uzmanısın. Kahve fincanındaki şekilleri ve işaretleri yorumlayarak detaylı bir fal yorumu yap.

Kullanıcının gördüğü şekiller: "${imageDescription}"

Lütfen şu konularda detaylı yorum yap:
- Aşk ve ilişkiler
- Kariyer ve iş hayatı
- Sağlık
- Seyahat ve yolculuk
- Para ve maddi durum
- Genel gelecek öngörüleri

Yanıtın Türkçe olması gerekiyor ve 200-300 kelime arasında olmalı. Gerçek bir falcı gibi samimi ve detaylı yorum yap.`;

      console.log('☕ Sending request to Google AI...');
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const fortuneResponse = response.text();
      console.log('☕ Google AI response received:', fortuneResponse.substring(0, 100) + '...');

      // Fal kullanımını kaydet
      console.log('☕ Recording fortune usage...');
      await recordFortuneUsage('COFFEE')(req, res, () => {});

      console.log('☕ Coffee fortune completed successfully');
      return res.json({
        success: true,
        message: 'Kahve falı başarıyla yorumlandı',
        fortune: fortuneResponse,
        type: 'coffee',
        timestamp: new Date().toISOString()
      });

    } catch (aiError) {
      console.error('☕ Google AI Error:', aiError);
      console.log('☕ Using fallback response...');

      // AI hatası durumunda rastgele fallback response döndür
      const randomFortune = getRandomFortune(COFFEE_FORTUNES);
      const fallbackResponse = `Kahve fincanınızdaki şekilleri inceledim. ${imageDescription.includes('kuş') ? 'Kuş figürü' : 'Gördüğünüz şekiller'}, hayatınızda önemli değişiklikler olacağını işaret ediyor. 

${randomFortune.love}

${randomFortune.career}

${randomFortune.health}

${randomFortune.travel}

${randomFortune.money}

${randomFortune.general}`;

      console.log('☕ Fallback response generated');
      return res.json({
        success: true,
        message: 'Kahve falı yorumlandı',
        fortune: fallbackResponse,
        type: 'coffee',
        timestamp: new Date().toISOString(),
        fallback: true
      });
    }

  } catch (error) {
    console.error('Coffee Fortune Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Fal servisinde hata oluştu',
      error: error instanceof Error ? error.message : 'Bilinmeyen hata'
    });
  }
});

// El Falı endpoint
router.post('/hand', [
  body('imageDescription').notEmpty().withMessage('Görsel açıklaması boş olamaz')
], authenticateToken, checkFortuneLimits('HAND'), async (req: AuthRequest, res: express.Response) => {
  try {
    console.log('🖐️ Hand Fortune - Request received');
    console.log('🖐️ Request body:', req.body);
    console.log('🖐️ User ID:', req.user?.id);
    
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log('🖐️ Validation errors:', errors.array());
      return res.status(400).json({
        success: false,
        message: 'Validation hatası',
        errors: errors.array()
      });
    }

    const { imageDescription } = req.body;
    console.log('🖐️ Image description:', imageDescription);

    try {
      console.log('🖐️ Starting Google AI analysis...');
      // Google AI ile el falı yorumu al
      const model = googleAI.getGenerativeModel({ model: AI_CONFIG.google.model });

      const prompt = `Sen deneyimli bir el falı uzmanısın. El çizgilerini ve şekillerini yorumlayarak detaylı bir fal yorumu yap.

Kullanıcının el özellikleri: "${imageDescription}"

Lütfen şu konularda detaylı yorum yap:
- Yaşam çizgisi ve yaşam kalitesi
- Aşk çizgisi ve ilişki durumu
- Kariyer çizgisi ve iş hayatı
- Para çizgisi ve maddi durum
- Sağlık çizgileri
- Genel karakter özellikleri

Yanıtın Türkçe olması gerekiyor ve 200-300 kelime arasında olmalı. Gerçek bir falcı gibi samimi ve detaylı yorum yap.`;

      console.log('🖐️ Sending request to Google AI...');
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const fortuneResponse = response.text();
      console.log('🖐️ Google AI response received:', fortuneResponse.substring(0, 100) + '...');

      // Fal kullanımını kaydet
      console.log('🖐️ Recording fortune usage...');
      await recordFortuneUsage('HAND')(req, res, () => {});

      console.log('🖐️ Hand fortune completed successfully');
      return res.json({
        success: true,
        message: 'El falı başarıyla yorumlandı',
        fortune: fortuneResponse,
        type: 'hand',
        timestamp: new Date().toISOString()
      });

    } catch (aiError) {
      console.error('🖐️ Google AI Error:', aiError);
      console.log('🖐️ Using fallback response...');

      // AI hatası durumunda rastgele fallback response döndür
      const randomFortune = getRandomFortune(HAND_FORTUNES);
      const fallbackResponse = `El çizgilerinizi detaylı inceledim. ${imageDescription.includes('yaşam') ? 'Yaşam çizginiz' : 'El çizgileriniz'}, hayatınızın kalitesini ve süresini gösteriyor. 

${randomFortune.life}

${randomFortune.love}

${randomFortune.career}

${randomFortune.money}

${randomFortune.health}

${randomFortune.character}`;

      console.log('🖐️ Fallback response generated');
      return res.json({
        success: true,
        message: 'El falı yorumlandı',
        fortune: fallbackResponse,
        type: 'hand',
        timestamp: new Date().toISOString(),
        fallback: true
      });
    }

  } catch (error) {
    console.error('Hand Fortune Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Fal servisinde hata oluştu',
      error: error instanceof Error ? error.message : 'Bilinmeyen hata'
    });
  }
});

// Yüz Falı endpoint
router.post('/face', [
  body('imageDescription').notEmpty().withMessage('Görsel açıklaması boş olamaz')
], authenticateToken, checkFortuneLimits('FACE'), async (req: AuthRequest, res: express.Response) => {
  try {
    console.log('👤 Face Fortune - Request received');
    console.log('👤 Request body:', req.body);
    console.log('👤 User ID:', req.user?.id);
    
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log('👤 Validation errors:', errors.array());
      return res.status(400).json({
        success: false,
        message: 'Validation hatası',
        errors: errors.array()
      });
    }

    const { imageDescription } = req.body;
    console.log('👤 Image description:', imageDescription);

    try {
      // Google AI ile yüz falı yorumu al
      const model = googleAI.getGenerativeModel({ model: AI_CONFIG.google.model });

      const prompt = `Sen deneyimli bir yüz falı uzmanısın. Yüz hatlarını ve özelliklerini yorumlayarak detaylı bir karakter analizi yap.

Kullanıcının yüz özellikleri: "${imageDescription}"

Lütfen şu konularda detaylı yorum yap:
- Karakter ve kişilik özellikleri
- Aşk ve ilişki yatkınlığı
- Kariyer ve iş hayatı uyumu
- Sosyal ilişkiler ve iletişim
- Güçlü ve zayıf yanlar
- Gelecek potansiyeli

Yanıtın Türkçe olması gerekiyor ve 200-300 kelime arasında olmalı. Gerçek bir falcı gibi samimi ve detaylı yorum yap.`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const fortuneResponse = response.text();

      // Fal kullanımını kaydet
      await recordFortuneUsage('FACE')(req, res, () => {});

      return res.json({
        success: true,
        message: 'Yüz falı başarıyla yorumlandı',
        fortune: fortuneResponse,
        type: 'face',
        timestamp: new Date().toISOString()
      });

    } catch (aiError) {
      console.error('Google AI Error:', aiError);

      // AI hatası durumunda rastgele fallback response döndür
      const randomFortune = getRandomFortune(FACE_FORTUNES);
      const fallbackResponse = `Yüz hatlarınızı detaylı inceledim. ${imageDescription.includes('göz') ? 'Gözleriniz' : 'Yüz özellikleriniz'}, karakterinizin derinliklerini yansıtıyor. 

${randomFortune.character}

${randomFortune.love}

${randomFortune.career}

${randomFortune.social}

${randomFortune.strengths}

${randomFortune.weaknesses}

${randomFortune.future}`;

      return res.json({
        success: true,
        message: 'Yüz falı yorumlandı',
        fortune: fallbackResponse,
        type: 'face',
        timestamp: new Date().toISOString(),
        fallback: true
      });
    }

  } catch (error) {
    console.error('Face Fortune Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Fal servisinde hata oluştu',
      error: error instanceof Error ? error.message : 'Bilinmeyen hata'
    });
  }
});

export default router;
