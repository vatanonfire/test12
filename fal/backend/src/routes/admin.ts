import express from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateToken } from '../middleware/auth';
import { body, validationResult } from 'express-validator';

const router = express.Router();
const prisma = new PrismaClient();

// Admin middleware - sadece admin kullanıcılar erişebilir
const adminOnly = async (req: any, res: any, next: any) => {
  try {
    if (req.user.role !== 'ADMIN') {
      return res.status(403).json({ 
        success: false, 
        message: 'Bu işlem için admin yetkisi gereklidir' 
      });
    }
    next();
  } catch (error) {
    return res.status(500).json({ 
      success: false, 
      message: 'Yetki kontrolü sırasında hata oluştu' 
    });
  }
};

// Kullanıcı listesi - Admin için
router.get('/users', authenticateToken, adminOnly, async (req: any, res: any) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        isActive: true,
        coins: true,
        createdAt: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    res.json({
      success: true,
      data: { users }
    });
  } catch (error) {
    console.error('Admin Users Error:', error);
    res.status(500).json({
      success: false,
      message: 'Kullanıcılar yüklenirken hata oluştu'
    });
  }
});

// Sistem istatistikleri - Admin için
router.get('/stats', authenticateToken, adminOnly, async (req: any, res: any) => {
  try {
    const [
      totalUsers,
      activeUsers,
      inactiveUsers
    ] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { isActive: true } }),
      prisma.user.count({ where: { isActive: false } })
    ]);

    const stats = {
      users: {
        total: totalUsers,
        active: activeUsers,
        inactive: inactiveUsers
      }
    };

    res.json({
      success: true,
      data: { stats }
    });
  } catch (error) {
    console.error('Admin Stats Error:', error);
    res.status(500).json({
      success: false,
      message: 'İstatistikler yüklenirken hata oluştu'
    });
  }
});

// Kullanıcıya coin gönderme - Admin için
router.post('/send-coins', authenticateToken, adminOnly, [
  body('userId').isString().notEmpty().withMessage('Kullanıcı ID gerekli'),
  body('amount').isInt({ min: 1 }).withMessage('Geçerli coin miktarı gerekli'),
  body('message').optional().isString().trim().isLength({ max: 200 }).withMessage('Mesaj 200 karakterden uzun olamaz')
], async (req: any, res: any) => {
  try {
    // Validation kontrolü
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Geçersiz veri',
        errors: errors.array()
      });
    }

    const { userId, amount, message } = req.body;
    const adminId = req.user.id;

    // Kullanıcıyı bul
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, name: true, coins: true }
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Kullanıcı bulunamadı'
      });
    }

    // Coin gönderimi işlemi
    const result = await prisma.$transaction(async (tx) => {
      // Kullanıcının coin'lerini güncelle
      const updatedUser = await tx.user.update({
        where: { id: userId },
        data: { coins: { increment: amount } },
        select: { id: true, name: true, coins: true }
      });

      // Coin geçmişi oluştur
      const coinHistory = await tx.coinHistory.create({
        data: {
          userId: userId,
          type: 'ADMIN_SEND',
          amount: amount,
          balance: updatedUser.coins,
          description: message || `Admin tarafından ${amount} coin gönderildi`
        }
      });

      // Bildirim oluştur
      const notification = await tx.notification.create({
        data: {
          userId: userId,
          adminId: adminId,
          title: 'Coin Gönderildi',
          message: message || `Admin tarafından ${amount} coin gönderildi`,
          type: 'COIN',
          priority: 'NORMAL',
          category: 'ADMIN_COIN'
        }
      });

      return { updatedUser, coinHistory, notification };
    });

    // Başarılı yanıt
    res.json({
      success: true,
      message: `${user.name} kullanıcısına ${amount} coin başarıyla gönderildi`,
      data: {
        user: result.updatedUser,
        coinHistory: result.coinHistory
      }
    });

  } catch (error) {
    console.error('Admin Send Coins Error:', error);
    res.status(500).json({
      success: false,
      message: 'Coin gönderimi sırasında hata oluştu'
    });
  }
});

// Tüm kullanıcılara bildirim gönder - Admin için (geçici olarak devre dışı)
router.post('/send-notification', authenticateToken, adminOnly, [
  body('title').isString().notEmpty().withMessage('Başlık gerekli'),
  body('message').isString().notEmpty().withMessage('Mesaj gerekli'),
  body('type').isString().isIn(['SYSTEM', 'ADMIN', 'GENERAL']).withMessage('Geçersiz bildirim türü'),
  body('priority').optional().isString().isIn(['LOW', 'NORMAL', 'HIGH', 'URGENT']).withMessage('Geçersiz öncelik'),
  body('category').optional().isString().trim().isLength({ max: 50 }).withMessage('Kategori 50 karakterden uzun olamaz'),
  body('userId').optional().isString().withMessage('Geçersiz kullanıcı ID'),
  body('expiresAt').optional().isISO8601().withMessage('Geçersiz tarih formatı')
], async (req: any, res: any) => {
  try {
    // Validation kontrolü
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Geçersiz veri',
        errors: errors.array()
      });
    }

    const { title, message, type, priority = 'NORMAL', category, userId, expiresAt } = req.body;
    const adminId = req.user.id;

    // Bildirim oluştur
    const notificationData: any = {
      title,
      message,
      type,
      priority,
      category,
      adminId,
      expiresAt: expiresAt ? new Date(expiresAt) : null
    };

    if (userId) {
      // Tek kullanıcıya bildirim
      notificationData.userId = userId;
      const notification = await prisma.notification.create({
        data: notificationData
      });

      res.json({
        success: true,
        message: 'Bildirim başarıyla gönderildi',
        data: { notification }
      });
    } else {
      // Tüm kullanıcılara bildirim
      const users = await prisma.user.findMany({
        select: { id: true }
      });

      const notifications = await Promise.all(
        users.map(user => 
          prisma.notification.create({
            data: {
              ...notificationData,
              userId: user.id
            }
          })
        )
      );

      res.json({
        success: true,
        message: `Bildirim ${users.length} kullanıcıya başarıyla gönderildi`,
        data: { notifications }
      });
    }

  } catch (error) {
    console.error('Admin Send Notification Error:', error);
    res.status(500).json({
      success: false,
      message: 'Bildirim gönderimi sırasında hata oluştu'
    });
  }
});

// Bildirim istatistikleri - Admin için (geçici olarak devre dışı)
router.get('/notification-stats', authenticateToken, adminOnly, async (req: any, res: any) => {
  try {
    // Bildirim istatistikleri
    const totalNotifications = await prisma.notification.count();
    const unreadNotifications = await prisma.notification.count({
      where: { isRead: false }
    });
    const readNotifications = await prisma.notification.count({
      where: { isRead: true }
    });

    const notificationsByType = await prisma.notification.groupBy({
      by: ['type'],
      _count: {
        type: true
      }
    });

    const notificationsByPriority = await prisma.notification.groupBy({
      by: ['priority'],
      _count: {
        priority: true
      }
    });

    res.json({
      success: true,
      data: {
        total: totalNotifications,
        unread: unreadNotifications,
        read: readNotifications,
        byType: notificationsByType,
        byPriority: notificationsByPriority
      }
    });
  } catch (error) {
    console.error('Admin Notification Stats Error:', error);
    res.status(500).json({
      success: false,
      message: 'Bildirim istatistikleri yüklenirken hata oluştu'
    });
  }
});

// Kullanıcı güncelleme - Admin için
router.put('/users/:id', authenticateToken, adminOnly, async (req: any, res: any) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    // Güncellenebilir alanları kontrol et
    const allowedUpdates = ['isActive', 'role', 'coins'];
    const filteredUpdates: any = {};
    
    Object.keys(updates).forEach(key => {
      if (allowedUpdates.includes(key)) {
        filteredUpdates[key] = updates[key];
      }
    });

    if (Object.keys(filteredUpdates).length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Güncellenebilir alan bulunamadı'
      });
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: filteredUpdates,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isActive: true,
        coins: true,
        createdAt: true
      }
    });

    res.json({
      success: true,
      message: 'Kullanıcı başarıyla güncellendi',
      data: { user: updatedUser }
    });

  } catch (error) {
    console.error('Admin User Update Error:', error);
    res.status(500).json({
      success: false,
      message: 'Kullanıcı güncellenirken hata oluştu'
    });
  }
});

// Kullanıcı silme - Admin için
router.delete('/users/:id', authenticateToken, adminOnly, async (req: any, res: any) => {
  try {
    const { id } = req.params;

    // Kullanıcıyı bul
    const user = await prisma.user.findUnique({
      where: { id },
      select: { id: true, name: true, role: true }
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Kullanıcı bulunamadı'
      });
    }

    // Admin kendisini silemesin
    if (user.role === 'ADMIN') {
      return res.status(400).json({
        success: false,
        message: 'Admin kullanıcılar silinemez'
      });
    }

    // Kullanıcıyı sil
    await prisma.user.delete({
      where: { id }
    });

    res.json({
      success: true,
      message: `${user.name} kullanıcısı başarıyla silindi`
    });

  } catch (error) {
    console.error('Admin User Delete Error:', error);
    res.status(500).json({
      success: false,
      message: 'Kullanıcı silinirken hata oluştu'
    });
  }
});

export default router;
