import { Router } from 'express';
import {
  getAllPlans,
  searchPlans,
  getPlanById,
  createPlan,
  updatePlan,
  deletePlan,
  getFeaturedPlans,
} from '../controllers/plansController';
import { authenticate, authorize, optionalAuth } from '../middleware/auth';
import {
  validatePlanCreation,
  validatePagination,
  validateSearch,
  validateUUID,
} from '../middleware/validation';

const router = Router();

// Public routes
router.get('/', validatePagination, validateSearch, optionalAuth, getAllPlans);
router.get('/search', validatePagination, validateSearch, searchPlans);
router.get('/featured', getFeaturedPlans);
router.get('/:id', validateUUID(), getPlanById);

// Protected routes
router.use(authenticate);

// Create plan (admin or architect only)
router.post('/', authorize('admin', 'architect'), validatePlanCreation, createPlan);

// Update/Delete plan (admin, architect, or owner only)
router.put('/:id', validateUUID(), updatePlan);
router.delete('/:id', validateUUID(), deletePlan);

export default router;
