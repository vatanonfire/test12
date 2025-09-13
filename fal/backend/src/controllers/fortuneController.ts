import { Request, Response } from 'express';
import { prisma } from '../config/database';
import path from 'path';
import fs from 'fs';

interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
  };
}

// Fortune telling prompts for different types
const fortunePrompts = {
  HAND: `Sen deneyimli bir el falı uzmanısın. Verilen el fotoğrafını analiz ederek detaylı bir fal yorumu yap. 
  Şu konuları kapsa: aşk hayatı, kariyer, sağlık, finansal durum, kişilik özellikleri. 
  Yorumun pozitif ve yapıcı olsun, gelecekteki fırsatları vurgula. 
  Fotoğraf net değilse bunu belirt ve genel bir yorum yap.`,
  
  FACE: `Sen deneyimli bir yüz falı uzmanısın. Verilen yüz fotoğrafını analiz ederek detaylı bir fal yorumu yap. 
  Şu konuları kapsa: karakter analizi, aşk hayatı, kariyer potansiyeli, sağlık durumu, sosyal ilişkiler. 
  Yorumun pozitif ve yapıcı olsun, kişinin güçlü yanlarını vurgula. 
  Fotoğraf net değilse bunu belirt ve genel bir yorum yap.`,
  
  COFFEE: `Sen deneyimli bir kahve falı uzmanısın. Verilen kahve fincanı fotoğrafını analiz ederek detaylı bir fal yorumu yap. 
  Fincanın içindeki şekilleri, desenleri ve sembolleri yorumla. 
  Şu konuları kapsa: yakın gelecek, aşk hayatı, kariyer, sağlık, seyahat, haberler. 
  Yorumun pozitif ve yapıcı olsun, gelecekteki fırsatları vurgula. 
  Fotoğraf net değilse bunu belirt ve genel bir yorum yap.`
};

// Read fortune from image
const readFortuneFromImage = async (imagePath: string, type: 'HAND' | 'FACE' | 'COFFEE') => {
  try {
    // For now, return a mock fortune since OpenAI integration is not fully set up
    const mockFortunes = {
      HAND: `El falınızda güçlü bir karakter ve kararlılık görüyorum. Aşk hayatınızda yakında güzel gelişmeler olacak. Kariyerinizde yükseliş dönemi başlayacak. Sağlığınıza dikkat etmeyi unutmayın.`,
      FACE: `Yüz hatlarınızdan pozitif bir enerji yayıldığını görüyorum. Sosyal ilişkileriniz güçlenecek. Yeni fırsatlar kapınızı çalacak. İçgüdülerinıza güvenin.`,
      COFFEE: `Kahve fincanınızda güzel şekiller görüyorum. Yakın gelecekte seyahat planlarınız olacak. Aşk hayatınızda romantik anlar yaşayacaksınız. Kariyerinizde başarılı adımlar atacaksınız.`
    };
    
    return mockFortunes[type];
  } catch (error) {
    console.error('Fortune reading error:', error);
    throw new Error('Fal okuma sırasında bir hata oluştu');
  }
};

// Get fortune (hand, face, coffee)
export const getFortune = async (req: AuthRequest, res: Response) => {
  try {
    const { type } = req.params;
    const userId = req.user!.id;

    // Validate fortune type
    if (!['hand', 'face', 'coffee'].includes(type)) {
      return res.status(400).json({
        success: false,
        message: 'Geçersiz fal türü'
      });
    }

    const fortuneType = type.toUpperCase() as 'HAND' | 'FACE' | 'COFFEE';

    // Check if user has free fortune left or enough coins
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        dailyFreeFortunes: true,
        coins: true
      }
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Kullanıcı bulunamadı'
      });
    }

    // Check if user has free fortunes left
    if (user.dailyFreeFortunes > 0) {
      // Use free fortune
      await prisma.user.update({
        where: { id: userId },
        data: {
          dailyFreeFortunes: {
            decrement: 1
          }
        }
      });
    } else if (user.coins >= 10) {
      // Use coins (10 coins per fortune)
      await prisma.user.update({
        where: { id: userId },
        data: {
          coins: {
            decrement: 10
          }
        }
      });

      // Record coin spending
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
      return res.status(402).json({
        success: false,
        message: 'Yeterli coin yok. Coin satın alın veya yarın tekrar deneyin.',
        data: {
          needsCoins: true,
          requiredCoins: 10,
          currentCoins: user.coins
        }
      });
    }

    // Check if file was uploaded
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Fotoğraf yüklenmedi'
      });
    }

    const imagePath = req.file.path;

    // Read fortune from image
    const fortuneResult = await readFortuneFromImage(imagePath, fortuneType);

    // Save fortune to database
    const fortune = await prisma.fortune.create({
      data: {
        userId,
        type: fortuneType,
        imageUrl: req.file.filename,
        result: fortuneResult || 'Fal okunamadı'
      }
    });

    return res.json({
      success: true,
      message: 'Fal başarıyla okundu',
      data: {
        fortune: {
          id: fortune.id,
          type: fortune.type,
          result: fortune.result,
          createdAt: fortune.createdAt
        },
        remainingFreeFortunes: Math.max(0, user.dailyFreeFortunes - 1),
        remainingCoins: user.dailyFreeFortunes > 0 ? user.coins : user.coins - 10
      }
    });
  } catch (error) {
    console.error('Fortune error:', error);
    return res.status(500).json({
      success: false,
      message: 'Fal okuma sırasında bir hata oluştu'
    });
  }
};

// Get user's fortune history
export const getFortuneHistory = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const fortunes = await prisma.fortune.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
      select: {
        id: true,
        type: true,
        result: true,
        createdAt: true
      }
    });

    const total = await prisma.fortune.count({
      where: { userId }
    });

    return res.json({
      success: true,
      data: {
        fortunes,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    console.error('Fortune history error:', error);
    return res.status(500).json({
      success: false,
      message: 'Fal geçmişi alınırken hata oluştu'
    });
  }
};

// Get specific fortune
export const getFortuneById = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user!.id;

    const fortune = await prisma.fortune.findFirst({
      where: {
        id,
        userId
      },
      select: {
        id: true,
        type: true,
        result: true,
        imageUrl: true,
        createdAt: true
      }
    });

    if (!fortune) {
      return res.status(404).json({
        success: false,
        message: 'Fal bulunamadı'
      });
    }

    return res.json({
      success: true,
      data: { fortune }
    });
  } catch (error) {
    console.error('Get fortune error:', error);
    return res.status(500).json({
      success: false,
      message: 'Fal alınırken hata oluştu'
    });
  }
};
