import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../config/database';
import { body, validationResult } from 'express-validator';

interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
  };
}

// Register user
export const register = async (req: Request, res: Response) => {
  try {
    // Validation
    await body('email').isEmail().normalizeEmail().run(req);
    await body('password').isLength({ min: 6 }).run(req);
    await body('name').notEmpty().trim().run(req);

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: errors.array()
      });
    }

    const { email, password, name } = req.body;

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User already exists with this email'
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
        name
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        coins: true,
        dailyFreeFortunes: true,
        dailyAiQuestions: true,
        createdAt: true
      }
    });

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET || 'fallback-secret'
    );

    return res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        user,
        token
      }
    });
  } catch (error) {
    console.error('Register error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error during registration'
    });
  }
};

// Login user
export const login = async (req: Request, res: Response) => {
  try {
    console.log('🔍 Login attempt started');
    console.log('📥 Request body:', req.body);
    
    // Validation
    await body('email').isEmail().normalizeEmail().run(req);
    await body('password').notEmpty().run(req);

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log('❌ Validation errors:', errors.array());
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: errors.array()
      });
    }

    const { email, password } = req.body;
    console.log('📧 Email:', email);
    console.log('🔑 Password length:', password?.length);

    // Find user
    console.log('🔍 Searching for user with email:', email);
    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        password: true,
        name: true,
        role: true,
        isActive: true,
        coins: true,
        dailyFreeFortunes: true,
        dailyAiQuestions: true,
        lastResetDate: true
      }
    });

    console.log('👤 User found:', user ? 'Yes' : 'No');
    if (user) {
      console.log('👤 User details:', {
        id: user.id,
        email: user.email,
        name: user.name,
        isActive: user.isActive,
        hasPassword: !!user.password
      });
    }

    if (!user || !user.isActive) {
      console.log('❌ User not found or inactive');
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Check password
    console.log('🔐 Checking password...');
    console.log('🔑 Input password length:', password.length);
    console.log('🔑 Stored password hash length:', user.password.length);
    console.log('🔑 Stored password hash starts with:', user.password.substring(0, 10));
    
    const isPasswordValid = await bcrypt.compare(password, user.password);
    console.log('🔐 Password valid:', isPasswordValid);
    
    if (!isPasswordValid) {
      console.log('❌ Password validation failed');
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Check and reset daily limits if needed
    const today = new Date();
    const lastReset = new Date(user.lastResetDate);
    const isNewDay = today.getDate() !== lastReset.getDate() || 
                     today.getMonth() !== lastReset.getMonth() || 
                     today.getFullYear() !== lastReset.getFullYear();

    if (isNewDay) {
      await prisma.user.update({
        where: { id: user.id },
        data: {
          dailyFreeFortunes: 3,
          dailyAiQuestions: 5,
          lastResetDate: today,
          lastLoginDate: today
        }
      });
    } else {
      // Update last login date
      await prisma.user.update({
        where: { id: user.id },
        data: {
          lastLoginDate: today
        }
      });
    }

    // Generate JWT token
    console.log('🎫 Generating JWT token...');
    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET || 'fallback-secret'
    );
    console.log('🎫 Token generated successfully');

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user;

    console.log('✅ Login successful for user:', user.email);
    return res.json({
      success: true,
      message: 'Login successful',
      data: {
        user: userWithoutPassword,
        token
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error during login'
    });
  }
};

// Get current user
export const getCurrentUser = async (req: AuthRequest, res: Response) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user!.id },
      select: {
        id: true,
        email: true,
        name: true,
        avatar: true,
        role: true,
        coins: true,
        dailyFreeFortunes: true,
        dailyAiQuestions: true,
        lastResetDate: true,
        createdAt: true
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
    console.error('Get current user error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// Logout (client-side token removal)
export const logout = async (req: AuthRequest, res: Response) => {
  return res.json({
    success: true,
    message: 'Çıkış başarılı'
  });
};

// Check token validity
export const checkToken = async (req: AuthRequest, res: Response) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user!.id },
      select: {
        id: true,
        email: true,
        name: true,
        avatar: true,
        role: true,
        coins: true,
        dailyFreeFortunes: true,
        dailyAiQuestions: true,
        lastResetDate: true,
        createdAt: true
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
      data: { user }
    });
  } catch (error) {
    console.error('Check token error:', error);
    return res.status(500).json({
      success: false,
      message: 'Sunucu hatası'
    });
  }
};
