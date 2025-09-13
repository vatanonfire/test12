import express from 'express';
import { body, validationResult } from 'express-validator';
import { googleAI, AI_CONFIG } from '../config/ai';
import { authenticateToken } from '../middleware/auth';
import { checkFortuneLimits, recordFortuneUsage } from '../middleware/fortuneLimits';

const router = express.Router();

// AI Chat için çeşitli fallback yanıtları
const AI_CHAT_FALLBACKS = [
  {
    coffee: "Kahve falında gördüğünüz şekiller, hayatınızda önemli değişiklikler olacağını işaret ediyor. Bu değişiklikler genellikle olumlu yönde olacak ve sizi daha mutlu edecek.",
    hand: "El falında çizgileriniz, güçlü bir karaktere sahip olduğunuzu gösteriyor. Hayatınızda kararlılık ve sabır ile başarılar elde edeceksiniz.",
    face: "Yüz falında özellikleriniz, sezgisel güçlerinizin gelişmiş olduğunu yansıtıyor. İçgüdülerinize güvenin, size doğru yolu gösterecekler.",
    dream: "Rüya tabirinde gördüğünüz öğeler, iç dünyanızı ve bilinçaltınızı temsil ediyor. Bu rüyalar size önemli mesajlar veriyor."
  },
  {
    coffee: "Kahve fincanındaki işaretler, yakın gelecekte aşk hayatınızda güzel gelişmeler olacağını gösteriyor. Sabırlı olun, güzel günler yakın.",
    hand: "El çizgileriniz, kariyer hayatınızda yükselme dönemi yaşayacağınızı işaret ediyor. Yeni fırsatlar karşınıza çıkacak.",
    face: "Yüz özellikleriniz, liderlik yeteneklerinizin gelişmiş olduğunu gösteriyor. İnsanları yönlendirme konusunda başarılı olacaksınız.",
    dream: "Rüyalarınız, gelecekte olacak olayların habercisi. Bu rüyaları not alın, size rehberlik edecekler."
  },
  {
    coffee: "Kahve falında gördüğünüz figürler, sağlığınıza dikkat etmeniz gerektiğini işaret ediyor. Spor ve beslenme konularında kendinizi geliştirin.",
    hand: "El çizgileriniz, para konusunda dikkatli olmanız gerektiğini gösteriyor. Tasarruf yapın ve gereksiz harcamalardan kaçının.",
    face: "Yüz hatlarınız, sosyal ilişkilerinizin güçlü olduğunu yansıtıyor. Çevrenizde sevilen bir kişi olacaksınız.",
    dream: "Rüya tabirinde gördüğünüz semboller, içsel huzurunuzu ve mutluluğunuzu temsil ediyor. Bu rüyalar size pozitif enerji veriyor."
  }
];

// Rastgele fallback seçimi için yardımcı fonksiyon
function getRandomFallback(fallbacks: any[]) {
  return fallbacks[Math.floor(Math.random() * fallbacks.length)];
}

// AI Chat endpoint
router.post('/', [
  body('message').notEmpty().withMessage('Mesaj boş olamaz'),
  body('topic').notEmpty().withMessage('Konu belirtilmelidir')
], authenticateToken, checkFortuneLimits('AI_CHAT'), async (req: express.Request, res: express.Response) => {
  try {
    // Validation kontrolü
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation hatası',
        errors: errors.array()
      });
    }

    const { message, topic } = req.body;

    // Konu kontrolü - sadece izin verilen konularda soru sorulabilir
    const allowedTopics = [
      'kahve falı', 'el falı', 'yüz falı', 'rüya tabiri', 'tarot',
      'fal', 'kahve', 'el', 'yüz', 'rüya', 'kart'
    ];

    const isTopicAllowed = allowedTopics.some(allowedTopic => 
      message.toLowerCase().includes(allowedTopic)
    );

    if (!isTopicAllowed) {
      return res.status(400).json({
        success: false,
        message: 'Bu konuda soru soramazsınız. Sadece fal ve rüya tabiri konularında soru sorabilirsiniz.'
      });
    }

    try {
      // Google AI ile yanıt al - güncellenmiş model
      const model = googleAI.getGenerativeModel({ model: AI_CONFIG.google.model });

      const prompt = `Sen fal, rüya tabiri ve tarot kartları konusunda uzman bir falcısın. Sadece bu konularda sorulara cevap ver. Diğer konularda cevap verme.

Kullanıcının sorusu: "${message}"

Lütfen fal, rüya tabiri ve tarot kartları konusunda detaylı, kültürel açıdan zengin ve yardımcı bir yanıt ver. Yanıtın Türkçe olması gerekiyor ve 150-200 kelime arasında olmalı.`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const aiResponse = response.text();

      // Fal kullanımını kaydet
      await recordFortuneUsage('AI_CHAT')(req, res, () => {});

      return res.json({
        success: true,
        message: 'AI yanıtı başarıyla alındı',
        response: aiResponse,
        topic: topic,
        timestamp: new Date().toISOString()
      });

    } catch (aiError) {
      console.error('Google AI Error:', aiError);
      
      // AI hatası durumunda rastgele fallback response döndür
      const randomFallback = getRandomFallback(AI_CHAT_FALLBACKS);
      let fallbackResponse = '';
      
      if (message.toLowerCase().includes('kahve') || message.toLowerCase().includes('kahve falı')) {
        fallbackResponse = randomFallback.coffee;
      } else if (message.toLowerCase().includes('el') || message.toLowerCase().includes('el falı')) {
        fallbackResponse = randomFallback.hand;
      } else if (message.toLowerCase().includes('yüz') || message.toLowerCase().includes('yüz falı')) {
        fallbackResponse = randomFallback.face;
      } else if (message.toLowerCase().includes('rüya') || message.toLowerCase().includes('rüya tabiri')) {
        fallbackResponse = randomFallback.dream;
      } else {
        fallbackResponse = `Fal ve rüya tabiri konusunda size yardımcı olmaya çalışıyorum. ${randomFallback.coffee} Lütfen daha spesifik bir soru sorun.`;
      }

      return res.json({
        success: true,
        message: 'AI yanıtı alınamadı, fallback yanıt kullanıldı',
        response: fallbackResponse,
        topic: topic,
        timestamp: new Date().toISOString(),
        fallback: true
      });
    }

  } catch (error) {
    console.error('AI Chat Error:', error);
    return res.status(500).json({
      success: false,
      message: 'AI servisinde hata oluştu',
      error: error instanceof Error ? error.message : 'Bilinmeyen hata'
    });
  }
});

export default router;
