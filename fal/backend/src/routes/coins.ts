import express from 'express';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();

// Get coin packages (public)
router.get('/packages', (req, res) => {
  const packages = [
    {
      id: '1',
      name: 'Başlangıç Paketi',
      coins: 50,
      price: 5000, // 50 TL in cents
      isActive: true,
      description: 'Yeni başlayan kullanıcılar için uygun.',
      discount: 0
    },
    {
      id: '2',
      name: 'Standart Paket',
      coins: 100,
      price: 9000, // 90 TL in cents
      isActive: true,
      description: 'Daha avantajlı fiyat, sık kullananlara uygun.',
      discount: 10
    },
    {
      id: '3',
      name: 'Premium Paket',
      coins: 250,
      price: 20000, // 200 TL in cents
      isActive: true,
      description: 'En çok tercih edilen paket.',
      discount: 20
    },
    {
      id: '4',
      name: 'Mega Paket',
      coins: 500,
      price: 35000, // 350 TL in cents
      isActive: true,
      description: 'Düzenli ritüel ve fal yaptıranlar için ideal.',
      discount: 30
    },
    {
      id: '5',
      name: 'VIP Paket',
      coins: 1000,
      price: 60000, // 600 TL in cents
      isActive: true,
      description: 'Premium kullanıcılar için en avantajlı seçenek.',
      discount: 40
    }
  ];

  res.json({
    success: true,
    data: { packages }
  });
});

// Get user's coin balance (protected)
router.get('/balance', authenticateToken, (req, res) => {
  // For now, return mock data
  res.json({
    success: true,
    data: {
      coins: 100,
      dailyFreeFortunes: 3,
      dailyAiQuestions: 5
    }
  });
});

// Purchase coins (protected)
router.post('/purchase', authenticateToken, (req, res) => {
  const { packageId } = req.body;
  
  // Mock purchase - in real app, this would integrate with payment gateway
  res.json({
    success: true,
    message: 'Coin satın alma başarılı',
    data: {
      packageId,
      coinsAdded: 100,
      newBalance: 200
    }
  });
});

// Get transaction history (protected)
router.get('/history', authenticateToken, (req, res) => {
  // Mock transaction history
  const transactions = [
    {
      id: '1',
      packageName: 'Başlangıç Paketi',
      coins: 50,
      price: 5000,
      status: 'COMPLETED',
      createdAt: new Date().toISOString()
    }
  ];

  res.json({
    success: true,
    data: {
      transactions,
      pagination: {
        page: 1,
        limit: 10,
        total: 1,
        pages: 1
      }
    }
  });
});

export default router;
