import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth';
import userRoutes from './routes/user';
import coinRoutes from './routes/coins';
import ritualRoutes from './routes/rituals';
import aiChatRoutes from './routes/ai-chat';
import fortuneRoutes from './routes/fortune';
import notificationRoutes from './routes/notifications';
import fortuneLimitsRoutes from './routes/fortuneLimits';
// import postRoutes from './routes/posts';
import adminRoutes from './routes/admin';

const app = express();

// Middleware
const corsOrigins = process.env.CORS_ORIGIN 
  ? process.env.CORS_ORIGIN.split(',').map(origin => origin.trim())
  : [
      'http://localhost:3000', 
      'http://localhost:3001', 
      'http://localhost:3002', 
      'http://localhost:3003', 
      'http://localhost:3004',
      'https://*.netlify.app',
      'https://*.netlify.com'
    ];

app.use(cors({
  origin: corsOrigins,
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Fal Platform Backend is running',
    timestamp: new Date().toISOString()
  });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/coins', coinRoutes);
app.use('/api/rituals', ritualRoutes);
app.use('/api/ai-chat', aiChatRoutes);
app.use('/api/fortune', fortuneRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/fortune-limits', fortuneLimitsRoutes);
// app.use('/api/posts', postRoutes);
app.use('/api/admin', adminRoutes);

// Error handling
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error:', err);
  res.status(500).json({
    success: false,
    message: 'Internal server error'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

const PORT = parseInt(process.env.PORT || '5000', 10);

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully');
  process.exit(0);
});

const server = app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
});

// Handle server errors
server.on('error', (err: any) => {
  if (err.code === 'EADDRINUSE') {
    console.log(`❌ Port ${PORT} is already in use. Trying port ${PORT + 1}...`);
    const newPort = PORT + 1;
    const newServer = app.listen(newPort, () => {
      console.log(`🚀 Server running on port ${newPort}`);
      console.log(`📊 Health check: http://localhost:${newPort}/health`);
    });
  } else {
    console.error('Server error:', err);
  }
});

export default app;
