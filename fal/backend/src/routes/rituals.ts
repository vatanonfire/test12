import express from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();
const prisma = new PrismaClient();

// Get all rituals for a user (calendar rituals)
router.get('/', authenticateToken, async (req, res) => {
  try {
    const userId = (req as any).user.id;
    
    console.log('🔍 Backend - Fetching rituals for user:', userId);
    
    const rituals = await prisma.ritual.findMany({
      where: { userId },
      orderBy: { date: 'asc' }
    });

    console.log('✅ Backend - Found rituals:', rituals.length);
    return res.json({ success: true, data: rituals });
  } catch (error) {
    console.error('💥 Backend - Error fetching rituals:', error);
    return res.status(500).json({ success: false, message: 'Ritüeller getirilemedi' });
  }
});

// Get available rituals for purchase (dummy data)
router.get('/available', async (req, res) => {
  try {
    console.log('🔍 Backend - Fetching available rituals for purchase');
    
    // Dummy data for available rituals
    const availableRituals = [
      {
        id: 'new-moon-ritual',
        name: 'Yeni Ay Ritüeli',
        shortDescription: 'Yeni başlangıçlar ve niyet belirleme.',
        description: 'Yeni ay döneminde yapılan bu ritüel, hayatınızda yeni başlangıçlar yapmanıza ve hedeflerinizi belirlemenize yardımcı olur.',
        category: 'Ay Ritüelleri',
        difficulty: 'Kolay',
        price: 150,
        duration: '30 dakika',
        materials: ['Beyaz mum', 'Kağıt ve kalem', 'Sakin bir ortam'],
        steps: [
          'Yeni ay gecesinde sakin bir ortam hazırlayın',
          'Beyaz mumu yakın ve rahat bir pozisyon alın',
          'Kağıda yeni dönemde gerçekleştirmek istediğiniz hedefleri yazın',
          'Her hedefi okurken mumun ışığına odaklanın',
          'Yazdığınız kağıdı güvenli bir yerde saklayın'
        ],
        specialNotes: 'Bu ritüeli yeni ay gecesinde yapmak en etkilidir.',
        benefits: ['Yeni başlangıçlar', 'Niyet belirleme', 'Odaklanma artışı']
      },
      {
        id: 'full-moon-ritual',
        name: 'Dolunay Ritüeli',
        shortDescription: 'Enerji temizleme ve şükran ritüeli.',
        description: 'Dolunay döneminde yapılan bu ritüel, negatif enerjileri temizler ve şükran duygularınızı güçlendirir.',
        category: 'Ay Ritüelleri',
        difficulty: 'Orta',
        price: 200,
        duration: '45 dakika',
        materials: ['Temizlik tuzu', 'Şifalı otlar', 'Su', 'Mum'],
        steps: [
          'Dolunay gecesinde banyo hazırlayın',
          'Suya tuz ve şifalı otları ekleyin',
          'Mumu yakın ve banyoya girin',
          'Negatif enerjilerin temizlendiğini düşünün',
          'Hayatınızdaki güzel şeyler için şükredin'
        ],
        specialNotes: 'Dolunay gecesinde yapılması önerilir.',
        benefits: ['Enerji temizleme', 'Şükran artışı', 'Ruhsal denge']
      }
    ];

    console.log('✅ Backend - Returning available rituals:', availableRituals.length);
    return res.json({ success: true, data: availableRituals });
  } catch (error) {
    console.error('💥 Backend - Error fetching available rituals:', error);
    return res.status(500).json({ success: false, message: 'Mevcut ritüeller getirilemedi' });
  }
});

// Get rituals for a specific date range
router.get('/date-range', authenticateToken, async (req, res) => {
  try {
    const userId = (req as any).user.id;
    const { startDate, endDate } = req.query;

    if (!startDate || !endDate) {
      return res.status(400).json({ success: false, message: 'Başlangıç ve bitiş tarihi gerekli' });
    }

    const rituals = await prisma.ritual.findMany({
      where: {
        userId,
        date: {
          gte: new Date(startDate as string),
          lte: new Date(endDate as string)
        }
      },
      orderBy: { date: 'asc' }
    });

    return res.json({ success: true, data: rituals });
  } catch (error) {
    console.error('Error fetching rituals by date range:', error);
    return res.status(500).json({ success: false, message: 'Ritüeller getirilemedi' });
  }
});

// Create a new ritual
router.post('/', authenticateToken, async (req, res) => {
  try {
    const userId = (req as any).user.id;
    const { title, description, date, time, icon, color } = req.body;

    if (!title || !date || !time) {
      return res.status(400).json({ success: false, message: 'Başlık, tarih ve saat gerekli' });
    }

    const ritual = await prisma.ritual.create({
      data: {
        title,
        description: description || '',
        date: new Date(date),
        time,
        icon: icon || 'moon',
        color: color || 'bg-purple-100 border-purple-300 text-purple-800',
        userId
      }
    });

    return res.status(201).json({ success: true, data: ritual });
  } catch (error) {
    console.error('Error creating ritual:', error);
    return res.status(500).json({ success: false, message: 'Ritüel oluşturulamadı' });
  }
});

// Update a ritual
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const userId = (req as any).user.id;
    const { id } = req.params;
    const { title, description, date, time, icon, color, isCompleted } = req.body;

    // Check if ritual belongs to user
    const existingRitual = await prisma.ritual.findFirst({
      where: { id, userId }
    });

    if (!existingRitual) {
      return res.status(404).json({ success: false, message: 'Ritüel bulunamadı' });
    }

    const ritual = await prisma.ritual.update({
      where: { id },
      data: {
        ...(title && { title }),
        ...(description !== undefined && { description }),
        ...(date && { date: new Date(date) }),
        ...(time && { time }),
        ...(icon && { icon }),
        ...(color && { color }),
        ...(isCompleted !== undefined && { isCompleted })
      }
    });

    return res.json({ success: true, data: ritual });
  } catch (error) {
    console.error('Error updating ritual:', error);
    return res.status(500).json({ success: false, message: 'Ritüel güncellenemedi' });
  }
});

// Delete a ritual
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const userId = (req as any).user.id;
    const { id } = req.params;

    // Check if ritual belongs to user
    const existingRitual = await prisma.ritual.findFirst({
      where: { id, userId }
    });

    if (!existingRitual) {
      return res.status(404).json({ success: false, message: 'Ritüel bulunamadı' });
    }

    await prisma.ritual.delete({
      where: { id }
    });

    return res.json({ success: true, message: 'Ritüel silindi' });
  } catch (error) {
    console.error('Error deleting ritual:', error);
    return res.status(500).json({ success: false, message: 'Ritüel silinemedi' });
  }
});

// Toggle ritual completion
router.patch('/:id/toggle', authenticateToken, async (req, res) => {
  try {
    const userId = (req as any).user.id;
    const { id } = req.params;

    // Check if ritual belongs to user
    const existingRitual = await prisma.ritual.findFirst({
      where: { id, userId }
    });

    if (!existingRitual) {
      return res.status(404).json({ success: false, message: 'Ritüel bulunamadı' });
    }

    const ritual = await prisma.ritual.update({
      where: { id },
      data: { isCompleted: !existingRitual.isCompleted }
    });

    return res.json({ success: true, data: ritual });
  } catch (error) {
    console.error('Error toggling ritual completion:', error);
    return res.status(500).json({ success: false, message: 'Ritüel durumu güncellenemedi' });
  }
});

export default router;