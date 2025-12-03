import { Router } from 'express';
import { 
  getArchitectApplications, 
  approveArchitect, 
  getUsers, 
  getDesigns,
  getAnalytics,
  getProfessionals,
  getJobRoles,
  createJobRole,
  updateJobRole,
  deleteJobRole,
  getRoleApplications,
  approveRoleApplication,
  rejectRoleApplication
} from './admin.controller';
import { authenticateToken, authorizeRole } from '../auth/auth.middleware';

const router = Router();

// All routes require admin role
router.use(authenticateToken, authorizeRole(['admin']));

// Legacy architect application routes
router.get('/applications', getArchitectApplications);
router.put('/applications/:id', approveArchitect);

// User and design routes
router.get('/users', getUsers);
router.get('/designs', getDesigns);

// Analytics routes
router.get('/analytics', getAnalytics);

// Professional management routes
router.get('/professionals', getProfessionals);

// Job role management routes
router.get('/job-roles', getJobRoles);
router.post('/job-roles', createJobRole);
router.put('/job-roles/:id', updateJobRole);
router.delete('/job-roles/:id', deleteJobRole);

// Role application management routes
router.get('/role-applications', getRoleApplications);
router.put('/role-applications/:id/approve', approveRoleApplication);
router.put('/role-applications/:id/reject', rejectRoleApplication);

export default router;

