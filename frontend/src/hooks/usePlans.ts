"use client";
import { useState, useEffect } from 'react';
import { apiClient } from '../lib/api-client';
import { Plan, Category } from '../types';

export interface PlanFilters {
  search?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  bedrooms?: number;
  bathrooms?: number;
  minSqFt?: number;
  maxSqFt?: number;
  featured?: boolean;
  page?: number;
  limit?: number;
  sortBy?: 'price' | 'bedrooms' | 'square_feet' | 'created_at' | 'average_rating';
  sortOrder?: 'asc' | 'desc';
}

export interface UsePlansResult {
  plans: Plan[];
  categories: Category[];
  loading: boolean;
  error: string | null;
  total: number;
  currentPage: number;
  totalPages: number;
  fetchPlans: (filters?: PlanFilters) => Promise<void>;
  fetchCategories: () => Promise<void>;
}

export function usePlans(initialFilters?: PlanFilters): UsePlansResult {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  const fetchPlans = async (filters: PlanFilters = {}) => {
    try {
      setLoading(true);
      setError(null);

      // Build query parameters
      const params = new URLSearchParams();
      
      if (filters.search) params.append('search', filters.search);
      if (filters.category) params.append('category', filters.category);
      if (filters.minPrice !== undefined) params.append('minPrice', filters.minPrice.toString());
      if (filters.maxPrice !== undefined) params.append('maxPrice', filters.maxPrice.toString());
      if (filters.bedrooms !== undefined) params.append('bedrooms', filters.bedrooms.toString());
      if (filters.bathrooms !== undefined) params.append('bathrooms', filters.bathrooms.toString());
      if (filters.minSqFt !== undefined) params.append('minSqFt', filters.minSqFt.toString());
      if (filters.maxSqFt !== undefined) params.append('maxSqFt', filters.maxSqFt.toString());
      if (filters.featured !== undefined) params.append('featured', filters.featured.toString());
      if (filters.page !== undefined) params.append('page', filters.page.toString());
      if (filters.limit !== undefined) params.append('limit', filters.limit.toString());
      if (filters.sortBy) params.append('sortBy', filters.sortBy);
      if (filters.sortOrder) params.append('sortOrder', filters.sortOrder);

      const queryString = params.toString();
      const endpoint = queryString ? `/plans?${queryString}` : '/plans';

      const response = await apiClient.get<{
        plans: Plan[];
        pagination: {
          page: number;
          limit: number;
          total: number;
          pages: number;
        };
      }>(endpoint);

      if (response.success && response.data) {
        setPlans(response.data.plans);
        setTotal(response.data.pagination.total);
        setCurrentPage(response.data.pagination.page);
        setTotalPages(response.data.pagination.pages);
      } else {
        setError('Failed to fetch plans');
      }
    } catch (err) {
      console.error('Error fetching plans:', err);
      setError(err instanceof Error ? err.message : 'An error occurred while fetching plans');
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await apiClient.get<Category[]>('/categories');

      if (response.success && response.data) {
        setCategories(response.data);
      } else {
        console.error('Failed to fetch categories');
      }
    } catch (err) {
      console.error('Error fetching categories:', err);
    }
  };

  // Initial data fetch
  useEffect(() => {
    const loadData = async () => {
      await Promise.all([
        fetchPlans(initialFilters),
        fetchCategories()
      ]);
    };

    loadData();
  }, [initialFilters]);

  return {
    plans,
    categories,
    loading,
    error,
    total,
    currentPage,
    totalPages,
    fetchPlans,
    fetchCategories,
  };
}
