import { Router } from 'express';
import { register, login, applyAsArchitect, getCurrentUser } from './auth.controller';
import { authenticateToken } from './auth.middleware';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.get('/me', authenticateToken, getCurrentUser);

// Architect application route - requires authentication
router.post('/architect/apply', authenticateToken, applyAsArchitect);

export default router;
