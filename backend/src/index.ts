import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';

import authRoutes from './auth/auth.routes';
import designRoutes from './designs/designs.routes';
import purchaseRoutes from './purchases/purchases.routes';
import customRequestsRoutes from './custom-requests/custom-requests.routes';
import contactRoutes from './contact/contact.routes';
import { errorHandler } from './middleware/errorHandler';
import logger from './utils/logger';

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(helmet());
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000', 'http://localhost:5173'],
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/designs', designRoutes);
app.use('/api/purchases', purchaseRoutes);
app.use('/api/custom-requests', customRequestsRoutes);
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
