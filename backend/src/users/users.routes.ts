import { Router } from 'express';
import { updateSettings, getSettings } from './users.controller';
import { authenticateToken } from '../auth/auth.middleware';

const router = Router();

router.put('/settings', authenticateToken, updateSettings);
router.get('/settings', authenticateToken, getSettings);

export default router;
