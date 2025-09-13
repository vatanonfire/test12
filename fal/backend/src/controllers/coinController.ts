import { Request, Response } from 'express';
import { prisma } from '../config/database';

interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
  };
}

// Get coin packages
export const getCoinPackages = async (req: Request, res: Response) => {
  try {
    const packages = await prisma.coinPackage.findMany({
      where: { isActive: true },
      orderBy: { price: 'asc' }
    });

    return res.json({
      success: true,
      data: { packages }
    });
  } catch (error) {
    console.error('Get coin packages error:', error);
    return res.status(500).json({
      success: false,
      message: 'Coin paketleri alınırken hata oluştu'
    });
  }
};

// Get user's coin balance
export const getUserCoins = async (req: AuthRequest, res: Response) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user!.id },
      select: {
        coins: true,
        dailyFreeFortunes: true,
        dailyAiQuestions: true
      }
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Kullanıcı bulunamadı'
      });
    }

    return res.json({
      success: true,
      data: {
        coins: user.coins,
        dailyFreeFortunes: user.dailyFreeFortunes,
        dailyAiQuestions: user.dailyAiQuestions
      }
    });
  } catch (error) {
    console.error('Get user coins error:', error);
    return res.status(500).json({
      success: false,
      message: 'Coin bilgileri alınırken hata oluştu'
    });
  }
};

// Get user's transaction history
export const getTransactionHistory = async (req: AuthRequest, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const transactions = await prisma.transaction.findMany({
      where: { userId: req.user!.id },
      include: {
        coinPackage: {
          select: {
            name: true,
            coins: true,
            price: true
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit
    });

    const total = await prisma.transaction.count({
      where: { userId: req.user!.id }
    });

    return res.json({
      success: true,
      data: {
        transactions,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    console.error('Get transaction history error:', error);
    return res.status(500).json({
      success: false,
      message: 'İşlem geçmişi alınırken hata oluştu'
    });
  }
};

// Simulate coin purchase (for testing)
export const purchaseCoins = async (req: AuthRequest, res: Response) => {
  try {
    const { packageId } = req.body;

    const coinPackage = await prisma.coinPackage.findUnique({
      where: { id: packageId }
    });

    if (!coinPackage || !coinPackage.isActive) {
      return res.status(404).json({
        success: false,
        message: 'Coin paketi bulunamadı'
      });
    }

    // Create transaction
    const transaction = await prisma.transaction.create({
      data: {
        userId: req.user!.id,
        coinPackageId: packageId,
        amount: coinPackage.price,
        coins: coinPackage.coins,
        paymentMethod: 'STRIPE',
        paymentId: `test_${Date.now()}`,
        status: 'COMPLETED',
        description: `${coinPackage.name} paketi satın alındı`
      }
    });

    // Update user's coin balance
    await prisma.user.update({
      where: { id: req.user!.id },
      data: {
        coins: {
          increment: coinPackage.coins
        }
      }
    });

    return res.json({
      success: true,
      message: 'Coin satın alma başarılı',
      data: {
        transaction,
        coinsAdded: coinPackage.coins
      }
    });
  } catch (error) {
    console.error('Purchase coins error:', error);
    return res.status(500).json({
      success: false,
      message: 'Coin satın alma sırasında hata oluştu'
    });
  }
};

// Get user transactions (alias for getTransactionHistory)
export const getUserTransactions = getTransactionHistory;

// Add coins to user (admin function)
export const addCoinsToUser = async (req: AuthRequest, res: Response) => {
  try {
    const { userId, amount, reason } = req.body;

    if (!userId || !amount) {
      return res.status(400).json({
        success: false,
        message: 'Kullanıcı ID ve miktar gerekli'
      });
    }

    // Update user's coin balance
    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        coins: {
          increment: amount
        }
      }
    });

    // Record coin addition
    await prisma.coinHistory.create({
      data: {
        userId,
        type: 'ADMIN_ADD',
        amount,
        balance: user.coins,
        description: reason || 'Admin tarafından coin eklendi'
      }
    });

    return res.json({
      success: true,
      message: 'Coin başarıyla eklendi',
      data: {
        userId,
        amount,
        newBalance: user.coins
      }
    });
  } catch (error) {
    console.error('Add coins error:', error);
    return res.status(500).json({
      success: false,
      message: 'Coin ekleme sırasında hata oluştu'
    });
  }
};

// Get all transactions (admin function)
export const getAllTransactions = async (req: AuthRequest, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const transactions = await prisma.transaction.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        coinPackage: {
          select: {
            name: true,
            coins: true,
            price: true
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit
    });

    const total = await prisma.transaction.count();

    return res.json({
      success: true,
      data: {
        transactions,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    console.error('Get all transactions error:', error);
    return res.status(500).json({
      success: false,
      message: 'İşlemler alınırken hata oluştu'
    });
  }
};

// Get package sales stats (admin function)
export const getPackageSalesStats = async (req: AuthRequest, res: Response) => {
  try {
    const stats = await prisma.transaction.groupBy({
      by: ['coinPackageId'],
      _count: {
        id: true
      },
      _sum: {
        amount: true,
        coins: true
      },
      where: {
        status: 'COMPLETED'
      }
    });

    const packages = await prisma.coinPackage.findMany({
      where: { isActive: true }
    });

    const packageStats = stats.map(stat => {
      const packageInfo = packages.find(p => p.id === stat.coinPackageId);
      return {
        packageId: stat.coinPackageId,
        packageName: packageInfo?.name || 'Unknown',
        salesCount: stat._count.id,
        totalRevenue: stat._sum.amount || 0,
        totalCoinsSold: stat._sum.coins || 0
      };
    });

    return res.json({
      success: true,
      data: { packageStats }
    });
  } catch (error) {
    console.error('Get package stats error:', error);
    return res.status(500).json({
      success: false,
      message: 'Paket istatistikleri alınırken hata oluştu'
    });
  }
};

// Create coin package (admin function)
export const createCoinPackage = async (req: AuthRequest, res: Response) => {
  try {
    const { name, coins, price, description, discount } = req.body;

    const coinPackage = await prisma.coinPackage.create({
      data: {
        name,
        coins,
        price,
        description,
        discount: discount || 0
      }
    });

    return res.json({
      success: true,
      message: 'Coin paketi başarıyla oluşturuldu',
      data: { coinPackage }
    });
  } catch (error) {
    console.error('Create coin package error:', error);
    return res.status(500).json({
      success: false,
      message: 'Coin paketi oluşturulurken hata oluştu'
    });
  }
};

// Update coin package (admin function)
export const updateCoinPackage = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { name, coins, price, description, discount, isActive } = req.body;

    const coinPackage = await prisma.coinPackage.update({
      where: { id },
      data: {
        name,
        coins,
        price,
        description,
        discount,
        isActive
      }
    });

    return res.json({
      success: true,
      message: 'Coin paketi başarıyla güncellendi',
      data: { coinPackage }
    });
  } catch (error) {
    console.error('Update coin package error:', error);
    return res.status(500).json({
      success: false,
      message: 'Coin paketi güncellenirken hata oluştu'
    });
  }
};

// Delete coin package (admin function)
export const deleteCoinPackage = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    await prisma.coinPackage.delete({
      where: { id }
    });

    return res.json({
      success: true,
      message: 'Coin paketi başarıyla silindi'
    });
  } catch (error) {
    console.error('Delete coin package error:', error);
    return res.status(500).json({
      success: false,
      message: 'Coin paketi silinirken hata oluştu'
    });
  }
};

