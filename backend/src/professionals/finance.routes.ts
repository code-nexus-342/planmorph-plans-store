import { Router } from 'express';
import {
  getFinanceDashboard,
  getFinancialRecords,
  createFinancialRecord,
  updateFinancialRecord,
  generateFinancialReport
} from './finance.controller';
import { authenticateToken, authorizeRole } from '../auth/auth.middleware';

const router = Router();

// All routes require finance_manager role
router.use(authenticateToken, authorizeRole(['finance_manager', 'admin']));

router.get('/dashboard', getFinanceDashboard);
router.get('/records', getFinancialRecords);
router.post('/records', createFinancialRecord);
router.put('/records/:id', updateFinancialRecord);
router.get('/reports', generateFinancialReport);

export default router;
