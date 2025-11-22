import { Router } from 'express';
import { getDashboardStats, getMyDesigns, createDesign, getUploadUrl, addDesignMedia } from './architects.controller';
import { authenticateToken, authorizeRole } from '../auth/auth.middleware';

const router = Router();

// All routes require architect role
router.use(authenticateToken, authorizeRole(['architect']));

router.get('/dashboard', getDashboardStats);
router.get('/designs', getMyDesigns);
router.post('/designs', createDesign);
router.post('/upload-url', getUploadUrl);
router.post('/media', addDesignMedia);

export default router;
