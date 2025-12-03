import { Router } from 'express';
import {
  getHRDashboard,
  getEmployees,
  addEmployee,
  updateEmployee,
  getPayments,
  releasePayment,
  updatePaymentStatus
} from './hr.controller';
import { authenticateToken, authorizeRole } from '../auth/auth.middleware';

const router = Router();

// All routes require hr_manager role
router.use(authenticateToken, authorizeRole(['hr_manager', 'admin']));

router.get('/dashboard', getHRDashboard);
router.get('/employees', getEmployees);
router.post('/employees', addEmployee);
router.put('/employees/:id', updateEmployee);
router.get('/payments', getPayments);
router.post('/payments/release', releasePayment);
router.put('/payments/:id', updatePaymentStatus);

export default router;
