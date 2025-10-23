import { Router } from 'express';
import {
  getAllCategories,
  getCategoryById,
  getCategoryBySlug,
  createCategory,
  updateCategory,
  deleteCategory,
  getCategoryStats,
} from '../controllers/categoriesController';
import { authenticate, authorize } from '../middleware/auth';
import {
  validatePagination,
  validateUUID,
} from '../middleware/validation';

const router = Router();

// Public routes
router.get('/', validatePagination, getAllCategories);
router.get('/stats', getCategoryStats);
router.get('/slug/:slug', getCategoryBySlug);
router.get('/:id', validateUUID(), getCategoryById);

// Protected routes (admin only)
router.use(authenticate);
router.use(authorize('admin'));

router.post('/', createCategory);
router.put('/:id', validateUUID(), updateCategory);
router.delete('/:id', validateUUID(), deleteCategory);

export default router;
