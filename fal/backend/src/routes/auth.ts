import express from 'express';
import { register, login, getCurrentUser, logout, checkToken } from '../controllers/authController';
import { authMiddleware } from '../middleware/auth';

const router = express.Router();

// Public routes
router.post('/register', register);
router.post('/login', login);
router.get('/check-token', authMiddleware, checkToken);

// Protected routes
router.get('/me', authMiddleware, getCurrentUser);
router.post('/logout', authMiddleware, logout);

export default router;
