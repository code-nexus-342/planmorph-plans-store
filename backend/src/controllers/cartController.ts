import { Request, Response } from 'express';
import { supabase } from '../config/database';
import { ApiError, asyncHandler } from '../middleware/errorHandler';
import { sendSuccess } from '../utils/response';
import { logger } from '../utils/logger';
import { CartItem, Cart, User } from '../types';
// Type extensions are automatically loaded from types/express.d.ts

interface AddToCartRequest {
  plan_id: string;
  quantity?: number;
}

// Get user's cart
export const getCart = asyncHandler(async (req: Request, res: Response) => {
  const currentUser = req.user as User;
  const userId = currentUser.id;

  const { data: cartItems, error } = await supabase
    .from('cart_items')
    .select(`
      *,
      plans:plan_id (
        id, title, price, bedrooms, bathrooms, sqft, images
      )
    `)
    .eq('user_id', userId);

  if (error) {
    logger.error('Failed to fetch cart:', error);
    throw new ApiError('Failed to fetch cart', 500);
  }

  const totalItems = cartItems?.reduce((sum, item) => sum + item.quantity, 0) || 0;
  const totalPrice = cartItems?.reduce((sum, item) => sum + (item.plans.price * item.quantity), 0) || 0;

  const cart: Cart = {
    items: cartItems || [],
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

  // Validate plan exists
  const { data: plan } = await supabase
    .from('plans')
    .select('id, title, price')
    .eq('id', plan_id)
    .eq('is_active', true)
    .single();

  if (!plan) {
    throw new ApiError('Plan not found', 404);
  }

  // Check if item already in cart
  const { data: existingItem } = await supabase
    .from('cart_items')
    .select('*')
    .eq('user_id', userId)
    .eq('plan_id', plan_id)
    .single();

  if (existingItem) {
    // Update quantity
    const { data: updatedItem, error } = await supabase
      .from('cart_items')
      .update({ quantity: existingItem.quantity + quantity })
      .eq('id', existingItem.id)
      .select()
      .single();

    if (error) {
      logger.error('Failed to update cart item:', error);
      throw new ApiError('Failed to update cart', 500);
    }

    sendSuccess(res, updatedItem, 'Cart updated successfully');
  } else {
    // Add new item
    const { data: newItem, error } = await supabase
      .from('cart_items')
      .insert({
        user_id: userId,
        plan_id,
        quantity
      })
      .select()
      .single();

    if (error) {
      logger.error('Failed to add to cart:', error);
      throw new ApiError('Failed to add to cart', 500);
    }

    sendSuccess(res, newItem, 'Item added to cart successfully');
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
    const { error } = await supabase
      .from('cart_items')
      .delete()
      .eq('id', itemId)
      .eq('user_id', userId);

    if (error) {
      logger.error('Failed to remove cart item:', error);
      throw new ApiError('Failed to remove cart item', 500);
    }

    sendSuccess(res, null, 'Item removed from cart successfully');
    return;
  }

  const { data: updatedItem, error } = await supabase
    .from('cart_items')
    .update({ quantity })
    .eq('id', itemId)
    .eq('user_id', userId)
    .select()
    .single();

  if (error) {
    logger.error('Failed to update cart item:', error);
    throw new ApiError('Failed to update cart item', 500);
  }

  if (!updatedItem) {
    throw new ApiError('Cart item not found', 404);
  }

  sendSuccess(res, updatedItem, 'Cart item updated successfully');
});

// Remove item from cart
export const removeFromCart = asyncHandler(async (req: Request, res: Response) => {
  const currentUser = req.user as User;
  const userId = currentUser.id;
  const { id: itemId } = req.params;

  const { error } = await supabase
    .from('cart_items')
    .delete()
    .eq('id', itemId)
    .eq('user_id', userId);

  if (error) {
    logger.error('Failed to remove cart item:', error);
    throw new ApiError('Failed to remove cart item', 500);
  }

  sendSuccess(res, null, 'Item removed from cart successfully');
});

// Clear entire cart
export const clearCart = asyncHandler(async (req: Request, res: Response) => {
  const currentUser = req.user as User;
  const userId = currentUser.id;

  const { error } = await supabase
    .from('cart_items')
    .delete()
    .eq('user_id', userId);

  if (error) {
    logger.error('Failed to clear cart:', error);
    throw new ApiError('Failed to clear cart', 500);
  }

  sendSuccess(res, null, 'Cart cleared successfully');
});
