"use client";
import { useState } from 'react';
import { apiClient } from '../lib/api-client';

export interface FavoritePlan {
  id: string;
  title: string;
  imageUrl: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  squareFootage: number;
  category: string;
  dateAdded: string;
  architect: string;
  style: string;
}

export function useFavorites() {
  const [favorites, setFavorites] = useState<FavoritePlan[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchFavorites = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await apiClient.get<FavoritePlan[]>('/user/favorites');

      if (response.success && response.data) {
        setFavorites(response.data);
      } else {
        setError('Failed to fetch favorites');
      }
    } catch (err) {
      console.error('Error fetching favorites:', err);
      setError(err instanceof Error ? err.message : 'An error occurred while fetching favorites');
      // Set empty array on error for better UX
      setFavorites([]);
    } finally {
      setLoading(false);
    }
  };

  const addFavorite = async (planId: string) => {
    try {
      const response = await apiClient.post(`/user/favorites/${planId}`, {});
      if (response.success) {
        await fetchFavorites(); // Refresh the list
      }
      return response.success;
    } catch (err) {
      console.error('Error adding favorite:', err);
      return false;
    }
  };

  const removeFavorite = async (planId: string) => {
    try {
      const response = await apiClient.delete(`/user/favorites/${planId}`);
      if (response.success) {
        setFavorites(prev => prev.filter(fav => fav.id !== planId));
      }
      return response.success;
    } catch (err) {
      console.error('Error removing favorite:', err);
      return false;
    }
  };

  return {
    favorites,
    loading,
    error,
    fetchFavorites,
    addFavorite,
    removeFavorite,
  };
}
