import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Günlük fal hakları
export const DAILY_LIMITS = {
  HAND: 3,      // El falı
  FACE: 3,      // Yüz falı
  COFFEE: 3,    // Kahve falı
  TAROT: 3,     // Tarot kartları
  AI_CHAT: 3    // AI sohbet
};

// Fal haklarını kontrol et
export const checkFortuneLimits = (type: string) => {
  return async (req: any, res: Response, next: NextFunction) => {
    try {
      console.log(`🔍 Checking fortune limits for type: ${type}`);
      const userId = req.user.id;
      const fortuneType = type.toUpperCase();
      
      // Kullanıcı bilgilerini al
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
          dailyFreeFortunes: true,
          coins: true,
          lastResetDate: true
        }
      });
      
      if (!user) {
        console.log('❌ User not found');
        return res.status(404).json({
          success: false,
          message: 'Kullanıcı bulunamadı'
        });
      }
      
      console.log('👤 User data:', {
        dailyFreeFortunes: user.dailyFreeFortunes,
        coins: user.coins,
        lastResetDate: user.lastResetDate
      });
      
      // Günlük hakları sıfırla (eğer yeni gün ise)
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const lastReset = user.lastResetDate ? new Date(user.lastResetDate) : new Date(0);
      lastReset.setHours(0, 0, 0, 0);
      
      if (today > lastReset) {
        console.log('🔄 Resetting daily fortunes for new day');
        await prisma.user.update({
          where: { id: userId },
          data: {
            dailyFreeFortunes: 3, // Günlük 3 ücretsiz fal
            lastResetDate: today
          }
        });
        user.dailyFreeFortunes = 3;
      }
      
      // Hak kontrolü
      const hasFreeFortunes = user.dailyFreeFortunes > 0;
      const hasEnoughCoins = user.coins >= 10; // 10 coin = 1 fal
      
      console.log('🔍 Rights check:', {
        hasFreeFortunes,
        hasEnoughCoins,
        freeFortunes: user.dailyFreeFortunes,
        coins: user.coins
      });
      
      if (!hasFreeFortunes && !hasEnoughCoins) {
        console.log('❌ No rights available');
        return res.status(403).json({
          success: false,
          message: 'Fal hakkınız kalmadı. Coin satın alın veya yarın tekrar deneyin.',
          needCoins: true,
          freeFortunes: user.dailyFreeFortunes,
          coins: user.coins,
          requiredCoins: 10
        });
      }
      
      console.log('✅ Fortune limits check passed');
      next();
      return; // Explicit return for TypeScript
    } catch (error) {
      console.error('❌ Error checking fortune limits:', error);
      return res.status(500).json({
        success: false,
        message: 'Fal hakları kontrol edilemedi'
      });
    }
  };
};

// Fal kullanımını kaydet
export const recordFortuneUsage = (type: string) => {
  return async (req: any, res: Response, next: NextFunction) => {
    try {
      console.log(`📝 Recording fortune usage for type: ${type}`);
      const userId = req.user.id;
      const fortuneType = type.toUpperCase();
      
      // Kullanıcı bilgilerini al
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
          dailyFreeFortunes: true,
          coins: true
        }
      });
      
      if (!user) {
        console.log('❌ User not found for recording usage');
        return res.status(404).json({
          success: false,
          message: 'Kullanıcı bulunamadı'
        });
      }
      
      console.log('👤 User before usage:', {
        dailyFreeFortunes: user.dailyFreeFortunes,
        coins: user.coins
      });
      
      // Önce ücretsiz hakları kullan, sonra coin
      if (user.dailyFreeFortunes > 0) {
        console.log('🆓 Using free fortune');
        await prisma.user.update({
          where: { id: userId },
          data: {
            dailyFreeFortunes: {
              decrement: 1
            }
          }
        });
      } else if (user.coins >= 10) {
        console.log('💰 Using coins for fortune');
        await prisma.user.update({
          where: { id: userId },
          data: {
            coins: {
              decrement: 10
            }
          }
        });
        
        // Coin harcamasını kaydet
        await prisma.coinHistory.create({
          data: {
            userId,
            type: 'SPENT',
            amount: -10,
            balance: user.coins - 10,
            description: `${fortuneType} falı için coin harcandı`
          }
        });
      } else {
        console.log('❌ No rights available for recording');
        return res.status(403).json({
          success: false,
          message: 'Fal hakkınız kalmadı'
        });
      }
      
      console.log('✅ Fortune usage recorded successfully');
      return next();
    } catch (error) {
      console.error('❌ Error recording fortune usage:', error);
      return res.status(500).json({
        success: false,
        message: 'Fal kullanımı kaydedilemedi'
      });
    }
  };
};

// Kullanıcının fal haklarını getir
export const getUserFortuneLimits = async (userId: string) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  const limits = [];
  
  for (const [type, dailyLimit] of Object.entries(DAILY_LIMITS)) {
    // Bugün kullanılan hakları say
    const usedCount = await prisma.fortuneUsage.count({
      where: {
        userId,
        type,
        usedAt: {
          gte: today,
          lt: tomorrow
        }
      }
    });
    
    // Satın alınan ek hakları say
    const extraRights = await prisma.fortuneUsage.count({
      where: {
        userId,
        type,
        cost: 0,
        usedAt: {
          gte: new Date()
        }
      }
    });
    
    const totalAvailable = dailyLimit + extraRights;
    const remaining = Math.max(0, totalAvailable - usedCount);
    
    limits.push({
      type,
      dailyLimit,
      used: usedCount,
      extraRights,
      totalAvailable,
      remaining
    });
  }
  
  return limits;
};

// Günlük fal haklarını sıfırla
export const resetDailyFortuneLimits = async () => {
  try {
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000);
    
    await prisma.fortuneUsage.deleteMany({
      where: {
        usedAt: {
          lt: yesterday
        }
      }
    });
    
    console.log('Daily fortune limits reset successfully');
  } catch (error) {
    console.error('Error resetting daily fortune limits:', error);
  }
};
