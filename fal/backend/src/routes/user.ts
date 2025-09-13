import express from 'express';
import { authMiddleware } from '../middleware/auth';
import { body, validationResult } from 'express-validator';
import { prisma } from '../config/database';

interface AuthRequest extends express.Request {
  user?: {
    id: string;
    email: string;
    role: string;
  };
}

const router = express.Router();

// All routes require authentication
router.use(authMiddleware);

// Get user profile
router.get('/profile', (req: AuthRequest, res) => {
  // This will be implemented in userController
  res.json({ message: 'User profile endpoint' });
});

// Update user profile
router.put('/profile', authMiddleware, async (req: AuthRequest, res) => {
  try {
    // Validation
    await body('name').notEmpty().trim().run(req);
    await body('email').isEmail().normalizeEmail().run(req);

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: errors.array()
      });
    }

    const { name, email } = req.body;
    const userId = req.user!.id;

    // Check if email is already taken by another user
    const existingUser = await prisma.user.findFirst({
      where: {
        email,
        id: { not: userId }
      }
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Bu e-posta adresi başka bir kullanıcı tarafından kullanılıyor'
      });
    }

    // Update user
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { name, email },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        coins: true,
        dailyFreeFortunes: true,
        dailyAiQuestions: true,
        createdAt: true
      }
    });

    return res.json({
      success: true,
      message: 'Profil başarıyla güncellendi',
      data: { user: updatedUser }
    });
  } catch (error) {
    console.error('Profile update error:', error);
    return res.status(500).json({
      success: false,
      message: 'Profil güncellenirken bir hata oluştu'
    });
  }
});

// Get user history
router.get('/history', (req: AuthRequest, res) => {
  // This will be implemented in userController
  res.json({ message: 'User history endpoint' });
});

export default router;
