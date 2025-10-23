import { Router } from 'express';
import {
  getAllPlans,
  searchPlans,
  getPlanById,
  getFeaturedPlans,
} from '../controllers/plansController';
import { optionalAuth } from '../middleware/auth';
import {
  validatePagination,
  validateSearch,
  validateUUID,
} from '../middleware/validation';

const router = Router();

// Public routes - Read-only access
// Plans are managed through external admin application
router.get('/', validatePagination, validateSearch, optionalAuth, getAllPlans);
router.get('/search', validatePagination, validateSearch, searchPlans);
router.get('/featured', getFeaturedPlans);
router.get('/popular', getFeaturedPlans); // Use featured plans for popular for now
router.get('/:id', validateUUID(), getPlanById);

export default router;
