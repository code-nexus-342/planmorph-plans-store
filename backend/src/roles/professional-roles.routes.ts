import { Router } from 'express';
import { 
  getProfessionalRoles, 
  createProfessionalRole, 
  updateProfessionalRole 
} from './professional-roles.controller';
import { authenticateToken, authorizeRole } from '../auth/auth.middleware';

const router = Router();

// Public route to fetch roles (needed for login/signup/initial load)
router.get('/', getProfessionalRoles);

// Admin only routes
router.post('/', authenticateToken, authorizeRole(['admin']), createProfessionalRole);
router.put('/:id', authenticateToken, authorizeRole(['admin']), updateProfessionalRole);

export default router;
