import { Router } from 'express';
import { getArchitectApplications, approveArchitect, getUsers, getDesigns } from './admin.controller';
import { authenticateToken, authorizeRole } from '../auth/auth.middleware';

const router = Router();

// All routes require admin role
router.use(authenticateToken, authorizeRole(['admin']));

router.get('/applications', getArchitectApplications);
router.put('/applications/:id', approveArchitect);
router.get('/users', getUsers);
router.get('/designs', getDesigns);

export default router;
