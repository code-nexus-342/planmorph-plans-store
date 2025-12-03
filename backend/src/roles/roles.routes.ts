import { Router } from 'express';
import { getPublicJobRoles, getJobRole, submitRoleApplication } from './roles.controller';

const router = Router();

// Public routes
router.get('/public/job-roles', getPublicJobRoles);
router.get('/public/job-roles/:id', getJobRole);
router.post('/applications', submitRoleApplication);

export default router;
