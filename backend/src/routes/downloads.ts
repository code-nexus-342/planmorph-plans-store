import { Router } from 'express';
import {
  getUserDownloads,
  generateDownloadLink,
  downloadFile,
} from '../controllers/downloadsController';
import { authenticate } from '../middleware/auth';
import { validateUUID } from '../middleware/validation';

const router = Router();

// Public download route (uses token)
router.get('/file/:token', downloadFile);

// Protected routes
router.use(authenticate);
router.get('/', getUserDownloads);
router.post('/generate/:planId/:fileId', validateUUID(), generateDownloadLink);

export default router;
