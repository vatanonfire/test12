import express from 'express';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

// Create payment intent
router.post('/create-intent', (req, res) => {
  res.json({ message: 'Create payment intent endpoint' });
});

// Webhook
router.post('/webhook', (req, res) => {
  res.json({ message: 'Payment webhook endpoint' });
});

export default router;
