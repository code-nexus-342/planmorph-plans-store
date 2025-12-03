import { Router } from 'express';
import {
  getSurveyorDashboard,
  getSurveys,
  getSurvey,
  createSurvey,
  updateSurvey,
  generateSurveyReport
} from './surveyor.controller';
import { authenticateToken, authorizeRole } from '../auth/auth.middleware';

const router = Router();

// All routes require surveyor role
router.use(authenticateToken, authorizeRole(['surveyor', 'admin']));

router.get('/dashboard', getSurveyorDashboard);
router.get('/surveys', getSurveys);
router.get('/surveys/:id', getSurvey);
router.post('/surveys', createSurvey);
router.put('/surveys/:id', updateSurvey);
router.get('/surveys/:id/report', generateSurveyReport);

export default router;
