import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';

import authRoutes from './auth/auth.routes';
import designRoutes from './designs/designs.routes';
import purchaseRoutes from './purchases/purchases.routes';
import customRequestsRoutes from './custom-requests/custom-requests.routes';
import contactRoutes from './contact/contact.routes';
import usersRoutes from './users/users.routes';
import { errorHandler } from './middleware/errorHandler';
import logger from './utils/logger';

dotenv.config();
import categoriesRoutes from './categories/categories.routes';
import architectRoutes from './architects/architects.routes';
import professionalRoutes from './professionals/professionals.routes';
const app = express();
const port = process.env.PORT || 5000;

// CORS must be before helmet to ensure proper headers
app.use(cors({
    origin: function(origin, callback) {
      const allowedOrigins = (process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000', 'https://planmorph-designs-nr7ca.ondigitalocean.app'])
        .map(o => o.trim().replace(/\/$/, '')); // Remove trailing slashes
      
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);
      
      if (allowedOrigins.indexOf(origin) !== -1 || origin.startsWith('http://localhost:')) {
        return callback(null, true);
      }
      return callback(new Error('The CORS policy for this site does not allow access from the specified Origin.'), false);
    },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept']
}));

// Enable pre-flight requests for all routes
app.options('*', cors());

// Configure helmet to not interfere with CORS
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Serve static files from uploads directory
app.use('/uploads', express.static('uploads'));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/designs', designRoutes);
app.use('/api/purchases', purchaseRoutes);
app.use('/api/custom-requests', customRequestsRoutes);
app.use('/api/categories', categoriesRoutes);
app.use('/api/architect', architectRoutes);
app.use('/api/professionals', professionalRoutes);
app.use('/api/contact', contactRoutes);

app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'PlanMorph Backend is running' });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ status: 'error', message: 'Route not found' });
});

// Global error handler (must be last)
app.use(errorHandler);

app.listen(port, () => {
  logger.info(`Server is running on port ${port}`);
});
