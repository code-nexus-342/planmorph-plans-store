// Database Types
export interface User {
  id: string;
  email: string;
  full_name: string;
  first_name?: string;
  last_name?: string;
  avatar_url?: string;
  phone?: string;
  role: 'user' | 'architect' | 'admin';
  is_verified: boolean;
  subscription_tier: 'free' | 'premium' | 'pro';
  oauth_provider?: 'google' | 'apple';
  oauth_provider_id?: string;
  created_at: string;
  updated_at: string;
}

export interface Plan {
  id: string;
  title: string;
  description: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  sqft: number;
  style: string;
  architect_id: string;
  images: string[];
  files: PlanFile[];
  features: string[];
  specifications: Record<string, string>;
  is_featured: boolean;
  is_published: boolean;
  rating: number;
  review_count: number;
  download_count: number;
  created_at: string;
  updated_at: string;
}

export interface PlanFile {
  id: string;
  plan_id: string;
  file_name: string;
  file_type: 'pdf' | 'dwg' | 'zip' | 'image';
  file_url: string;
  file_size: number;
  description?: string;
  created_at: string;
}

export interface Review {
  id: string;
  plan_id: string;
  user_id: string;
  rating: number;
  comment?: string;
  created_at: string;
  updated_at: string;
}

export interface Purchase {
  id: string;
  user_id: string;
  plan_id: string;
  price_paid: number;
  payment_method: string;
  stripe_payment_intent_id?: string;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  purchased_at: string;
  plan?: Plan;
}

export interface Download {
  id: string;
  user_id: string;
  plan_id: string;
  file_id: string;
  download_token: string;
  downloaded_at?: string;
  expires_at: string;
  download_count: number;
  max_downloads: number;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image_url?: string;
  plan_count: number;
  created_at: string;
}

export interface Architect {
  id: string;
  user_id: string;
  company_name?: string;
  license_number?: string;
  bio?: string;
  portfolio_url?: string;
  specialties: string[];
  verified: boolean;
  plan_count: number;
  rating: number;
  created_at: string;
  updated_at: string;
}

export interface CartItem {
  id: string;
  user_id: string;
  plan_id: string;
  quantity: number;
  added_at: string;
  plan?: Plan;
}

export interface Cart {
  items: CartItem[];
  total_items: number;
  total_price: number;
}

// API Request/Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface PaginationQuery {
  page?: number;
  limit?: number;
  sort?: string;
  order?: 'asc' | 'desc';
}

export interface PlanFilters extends PaginationQuery {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  bedrooms?: number[];
  bathrooms?: number[];
  minSqft?: number;
  maxSqft?: number;
  style?: string[];
  features?: string[];
  architect?: string;
  rating?: number;
  search?: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  fullName: string;
  phone?: string;
}

export interface CreatePlanRequest {
  title: string;
  description: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  sqft: number;
  style: string;
  features: string[];
  specifications: Record<string, string>;
  category_id: string;
}

export interface UpdatePlanRequest extends Partial<CreatePlanRequest> {
  is_featured?: boolean;
  is_published?: boolean;
}

// Express Request Extensions
export interface AuthenticatedRequest extends Request {
  user?: User;
  userId?: string;
}

// Error Types
export interface AppError extends Error {
  statusCode: number;
  isOperational: boolean;
}

export interface ValidationError {
  field: string;
  message: string;
  value?: any;
}
