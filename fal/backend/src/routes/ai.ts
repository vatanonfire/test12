import express from 'express';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

// Chat with AI
router.post('/chat', (req, res) => {
  res.json({ message: 'AI chat endpoint' });
});

export default router;
