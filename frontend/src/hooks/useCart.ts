import { useState, useEffect } from 'react';
import { Cart, CartItem } from '../types';
import { apiClient } from '../lib/api-client';
import { useAuth } from '../contexts/AuthContext';

export function useCart() {
  const { isAuthenticated } = useAuth();
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchCart = async () => {
    if (!isAuthenticated) {
      setCart(null);
      return;
    }

    try {
      setLoading(true);
      setError('');
      const response = await apiClient.get<Cart>('/cart');
      if (response.success && response.data) {
        setCart(response.data);
      }
    } catch (err) {
      setError('Failed to load cart');
      console.error('Failed to fetch cart:', err);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (planId: string, quantity: number = 1) => {
    if (!isAuthenticated) {
      throw new Error('Please sign in to add items to cart');
    }

    try {
      setError('');
      const response = await apiClient.post('/cart/add', { plan_id: planId, quantity });
      if (response.success) {
        await fetchCart(); // Refresh cart
        return true;
      }
      return false;
    } catch (err) {
      setError('Failed to add item to cart');
      console.error('Failed to add to cart:', err);
      return false;
    }
  };

  const updateQuantity = async (itemId: string, quantity: number) => {
    try {
      setError('');
      const response = await apiClient.put(`/cart/item/${itemId}`, { quantity });
      if (response.success) {
        await fetchCart(); // Refresh cart
        return true;
      }
      return false;
    } catch (err) {
      setError('Failed to update quantity');
      console.error('Failed to update quantity:', err);
      return false;
    }
  };

  const removeItem = async (itemId: string) => {
    try {
      setError('');
      const response = await apiClient.delete(`/cart/item/${itemId}`);
      if (response.success) {
        await fetchCart(); // Refresh cart
        return true;
      }
      return false;
    } catch (err) {
      setError('Failed to remove item');
      console.error('Failed to remove item:', err);
      return false;
    }
  };

  const clearCart = async () => {
    try {
      setError('');
      const response = await apiClient.delete('/cart/clear');
      if (response.success) {
        await fetchCart(); // Refresh cart
        return true;
      }
      return false;
    } catch (err) {
      setError('Failed to clear cart');
      console.error('Failed to clear cart:', err);
      return false;
    }
  };

  useEffect(() => {
    fetchCart();
  }, [isAuthenticated]);

  return {
    cart,
    loading,
    error,
    addToCart,
    updateQuantity,
    removeItem,
    clearCart,
    refetch: fetchCart,
  };
}
