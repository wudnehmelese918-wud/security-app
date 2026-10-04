import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import path from 'path';
import fs from 'fs';
import { connectDB } from './config/database';
import { config } from './config/env';
import authRoutes from './routes/auth.routes';
import userRoutes from './routes/user.routes';
import equipmentRoutes from './routes/equipment.routes';
import exitLogRoutes from './routes/exitLog.routes';
import dashboardRoutes from './routes/dashboard.routes';
import { errorHandler } from './middleware/error.middleware';
import { notFound } from './middleware/notFound.middleware';
import { generalApiLimiter } from './middleware/rateLimit.middleware';

const app = express();

// Security & Utility Middleware
app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
app.use(cors({ origin: config.FRONTEND_URL, credentials: true }));
app.use(morgan('dev'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Apply general API rate limiter to all /api routes
app.use('/api', generalApiLimiter);

// Ensure upload subdirectories exist
['photos', 'equipment', 'qrcodes'].forEach((folder) => {
  const dir = path.join(config.UPLOAD_DIR, folder);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

// Static uploads folder
app.use('/uploads', express.static(config.UPLOAD_DIR));

// Health check
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    system: 'DBU Security Gate Management API',
    security: {
      rateLimiting: 'active',
      rbac: 'strict',
      jwtAuth: 'active',
    },
    timestamp: new Date().toISOString(),
  });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/equipment', equipmentRoutes);
app.use('/api/exit-logs', exitLogRoutes);
app.use('/api/dashboard', dashboardRoutes);

// Error handlers
app.use(notFound);
app.use(errorHandler);

// Start server
const start = async () => {
  await connectDB();
  const { seedDatabase } = await import('./config/seed');
  await seedDatabase();
  app.listen(config.PORT, () => {
    console.log(`🚀 DBU Security API running on http://localhost:${config.PORT}`);
  });
};

start();

export default app;
