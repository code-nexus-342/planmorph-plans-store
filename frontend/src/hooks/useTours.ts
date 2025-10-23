"use client";
import { useState } from 'react';
import { apiClient } from '../lib/api-client';

export interface Tour3D {
  id: string;
  title: string;
  image: string;
  videoUrl?: string;
  duration: string;
  views: number;
  category: string;
  description: string;
  planId?: string;
}

export interface TourFilters {
  category?: string;
  search?: string;
}

export function useTours() {
  const [tours, setTours] = useState<Tour3D[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTours = async (filters?: TourFilters) => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams();
      if (filters?.category) params.append('category', filters.category);
      if (filters?.search) params.append('search', filters.search);

      const queryString = params.toString();
      const endpoint = queryString ? `/tours?${queryString}` : '/tours';

      const response = await apiClient.get<Tour3D[]>(endpoint);

      if (response.success && response.data) {
        setTours(response.data);
      } else {
        setError('Failed to fetch 3D tours');
      }
    } catch (err) {
      console.error('Error fetching tours:', err);
      setError(err instanceof Error ? err.message : 'An error occurred while fetching tours');
      // Set empty array on error for better UX
      setTours([]);
    } finally {
      setLoading(false);
    }
  };

  return {
    tours,
    loading,
    error,
    fetchTours,
  };
}
