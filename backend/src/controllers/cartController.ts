import { Request, Response } from 'express';
import { query } from '../config/database';
import { ApiError, asyncHandler } from '../middleware/errorHandler';
import { sendSuccess } from '../utils/response';
import { logger } from '../utils/logger';
import { CartItem, Cart, User } from '../types';
// Type extensions are automatically loaded from types/express.d.ts

interface AddToCartRequest {
  plan_id: string;
  quantity?: number;
}

interface CartRow {
  id: string;
  user_id: string;
  plan_id: string;
  quantity: number;
  added_at: string;
  updated_at: string;
  plan_title: string;
  plan_price: number;
  plan_bedrooms: number;
  plan_bathrooms: number;
  plan_sqft: number;
  plan_image: string;
}

// Get user's cart
export const getCart = asyncHandler(async (req: Request, res: Response) => {
  const currentUser = req.user as User;
  const userId = currentUser.id;

  const cartResult = await query(`
    SELECT 
      ci.*,
      hp.id as plan_id,
      hp.title as plan_title,
      hp.base_price as plan_price,
      hp.bedrooms as plan_bedrooms,
      hp.bathrooms as plan_bathrooms,
      hp.square_footage as plan_sqft,
      hp.thumbnail_url as plan_image
    FROM cart_items ci
    JOIN house_plans hp ON ci.plan_id = hp.id
    WHERE ci.user_id = $1
    ORDER BY ci.added_at DESC
  `, [userId]);

  const cartItems = cartResult.rows.map((row: CartRow) => ({
    id: row.id,
    user_id: row.user_id,
    plan_id: row.plan_id,
    quantity: row.quantity,
    added_at: row.added_at,
    updated_at: row.updated_at,
    plans: {
      id: row.plan_id,
      title: row.plan_title,
      price: row.plan_price,
      bedrooms: row.plan_bedrooms,
      bathrooms: row.plan_bathrooms,
      sqft: row.plan_sqft,
      images: row.plan_image ? [row.plan_image] : []
    }
  }));

  const totalItems = cartItems.reduce((sum: number, item: any) => sum + item.quantity, 0);
  const totalPrice = cartItems.reduce((sum: number, item: any) => sum + (item.plans.price * item.quantity), 0);

  const cart: Cart = {
    items: cartItems,
    total_items: totalItems,
    total_price: totalPrice
  };

  sendSuccess(res, cart, 'Cart retrieved successfully');
});

// Add item to cart
export const addToCart = asyncHandler(async (req: Request, res: Response) => {
  const currentUser = req.user as User;
  const userId = currentUser.id;
  const { plan_id, quantity = 1 }: AddToCartRequest = req.body;

  // Validate plan_id is a valid UUID
  if (!plan_id || plan_id.trim() === '') {
    throw new ApiError('Plan ID is required', 400);
  }

  // Validate plan exists in the database
  const planResult = await query(
    'SELECT id, title, base_price FROM house_plans WHERE id = $1 AND is_available = true',
    [plan_id]
  );

  if (planResult.rows.length === 0) {
    throw new ApiError('Plan not found or not available', 404);
  }

  // Check if item already in cart
  const existingItemResult = await query(
    'SELECT * FROM cart_items WHERE user_id = $1 AND plan_id = $2',
    [userId, plan_id]
  );

  if (existingItemResult.rows.length > 0) {
    // Update quantity
    const existingItem = existingItemResult.rows[0];
    const updatedItemResult = await query(
      'UPDATE cart_items SET quantity = $1, updated_at = $2 WHERE id = $3 RETURNING *',
      [existingItem.quantity + quantity, new Date().toISOString(), existingItem.id]
    );

    if (updatedItemResult.rows.length === 0) {
      logger.error('Failed to update cart item');
      throw new ApiError('Failed to update cart', 500);
    }

    sendSuccess(res, updatedItemResult.rows[0], 'Cart updated successfully');
  } else {
    // Add new item
    const newItemResult = await query(
      'INSERT INTO cart_items (user_id, plan_id, quantity, added_at, updated_at) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [userId, plan_id, quantity, new Date().toISOString(), new Date().toISOString()]
    );

    if (newItemResult.rows.length === 0) {
      logger.error('Failed to add to cart');
      throw new ApiError('Failed to add to cart', 500);
    }

    sendSuccess(res, newItemResult.rows[0], 'Item added to cart successfully');
  }
});

// Update cart item quantity
export const updateCartItem = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const currentUser = req.user as User;
  const userId = currentUser.id;
  const { id: itemId } = req.params;
  const { quantity } = req.body;

  if (quantity <= 0) {
    // If quantity is 0 or less, remove the item
    const deleteResult = await query(
      'DELETE FROM cart_items WHERE id = $1 AND user_id = $2',
      [itemId, userId]
    );

    if (deleteResult.rowCount === 0) {
      throw new ApiError('Cart item not found', 404);
    }

    sendSuccess(res, null, 'Item removed from cart successfully');
    return;
  }

  const updatedItemResult = await query(
    'UPDATE cart_items SET quantity = $1, updated_at = $2 WHERE id = $3 AND user_id = $4 RETURNING *',
    [quantity, new Date().toISOString(), itemId, userId]
  );

  if (updatedItemResult.rows.length === 0) {
    throw new ApiError('Cart item not found', 404);
  }

  sendSuccess(res, updatedItemResult.rows[0], 'Cart item updated successfully');
});

// Remove item from cart
export const removeFromCart = asyncHandler(async (req: Request, res: Response) => {
  const currentUser = req.user as User;
  const userId = currentUser.id;
  const { id: itemId } = req.params;

  const deleteResult = await query(
    'DELETE FROM cart_items WHERE id = $1 AND user_id = $2',
    [itemId, userId]
  );

  if (deleteResult.rowCount === 0) {
    throw new ApiError('Cart item not found', 404);
  }

  sendSuccess(res, null, 'Item removed from cart successfully');
});

// Clear entire cart
export const clearCart = asyncHandler(async (req: Request, res: Response) => {
  const currentUser = req.user as User;
  const userId = currentUser.id;

  await query(
    'DELETE FROM cart_items WHERE user_id = $1',
    [userId]
  );

  sendSuccess(res, null, 'Cart cleared successfully');
});
