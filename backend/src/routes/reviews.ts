import { Router } from 'express';
import {
  getReviewsForPlan,
  createReview,
  updateReview,
  deleteReview,
  getReviewStats,
} from '../controllers/reviewsController';
import { authenticate } from '../middleware/auth';
import {
  validateReviewCreation,
  validatePagination,
  validateUUID,
} from '../middleware/validation';

const router = Router();

// Public routes
router.get('/plan/:planId', validateUUID('planId'), validatePagination, getReviewsForPlan);
router.get('/plan/:planId/stats', validateUUID('planId'), getReviewStats);

// Protected routes
router.use(authenticate);

router.post('/plan/:planId', validateReviewCreation, createReview);
router.put('/:reviewId', validateUUID('reviewId'), updateReview);
router.delete('/:reviewId', validateUUID('reviewId'), deleteReview);

export default router;
