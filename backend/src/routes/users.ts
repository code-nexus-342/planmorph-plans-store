import { Router } from 'express';
import {
  getAllUsers,
  getUserById,
  updateUserRole,
  toggleUserStatus,
  deleteUser,
  getDashboardStats,
  getRecentActivity,
  getPurchases,
  getUserSettings,
  updateUserSettings,
  getPaymentMethods,
  addPaymentMethod,
  updatePaymentMethod,
  deletePaymentMethod,
  getBillingAddresses,
  addBillingAddress,
  updateBillingAddress,
  deleteBillingAddress,
  deleteAccount,
  getUserFavorites,
} from '../controllers/usersController';
import { authenticate, authorize } from '../middleware/auth';
import {
  validatePagination,
  validateUUID,
} from '../middleware/validation';

const router = Router();

// Dashboard routes for authenticated users (not admin-only)
router.use(authenticate);
router.get('/dashboard-stats', getDashboardStats);
router.get('/recent-activity', getRecentActivity);
router.get('/purchases', getPurchases);
router.get('/favorites', getUserFavorites);

// Settings routes
router.get('/settings', getUserSettings);
router.put('/settings', updateUserSettings);

// Payment methods routes
router.get('/payment-methods', getPaymentMethods);
router.post('/payment-methods', addPaymentMethod);
router.put('/payment-methods/:id', validateUUID(), updatePaymentMethod);
router.delete('/payment-methods/:id', validateUUID(), deletePaymentMethod);

// Billing addresses routes
router.get('/billing-addresses', getBillingAddresses);
router.post('/billing-addresses', addBillingAddress);
router.put('/billing-addresses/:id', validateUUID(), updateBillingAddress);
router.delete('/billing-addresses/:id', validateUUID(), deleteBillingAddress);

// Account management
router.delete('/account', deleteAccount);

// Admin-only routes
router.use(authorize('admin'));
router.get('/', validatePagination, getAllUsers);
router.get('/:id', validateUUID(), getUserById);
router.put('/:id/role', validateUUID(), updateUserRole);
router.put('/:id/toggle-status', validateUUID(), toggleUserStatus);
router.delete('/:id', validateUUID(), deleteUser);

export default router;
