import { Router } from 'express';
import { getProfessionalDashboardStats, getProfessionalRoles } from './professionals.controller';
import { login, forgotPassword, resetPassword } from './professionals.auth.controller';
import { authenticateToken, authorizeRole } from '../auth/auth.middleware';
import { submitProfessionalApplication } from '../auth/auth.controller';

const router = Router();

// Public routes
router.get('/roles', getProfessionalRoles);
router.post('/login', login);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.post('/apply', submitProfessionalApplication);

// Protected
router.use(authenticateToken, authorizeRole(['professional', 'admin']));
router.get('/dashboard', getProfessionalDashboardStats);

export default router;
