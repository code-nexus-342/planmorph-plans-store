import { Router } from 'express';
import {
  getEngineerDashboard,
  getDesignsForEngineering,
  getStructuralDrawings,
  uploadStructuralDrawing,
  updateStructuralDrawing
} from './civil-engineer.controller';
import { authenticateToken, authorizeRole } from '../auth/auth.middleware';

const router = Router();

// All routes require civil_engineer role
router.use(authenticateToken, authorizeRole(['civil_engineer', 'admin']));

router.get('/dashboard', getEngineerDashboard);
router.get('/designs', getDesignsForEngineering);
router.get('/drawings', getStructuralDrawings);
router.post('/drawings', uploadStructuralDrawing);
router.put('/drawings/:id', updateStructuralDrawing);

export default router;
