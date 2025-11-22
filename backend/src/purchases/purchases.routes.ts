import { Router } from 'express';
import { createPurchase, getUserPurchases, getDesignFiles } from './purchases.controller';
import { authenticateToken } from '../auth/auth.middleware';

const router = Router();

// All routes require authentication
router.use(authenticateToken);

router.post('/', createPurchase);
router.get('/my-purchases', getUserPurchases);
router.get('/files/:designId', getDesignFiles);

export default router;
