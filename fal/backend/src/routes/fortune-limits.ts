import express from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateToken } from '../middleware/auth';
import { getUserFortuneLimits } from '../middleware/fortuneLimits';

const router = express.Router();
const prisma = new PrismaClient();

// Kullanıcının fal haklarını getir
router.get('/', authenticateToken, async (req: any, res: any) => {
  try {
    const userId = req.user.id;
    const limits = await getUserFortuneLimits(userId);

    res.json({
      success: true,
      data: { limits }
    });
  } catch (error) {
    console.error('Fal hakları getirme hatası:', error);
    res.status(500).json({
      success: false,
      message: 'Fal hakları alınırken hata oluştu'
    });
  }
});

// Belirli bir fal türünün haklarını getir
router.get('/:type', authenticateToken, async (req: any, res: any) => {
  try {
    const userId = req.user.id;
    const { type } = req.params;

    const limits = await getUserFortuneLimits(userId);
    const typeLimit = limits[type];

    if (!typeLimit) {
      return res.status(400).json({
        success: false,
        message: 'Geçersiz fal türü'
      });
    }

    res.json({
      success: true,
      data: { 
        ...typeLimit
      }
    });
  } catch (error) {
    console.error('Fal türü hakları getirme hatası:', error);
    res.status(500).json({
      success: false,
      message: 'Fal hakları alınırken hata oluştu'
    });
  }
});

// Coin ile ek hak satın al
router.post('/buy-extra', authenticateToken, async (req: any, res: any) => {
  try {
    const userId = req.user.id;
    const { type, amount = 1 } = req.body;

    if (!type || !amount || amount < 1) {
      return res.status(400).json({
        success: false,
        message: 'Geçersiz parametreler'
      });
    }

    // Coin maliyeti (1 hak = 10 coin)
    const cost = amount * 10;

    // Kullanıcının coin'ini kontrol et
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user || user.coins < cost) {
      return res.status(400).json({
        success: false,
        message: 'Yetersiz coin bakiyesi',
        required: cost,
        current: user?.coins || 0
      });
    }

    // Transaction ile coin düş ve ek hak ekle
    const result = await prisma.$transaction(async (tx) => {
      // Coin'i düş
      const updatedUser = await tx.user.update({
        where: { id: userId },
        data: { coins: user.coins - cost }
      });

      // Coin geçmişi oluştur
      await tx.coinHistory.create({
        data: {
          userId,
          type: 'FORTUNE_EXTRA',
          amount: -cost,
          balance: updatedUser.coins,
          description: `${type} falı için ${amount} ek hak satın alındı`
        }
      });

      // Ek hakları ekle (gelecek günler için)
      const extraHaklar = [];
      for (let i = 0; i < amount; i++) {
        const futureDate = new Date();
        futureDate.setDate(futureDate.getDate() + i + 1);
        
        extraHaklar.push({
          userId,
          type,
          usedAt: futureDate,
          cost: -1, // Negatif değer = ek hak
          isExtra: true
        });
      }

      await tx.fortuneUsage.createMany({
        data: extraHaklar
      });

      return { updatedUser, extraHaklar };
    });

    res.json({
      success: true,
      message: `${amount} ek hak başarıyla satın alındı`,
      data: {
        newBalance: result.updatedUser.coins,
        extraHaklar: amount,
        type
      }
    });

  } catch (error) {
    console.error('Ek hak satın alma hatası:', error);
    res.status(500).json({
      success: false,
      message: 'Ek hak satın alınırken hata oluştu'
    });
  }
});

// Günlük hakları sıfırla (admin için)
router.post('/reset-daily', authenticateToken, async (req: any, res: any) => {
  try {
    const user = req.user;
    
    if (user.role !== 'ADMIN') {
      return res.status(403).json({
        success: false,
        message: 'Bu işlem için admin yetkisi gerekli'
      });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    // Dün kullanılan fal haklarını temizle
    const deletedCount = await prisma.fortuneUsage.deleteMany({
      where: {
        usedAt: {
          lt: today
        }
      }
    });

    res.json({
      success: true,
      message: 'Günlük fal hakları sıfırlandı',
      data: {
        deletedCount: deletedCount.count
      }
    });

  } catch (error) {
    console.error('Günlük hakları sıfırlama hatası:', error);
    res.status(500).json({
      success: false,
      message: 'Günlük haklar sıfırlanırken hata oluştu'
    });
  }
});

export default router;
