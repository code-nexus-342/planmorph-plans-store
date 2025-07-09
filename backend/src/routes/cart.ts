import { Router } from 'express';
import {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
} from '../controllers/cartController';
import { authenticate } from '../middleware/auth';
import { validateUUID } from '../middleware/validation';

const router = Router();

// All cart routes require authentication
router.use(authenticate);

router.get('/', getCart);
router.post('/add', addToCart);
router.put('/item/:id', validateUUID(), updateCartItem);
router.delete('/item/:id', validateUUID(), removeFromCart);
router.delete('/clear', clearCart);

export default router;
