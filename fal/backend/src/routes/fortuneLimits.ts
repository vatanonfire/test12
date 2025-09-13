import express from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateToken } from '../middleware/auth';
import { checkFortuneLimits, recordFortuneUsage, getUserFortuneLimits } from '../middleware/fortuneLimits';

const router = express.Router();
const prisma = new PrismaClient();

// Kullanıcının tüm fal haklarını getir
router.get('/', authenticateToken, async (req: any, res) => {
  try {
    const limits = await getUserFortuneLimits(req.user.id);
    res.json({
      success: true,
      data: limits
    });
  } catch (error) {
    console.error('Error fetching fortune limits:', error);
    res.status(500).json({
      success: false,
      message: 'Fal hakları getirilemedi'
    });
  }
});

// Belirli bir fal türü için hakları getir
router.get('/:type', authenticateToken, async (req: any, res) => {
  try {
    const { type } = req.params;
    const limits = await getUserFortuneLimits(req.user.id);
    
    const typeLimit = limits.find(limit => limit.type === type.toUpperCase());
    
    if (!typeLimit) {
      return res.status(400).json({
        success: false,
        message: 'Geçersiz fal türü'
      });
    }
    
    return res.json({
      success: true,
      data: typeLimit
    });
  } catch (error) {
    console.error('Error fetching fortune limit:', error);
    return res.status(500).json({
      success: false,
      message: 'Fal hakkı getirilemedi'
    });
  }
});

// Ek hak satın al
router.post('/buy-extra', authenticateToken, async (req: any, res) => {
  try {
    const { type, amount, cost } = req.body;
    
    if (!type || !amount || !cost) {
      return res.status(400).json({
        success: false,
        message: 'Eksik parametreler'
      });
    }
    
    // Kullanıcının coin bakiyesini kontrol et
    const user = await prisma.user.findUnique({
      where: { id: req.user.id }
    });
    
    if (!user || user.coins < cost) {
      return res.status(400).json({
        success: false,
        message: 'Yetersiz coin bakiyesi'
      });
    }
    
    // Transaction ile coin düş ve hak ekle
    const result = await prisma.$transaction(async (tx) => {
      // Coin düş
      const updatedUser = await tx.user.update({
        where: { id: req.user.id },
        data: { coins: { decrement: cost } }
      });
      
      // Hak ekle
      const fortuneUsage = await tx.fortuneUsage.create({
        data: {
          userId: req.user.id,
          type: type.toUpperCase(),
          cost: 0, // Satın alınan haklar ücretsiz
          usedAt: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 saat sonra kullanılabilir
        }
      });
      
      return { updatedUser, fortuneUsage };
    });
    
    return res.json({
      success: true,
      message: `${amount} hak başarıyla satın alındı`,
      data: result
    });
  } catch (error) {
    console.error('Error buying extra rights:', error);
    return res.status(500).json({
      success: false,
      message: 'Hak satın alınamadı'
    });
  }
});

// Günlük hakları sıfırla (Admin only)
router.post('/reset-daily', authenticateToken, async (req: any, res) => {
  try {
    // Admin kontrolü
    const user = await prisma.user.findUnique({
      where: { id: req.user.id }
    });
    
    if (!user || user.role !== 'ADMIN') {
      return res.status(403).json({
        success: false,
        message: 'Bu işlem için yetkiniz yok'
      });
    }
    
    // 24 saatten eski kullanımları sil
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000);
    
    await prisma.fortuneUsage.deleteMany({
      where: {
        usedAt: {
          lt: yesterday
        }
      }
    });
    
    return res.json({
      success: true,
      message: 'Günlük haklar sıfırlandı'
    });
  } catch (error) {
    console.error('Error resetting daily limits:', error);
    return res.status(500).json({
      success: false,
      message: 'Günlük haklar sıfırlanamadı'
    });
  }
});

export default router;
