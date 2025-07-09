"use client";
import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Cart, CartItem } from '../../types';
import { apiClient } from '../../lib/api-client';
import LoadingSpinner from '../../components/LoadingSpinner';
import { Trash2, Plus, Minus, ShoppingBag } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function CartPage() {
  const { isAuthenticated } = useAuth();
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);
  const [error, setError] = useState('');

  const fetchCart = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get<Cart>('/cart');
      if (response.success && response.data) {
        setCart(response.data);
      }
    } catch (err) {
      setError('Failed to load cart. Please try again.');
      console.error('Failed to fetch cart:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchCart();
    } else {
      setLoading(false);
    }
  }, [isAuthenticated]);

  const updateQuantity = async (itemId: string, quantity: number) => {
    try {
      setUpdating(itemId);
      const response = await apiClient.put(`/cart/item/${itemId}`, { quantity });
      if (response.success) {
        await fetchCart(); // Refresh cart
      }
    } catch (err) {
      setError('Failed to update item quantity.');
      console.error('Failed to update quantity:', err);
    } finally {
      setUpdating(null);
    }
  };

  const removeItem = async (itemId: string) => {
    try {
      setUpdating(itemId);
      const response = await apiClient.delete(`/cart/item/${itemId}`);
      if (response.success) {
        await fetchCart(); // Refresh cart
      }
    } catch (err) {
      setError('Failed to remove item from cart.');
      console.error('Failed to remove item:', err);
    } finally {
      setUpdating(null);
    }
  };

  const clearCart = async () => {
    try {
      setLoading(true);
      const response = await apiClient.delete('/cart/clear');
      if (response.success) {
        await fetchCart(); // Refresh cart
      }
    } catch (err) {
      setError('Failed to clear cart.');
      console.error('Failed to clear cart:', err);
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <ShoppingBag className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Please Sign In</h1>
        <p className="text-gray-600 mb-8">You need to sign in to view your cart.</p>
        <Link
          href="/auth"
          className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Sign In
        </Link>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <ShoppingBag className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Your cart is empty</h1>
        <p className="text-gray-600 mb-8">
          Discover amazing house plans and add them to your cart to get started.
        </p>
        <Link
          href="/plans"
          className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Browse Plans
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
        <button
          onClick={clearCart}
          className="text-red-600 hover:text-red-800 text-sm font-medium transition-colors"
        >
          Clear Cart
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2">
          <div className="space-y-4">
            {cart.items.map((item) => (
              <div
                key={item.id}
                className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm"
              >
                <div className="flex flex-col sm:flex-row gap-4">
                  {/* Plan Image */}
                  <div className="relative w-full sm:w-32 h-32 flex-shrink-0">
                    <Image
                      src={item.plans?.images?.[0] || '/placeholder.jpg'}
                      alt={item.plans?.title || 'Plan'}
                      fill
                      className="object-cover rounded-lg"
                    />
                  </div>

                  {/* Plan Details */}
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {item.plans?.title}
                    </h3>
                    <div className="text-sm text-gray-600 mb-4">
                      {item.plans?.bedrooms} bed • {item.plans?.bathrooms} bath • {item.plans?.square_feet} sq ft
                    </div>
                    <div className="text-xl font-bold text-blue-600">
                      ${item.plans?.price?.toLocaleString()}
                    </div>
                  </div>

                  {/* Quantity Controls */}
                  <div className="flex flex-col items-end gap-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        disabled={updating === item.id || item.quantity <= 1}
                        className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="w-8 text-center font-medium">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        disabled={updating === item.id}
                        className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>

                    <button
                      onClick={() => removeItem(item.id)}
                      disabled={updating === item.id}
                      className="text-red-600 hover:text-red-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-gray-50 rounded-lg p-6 sticky top-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Order Summary</h2>
            
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Items ({cart.total_items})</span>
                <span className="font-medium">${cart.total_price.toLocaleString()}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-600">Tax</span>
                <span className="font-medium">Calculated at checkout</span>
              </div>
              
              <div className="border-t border-gray-200 pt-4">
                <div className="flex justify-between text-lg font-semibold">
                  <span>Total</span>
                  <span>${cart.total_price.toLocaleString()}</span>
                </div>
              </div>
            </div>

            <button className="w-full mt-6 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3 rounded-lg transition-all duration-300 transform hover:scale-[1.02] shadow-lg">
              Proceed to Checkout
            </button>

            <div className="mt-4 text-center">
              <Link
                href="/plans"
                className="text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
