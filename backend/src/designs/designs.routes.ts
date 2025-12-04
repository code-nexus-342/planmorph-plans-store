import { Router } from 'express';
import { getDesigns, getDesignById, createDesign } from './designs.controller';
import { authenticateToken } from '../auth/auth.middleware';
import { upload } from '../middleware/upload.middleware';

const router = Router();

router.get('/', getDesigns);
router.get('/:id', getDesignById);

router.post('/', 
  authenticateToken, 
  upload.fields([
    { name: 'images', maxCount: 10 }, 
    { name: 'cadFile', maxCount: 1 }
  ]), 
  createDesign
);

export default router;
