import { Router } from 'express';
import { getDesigns, getDesignById } from './designs.controller';

const router = Router();

router.get('/', getDesigns);
router.get('/:id', getDesignById);

export default router;
