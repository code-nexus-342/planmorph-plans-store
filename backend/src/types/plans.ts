// Enhanced TypeScript types for house plans system
// Optimized for performance and type safety

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  iconUrl?: string;
  sortOrder: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  
  // Relations
  subcategories?: Subcategory[];
  planCount?: number; // Computed field
}

export interface Subcategory {
  id: string;
  categoryId: string;
  name: string;
  slug: string;
  description?: string;
  sortOrder: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  
  // Relations
  category?: Category;
  planCount?: number; // Computed field
}

export interface HousePlan {
  id: string;
  
  // Basic information
  title: string;
  description?: string;
  seoSlug: string;
  
  // Classification
  categoryId: string;
  subcategoryId?: string;
  
  // Specifications
  bedrooms: number;
  bathrooms: number;
  squareFootage: number;
  stories: number;
  garageSpaces: number;
  
  // Dimensions
  lotWidth?: number;
  lotDepth?: number;
  houseWidth?: number;
  houseDepth?: number;
  
  // Pricing and availability
  priceTier: 'free' | 'standard' | 'premium' | 'exclusive';
  basePrice: number;
  isFeatured: boolean;
  isPopular: boolean;
  isAvailable: boolean;
  
  // File references (cloud storage URLs)
  thumbnailUrl?: string;
  mainImageUrl?: string;
  
  // Performance metrics
  viewCount: number;
  downloadCount: number;
  favoriteCount: number;
  popularityScore: number;
  
  // SEO
  metaTitle?: string;
  metaDescription?: string;
  searchKeywords: string[];
  
  // Timestamps
  createdAt: Date;
  updatedAt: Date;
  publishedAt?: Date;
  
  // Relations (loaded on demand)
  category?: Category;
  subcategory?: Subcategory;
  images?: PlanImage[];
  files?: PlanFile[];
  features?: PlanFeature[];
  
  // Computed fields
  recentViews?: number;
  isNewPlan?: boolean; // Published within last 30 days
}

export interface PlanImage {
  id: string;
  planId: string;
  imageUrl: string;
  imageType: 'exterior' | 'interior' | 'floor_plan' | 'elevation' | '3d_render';
  title?: string;
  description?: string;
  sortOrder: number;
  isPrimary: boolean;
  createdAt: Date;
  
  // Relations
  plan?: HousePlan;
}

export interface PlanFile {
  id: string;
  planId: string;
  fileUrl: string;
  fileType: 'blueprint_pdf' | 'specification_pdf' | 'cad_dwg' | 'revit_rvt' | '3d_model';
  fileName: string;
  fileSize?: number; // in bytes
  description?: string;
  isPremium: boolean;
  createdAt: Date;
  
  // Relations
  plan?: HousePlan;
  
  // Computed fields
  fileSizeFormatted?: string; // "2.5 MB"
}

export interface PlanFeature {
  id: string;
  name: string;
  description?: string;
  icon?: string;
  category?: string; // 'architectural', 'energy', 'lifestyle', etc.
  isActive: boolean;
  createdAt: Date;
}

export interface UserFavorite {
  userId: string;
  planId: string;
  createdAt: Date;
  
  // Relations
  plan?: HousePlan;
}

export interface PlanView {
  id: string;
  planId: string;
  userId?: string;
  ipAddress?: string;
  userAgent?: string;
  viewedAt: Date;
  
  // Relations
  plan?: HousePlan;
}

export interface PlanDownload {
  id: string;
  planId: string;
  fileId: string;
  userId: string;
  downloadedAt: Date;
  
  // Relations
  plan?: HousePlan;
  file?: PlanFile;
}

// Search and filtering types
export interface PlanSearchFilters {
  // Text search
  query?: string;
  
  // Classification filters
  categoryId?: string;
  subcategoryId?: string;
  
  // Specification filters
  minBedrooms?: number;
  maxBedrooms?: number;
  minBathrooms?: number;
  maxBathrooms?: number;
  minSquareFootage?: number;
  maxSquareFootage?: number;
  stories?: number[];
  minGarageSpaces?: number;
  
  // Feature filters
  features?: string[]; // Feature IDs
  
  // Availability filters
  priceTiers?: ('free' | 'standard' | 'premium' | 'exclusive')[];
  isFeatured?: boolean;
  isPopular?: boolean;
  
  // Sorting options
  sortBy?: 'popularity' | 'newest' | 'price_low' | 'price_high' | 'square_footage' | 'bedrooms';
  sortOrder?: 'asc' | 'desc';
  
  // Pagination
  page?: number;
  limit?: number;
}

export interface PlanSearchResult {
  plans: HousePlan[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
  
  // Search metadata
  facets?: {
    categories?: Array<{ id: string; name: string; count: number }>;
    priceRanges?: Array<{ min: number; max: number; count: number }>;
    bedroomCounts?: Array<{ count: number; planCount: number }>;
    bathroomCounts?: Array<{ count: number; planCount: number }>;
  };
}

// API response types
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  errors?: string[];
  meta?: {
    timestamp: string;
    requestId: string;
    version: string;
  };
}

export interface PaginatedResponse<T> {
  items: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

// Database query options
export interface QueryOptions {
  include?: {
    category?: boolean;
    subcategory?: boolean;
    images?: boolean;
    files?: boolean;
    features?: boolean;
  };
  limit?: number;
  offset?: number;
  orderBy?: Array<{
    field: string;
    direction: 'asc' | 'desc';
  }>;
}

// Performance monitoring types
export interface PerformanceMetrics {
  queryTime: number; // milliseconds
  cacheHit: boolean;
  resultCount: number;
  indexesUsed: string[];
}

// File storage types
export interface FileUploadResult {
  success: boolean;
  fileUrl: string;
  fileName: string;
  fileSize: number;
  mimeType: string;
  uploadedAt: Date;
}

export interface ImageProcessingOptions {
  generateThumbnail: boolean;
  thumbnailSize?: { width: number; height: number };
  optimizeForWeb: boolean;
  formats?: ('webp' | 'jpeg' | 'png')[];
}

// Cache types
export interface CacheKey {
  prefix: string;
  identifier: string;
  version?: string;
}

export interface CacheOptions {
  ttl?: number; // Time to live in seconds
  tags?: string[]; // For cache invalidation
}

// Analytics types
export interface PlanAnalytics {
  planId: string;
  period: 'day' | 'week' | 'month' | 'year';
  startDate: Date;
  endDate: Date;
  
  metrics: {
    views: number;
    uniqueViews: number;
    downloads: number;
    favorites: number;
    conversionRate: number; // views to downloads
  };
  
  trends: {
    viewTrend: number; // percentage change from previous period
    downloadTrend: number;
    favoriteTrend: number;
  };
}

// Bulk operations types
export interface BulkOperationResult<T> {
  success: boolean;
  processed: number;
  errors: Array<{
    item: T;
    error: string;
  }>;
  results: T[];
}

export interface BulkPlanUpdate {
  planIds: string[];
  updates: Partial<HousePlan>;
  options?: {
    validateOnly?: boolean;
    skipValidation?: boolean;
  };
}

// Types are exported individually above
