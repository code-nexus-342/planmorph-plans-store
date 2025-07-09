// API Configuration - Enhanced for production scale
export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000',
  API_VERSION: 'v1',
  TIMEOUT: 30000, // Increased timeout for high-scale operations
  MAX_RETRIES: 3,
  RETRY_DELAY: 1000,
  MAX_CONCURRENT_REQUESTS: 10,
};

export const API_ENDPOINTS = {
  // Authentication
  AUTH: {
    REGISTER: '/auth/register',
    LOGIN: '/auth/login',
    PROFILE: '/auth/profile',
    REFRESH: '/auth/refresh-token',
    CHANGE_PASSWORD: '/auth/change-password',
    OAUTH_CALLBACK: '/auth/oauth/callback',
  },
  // Plans
  PLANS: {
    LIST: '/plans',
    SEARCH: '/plans/search',
    FEATURED: '/plans/featured',
    BY_ID: (id: string) => `/plans/${id}`,
    CREATE: '/plans',
    UPDATE: (id: string) => `/plans/${id}`,
    DELETE: (id: string) => `/plans/${id}`,
  },
  // Categories
  CATEGORIES: {
    LIST: '/categories',
    STATS: '/categories/stats',
    BY_ID: (id: string) => `/categories/${id}`,
    BY_SLUG: (slug: string) => `/categories/slug/${slug}`,
    CREATE: '/categories',
    UPDATE: (id: string) => `/categories/${id}`,
    DELETE: (id: string) => `/categories/${id}`,
  },
  // Reviews
  REVIEWS: {
    BY_PLAN: (planId: string) => `/reviews/plan/${planId}`,
    STATS: (planId: string) => `/reviews/plan/${planId}/stats`,
    CREATE: (planId: string) => `/reviews/plan/${planId}`,
    UPDATE: (reviewId: string) => `/reviews/${reviewId}`,
    DELETE: (reviewId: string) => `/reviews/${reviewId}`,
  },
  // Cart
  CART: {
    GET: '/cart',
    ADD: '/cart/add',
    UPDATE_ITEM: (itemId: string) => `/cart/item/${itemId}`,
    REMOVE_ITEM: (itemId: string) => `/cart/item/${itemId}`,
    CLEAR: '/cart/clear',
  },
  // Downloads
  DOWNLOADS: {
    LIST: '/downloads',
    GENERATE: (planId: string, fileId: string) => `/downloads/generate/${planId}/${fileId}`,
    FILE: (token: string) => `/downloads/file/${token}`,
  },
  // Users (Admin)
  USERS: {
    LIST: '/users',
    BY_ID: (id: string) => `/users/${id}`,
    UPDATE_ROLE: (id: string) => `/users/${id}/role`,
    TOGGLE_STATUS: (id: string) => `/users/${id}/toggle-status`,
    DELETE: (id: string) => `/users/${id}`,
  },
} as const;

// Helper to build full API URLs
export const buildApiUrl = (endpoint: string): string => {
  const baseUrl = API_CONFIG.BASE_URL.replace(/\/$/, '');
  const apiPath = `/api/${API_CONFIG.API_VERSION}`;
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  return `${baseUrl}${apiPath}${cleanEndpoint}`;
};
