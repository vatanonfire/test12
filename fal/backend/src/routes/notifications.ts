import express from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();
const prisma = new PrismaClient();

// Kullanıcının bildirimlerini getir
router.get('/', authenticateToken, async (req: any, res: any) => {
  try {
    const userId = req.user.id;

    const notifications = await prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: {
        admin: {
          select: {
            name: true,
            email: true
          }
        }
      }
    });

    res.json({
      success: true,
      data: { notifications }
    });
  } catch (error) {
    console.error('Fetch notifications error:', error);
    res.status(500).json({
      success: false,
      message: 'Bildirimler yüklenirken hata oluştu'
    });
  }
});

// Okunmamış bildirim sayısını getir
router.get('/unread-count', authenticateToken, async (req: any, res: any) => {
  try {
    const userId = req.user.id;

    const count = await prisma.notification.count({
      where: { 
        userId,
        isRead: false
      }
    });

    res.json({
      success: true,
      data: { count }
    });
  } catch (error) {
    console.error('Fetch unread count error:', error);
    res.status(500).json({
      success: false,
      message: 'Okunmamış bildirim sayısı alınırken hata oluştu'
    });
  }
});

// Bildirimi okundu olarak işaretle
router.patch('/:id/read', authenticateToken, async (req: any, res: any) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const notification = await prisma.notification.findFirst({
      where: { id, userId }
    });

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Bildirim bulunamadı'
      });
    }

    await prisma.notification.update({
      where: { id },
      data: { isRead: true }
    });

    res.json({
      success: true,
      message: 'Bildirim okundu olarak işaretlendi'
    });
  } catch (error) {
    console.error('Mark as read error:', error);
    res.status(500).json({
      success: false,
      message: 'Bildirim güncellenirken hata oluştu'
    });
  }
});

// Tüm bildirimleri okundu olarak işaretle
router.patch('/read-all', authenticateToken, async (req: any, res: any) => {
  try {
    const userId = req.user.id;

    await prisma.notification.updateMany({
      where: { userId, isRead: false },
      data: { isRead: true }
    });

    res.json({
      success: true,
      message: 'Tüm bildirimler okundu olarak işaretlendi'
    });
  } catch (error) {
    console.error('Mark all as read error:', error);
    res.status(500).json({
      success: false,
      message: 'Bildirimler güncellenirken hata oluştu'
    });
  }
});

// Bildirimi sil
router.delete('/:id', authenticateToken, async (req: any, res: any) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const notification = await prisma.notification.findFirst({
      where: { id, userId }
    });

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Bildirim bulunamadı'
      });
    }

    await prisma.notification.delete({
      where: { id }
    });

    res.json({
      success: true,
      message: 'Bildirim silindi'
    });
  } catch (error) {
    console.error('Delete notification error:', error);
    res.status(500).json({
      success: false,
      message: 'Bildirim silinirken hata oluştu'
    });
  }
});

export default router;
