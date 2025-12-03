import { Router } from 'express';
import { register, login, verifyEmail, resendVerification, getCurrentUser } from './auth.controller';
import { authenticateToken } from './auth.middleware';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.post('/verify-email', verifyEmail);
router.post('/resend-verification', resendVerification);
router.get('/me', authenticateToken, getCurrentUser);

export default router;
