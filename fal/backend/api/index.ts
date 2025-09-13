import { VercelRequest, VercelResponse } from '@vercel/node';
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// Load environment variables first
dotenv.config();

// Import routes with error handling
let authRoutes, userRoutes, coinRoutes, ritualRoutes, aiChatRoutes, fortuneRoutes, notificationRoutes, fortuneLimitsRoutes, adminRoutes;

try {
  authRoutes = require('../src/routes/auth').default;
  userRoutes = require('../src/routes/user').default;
  coinRoutes = require('../src/routes/coins').default;
  ritualRoutes = require('../src/routes/rituals').default;
  aiChatRoutes = require('../src/routes/ai-chat').default;
  fortuneRoutes = require('../src/routes/fortune').default;
  notificationRoutes = require('../src/routes/notifications').default;
  fortuneLimitsRoutes = require('../src/routes/fortuneLimits').default;
  adminRoutes = require('../src/routes/admin').default;
} catch (error) {
  console.error('Route import error:', error);
}

const app = express();

// Enhanced CORS configuration for Vercel
const corsOptions = {
  origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
    // Allow requests with no origin (mobile apps, curl, etc.)
    if (!origin) return callback(null, true);
    
    const allowedOrigins = [
      'http://localhost:3000',
      'http://localhost:3001',
      'http://localhost:3002',
      'https://*.vercel.app',
      'https://*.vercel.com',
      'https://*.netlify.app',
      'https://*.netlify.com'
    ];
    
    const isAllowed = allowedOrigins.some(allowedOrigin => {
      if (allowedOrigin.includes('*')) {
        return origin.includes(allowedOrigin.replace('*', ''));
      }
      return origin === allowedOrigin;
    });
    
    callback(null, isAllowed);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: [
    'Content-Type', 
    'Authorization', 
    'X-Requested-With',
    'Accept',
    'Origin',
    'Access-Control-Request-Method',
    'Access-Control-Request-Headers'
  ],
  exposedHeaders: ['Content-Length', 'X-Foo', 'X-Bar'],
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));

// Body parsing middleware with increased limits
app.use(express.json({ 
  limit: '50mb',
  verify: (req, res, buf) => {
    req.rawBody = buf;
  }
}));
app.use(express.urlencoded({ 
  extended: true, 
  limit: '50mb' 
}));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Fal Platform Backend is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    version: '1.0.0'
  });
});

// API Routes with error handling
if (authRoutes) app.use('/api/auth', authRoutes);
if (userRoutes) app.use('/api/user', userRoutes);
if (coinRoutes) app.use('/api/coins', coinRoutes);
if (ritualRoutes) app.use('/api/rituals', ritualRoutes);
if (aiChatRoutes) app.use('/api/ai-chat', aiChatRoutes);
if (fortuneRoutes) app.use('/api/fortune', fortuneRoutes);
if (notificationRoutes) app.use('/api/notifications', notificationRoutes);
if (fortuneLimitsRoutes) app.use('/api/fortune-limits', fortuneLimitsRoutes);
if (adminRoutes) app.use('/api/admin', adminRoutes);

// Global error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('API Error:', {
    message: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method,
    timestamp: new Date().toISOString()
  });
  
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { 
      error: err.message,
      stack: err.stack 
    })
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'API route not found',
    path: req.originalUrl,
    method: req.method
  });
});

// Vercel serverless function handler with enhanced error handling
export default async (req: VercelRequest, res: VercelResponse) => {
  try {
    // Set CORS headers for Vercel
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Accept, Origin');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Max-Age', '86400');
    
    // Handle preflight requests
    if (req.method === 'OPTIONS') {
      res.status(200).end();
      return;
    }
    
    // Process the request with Express app
    app(req, res);
    
  } catch (error) {
    console.error('Vercel function error:', error);
    res.status(500).json({
      success: false,
      message: 'Function execution error',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};
