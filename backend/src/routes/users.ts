import { Router } from 'express';
import {
  getAllUsers,
  getUserById,
  updateUserRole,
  toggleUserStatus,
  deleteUser,
} from '../controllers/usersController';
import { authenticate, authorize } from '../middleware/auth';
import {
  validatePagination,
  validateUUID,
} from '../middleware/validation';

const router = Router();

// All routes require authentication and admin role
router.use(authenticate);
router.use(authorize('admin'));

router.get('/', validatePagination, getAllUsers);
router.get('/:id', validateUUID(), getUserById);
router.put('/:id/role', validateUUID(), updateUserRole);
router.put('/:id/toggle-status', validateUUID(), toggleUserStatus);
router.delete('/:id', validateUUID(), deleteUser);

export default router;
