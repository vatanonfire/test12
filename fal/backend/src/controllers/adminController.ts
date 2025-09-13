import { Request, Response } from 'express';
import { prisma } from '../config/database';
import { body, validationResult } from 'express-validator';
import bcrypt from 'bcryptjs';
import { ROLES } from '../middleware/roles';

interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
  };
}

/**
 * Get all users with pagination (Admin only)
 * - Only admins can access this endpoint
 * - Returns user list with sensitive information filtered
 */
export const getUsers = async (req: AuthRequest, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const users = await prisma.user.findMany({
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        isActive: true,
        coins: true,
        createdAt: true,
        updatedAt: true,
        lastLoginDate: true,
        _count: {
          select: {
            rituals: true,
            transactions: true
          }
        }
      }
    });

    const total = await prisma.user.count();

    return res.json({
      success: true,
      data: {
        users,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    console.error('Get users error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error while fetching users'
    });
  }
};

/**
 * Get user by ID (Admin only)
 * - Only admins can access this endpoint
 * - Returns detailed user information
 */
export const getUser = async (req: AuthRequest, res: Response) => {
  try {
    const { userId } = req.params;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        isActive: true,
        coins: true,
        dailyFreeFortunes: true,
        dailyAiQuestions: true,
        lastResetDate: true,
        lastLoginDate: true,
        createdAt: true,
        updatedAt: true,

        rituals: {
          select: {
            id: true,
            type: true,
            status: true,
            createdAt: true
          }
        },
        transactions: {
          select: {
            id: true,
            amount: true,
            status: true,
            createdAt: true
          }
        }
      }
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    return res.json({
      success: true,
      data: { user }
    });
  } catch (error) {
    console.error('Get user error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error while fetching user'
    });
  }
};

/**
 * Create new user (Admin only)
 * - Only admins can create new users
 * - Can assign any role to new users
 */
export const createUser = async (req: AuthRequest, res: Response) => {
  try {
    // Validation
    await body('email').isEmail().normalizeEmail().run(req);
    await body('password').isLength({ min: 6 }).run(req);
    await body('name').notEmpty().trim().run(req);
    await body('role').isIn(Object.values(ROLES)).run(req);

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: errors.array()
      });
    }

    const { email, password, name, role, coins } = req.body;

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User with this email already exists'
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        role: role || ROLES.USER,
        coins: coins || 100,
        dailyFreeFortunes: 3,
        dailyAiQuestions: 5,
        lastResetDate: new Date()
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        isActive: true,
        coins: true,
        createdAt: true
      }
    });

    return res.status(201).json({
      success: true,
      message: 'User created successfully',
      data: { user }
    });
  } catch (error) {
    console.error('Create user error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error while creating user'
    });
  }
};

/**
 * Update user (Admin only)
 * - Only admins can update users
 * - Can change role, status, and other properties
 */
export const updateUser = async (req: AuthRequest, res: Response) => {
  try {
    // Validation
    await body('name').optional().notEmpty().trim().run(req);
    await body('role').optional().isIn(Object.values(ROLES)).run(req);
    await body('isActive').optional().isBoolean().run(req);
    await body('coins').optional().isInt({ min: 0 }).run(req);

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: errors.array()
      });
    }

    const { userId } = req.params;
    const { name, role, isActive, coins, dailyFreeFortunes, dailyAiQuestions } = req.body;

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!existingUser) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Prevent admin from deactivating themselves
    if (userId === req.user!.id && isActive === false) {
      return res.status(400).json({
        success: false,
        message: 'You cannot deactivate your own account'
      });
    }

    const updateData: any = {};
    if (name !== undefined) updateData.name = name;
    if (role !== undefined) updateData.role = role;
    if (isActive !== undefined) updateData.isActive = isActive;
    if (coins !== undefined) updateData.coins = coins;
    if (dailyFreeFortunes !== undefined) updateData.dailyFreeFortunes = dailyFreeFortunes;
    if (dailyAiQuestions !== undefined) updateData.dailyAiQuestions = dailyAiQuestions;

    const user = await prisma.user.update({
      where: { id: userId },
      data: updateData,
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        isActive: true,
        coins: true,
        dailyFreeFortunes: true,
        dailyAiQuestions: true,
        updatedAt: true
      }
    });

    return res.json({
      success: true,
      message: 'User updated successfully',
      data: { user }
    });
  } catch (error) {
    console.error('Update user error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error while updating user'
    });
  }
};

/**
 * Delete user (Admin only)
 * - Only admins can delete users
 * - Cannot delete themselves
 */
export const deleteUser = async (req: AuthRequest, res: Response) => {
  try {
    const { userId } = req.params;

    // Prevent admin from deleting themselves
    if (userId === req.user!.id) {
      return res.status(400).json({
        success: false,
        message: 'You cannot delete your own account'
      });
    }

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!existingUser) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Delete user (cascade will handle related data)
    await prisma.user.delete({
      where: { id: userId }
    });

    return res.json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error) {
    console.error('Delete user error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error while deleting user'
    });
  }
};

/**
 * Get system statistics (Admin only)
 * - Only admins can access system statistics
 * - Returns overview of users, posts, rituals, etc.
 */
export const getSystemStats = async (req: AuthRequest, res: Response) => {
  try {
    const [
      totalUsers,
      activeUsers,
      totalRituals,
      totalTransactions,
      totalRevenue
    ] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { isActive: true } }),
      prisma.ritual.count(),
      prisma.transaction.count(),
      prisma.transaction.aggregate({
        where: { status: 'COMPLETED' },
        _sum: { amount: true }
      })
    ]);

    const roleDistribution = await prisma.user.groupBy({
      by: ['role'],
      _count: { role: true }
    });

    const stats = {
      users: {
        total: totalUsers,
        active: activeUsers,
        inactive: totalUsers - activeUsers,
        roleDistribution
      },
      content: {
        totalPosts: 0,
        publishedPosts: 0,
        draftPosts: 0
      },
      business: {
        totalRituals,
        totalTransactions,
        totalRevenue: totalRevenue._sum.amount || 0
      }
    };

    return res.json({
      success: true,
      data: { stats }
    });
  } catch (error) {
    console.error('Get system stats error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error while fetching system statistics'
    });
  }
};
