import express from 'express';
import { authMiddleware } from '../middleware/auth';
import {
  getCoinPackages,
  getUserCoins,
  getUserTransactions,
  addCoinsToUser,
  getAllTransactions,
  getPackageSalesStats,
  createCoinPackage,
  updateCoinPackage,
  deleteCoinPackage
} from '../controllers/coinController';

const router = express.Router();

// Public routes
router.get('/packages', getCoinPackages);

// Protected routes
router.get('/user/balance', authMiddleware, getUserCoins);
router.get('/user/transactions', authMiddleware, getUserTransactions);
router.post('/user/add-coins', authMiddleware, addCoinsToUser);

// Admin routes
router.get('/admin/transactions', authMiddleware, getAllTransactions);
router.get('/admin/package-stats', authMiddleware, getPackageSalesStats);
router.post('/admin/packages', authMiddleware, createCoinPackage);
router.put('/admin/packages/:id', authMiddleware, updateCoinPackage);
router.delete('/admin/packages/:id', authMiddleware, deleteCoinPackage);

export default router;
