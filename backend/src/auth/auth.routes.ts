import { Router } from 'express';
import { register, login, verifyEmail, forgotPassword, resetPassword, submitProfessionalApplication, getCurrentUser } from './auth.controller';
import { authenticateToken } from './auth.middleware';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.post('/verify-email', verifyEmail);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.post('/apply-professional', submitProfessionalApplication);
router.get('/me', authenticateToken, getCurrentUser);

export default router;
