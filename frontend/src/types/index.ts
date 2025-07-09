// Frontend types based on backend API
export interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  phone?: string;
  role: 'customer' | 'architect' | 'admin';
  is_active: boolean;
  avatar_url?: string;
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
  square_feet: number;
  category_id: string;
  architect_id?: string;
  features?: string[];
  images?: string[];
  is_featured: boolean;
  is_active: boolean;
  average_rating?: number;
  review_count?: number;
  created_at: string;
  updated_at: string;
  // Populated relationships
  categories?: Category;
  architects?: Architect;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Architect {
  id: string;
  first_name: string;
  last_name: string;
  company_name?: string;
  bio?: string;
  email: string;
}

export interface Review {
  id: string;
  plan_id: string;
  user_id: string;
  rating: number;
  comment?: string;
  created_at: string;
  updated_at: string;
  users?: {
    first_name: string;
    last_name: string;
  };
}

export interface ReviewStats {
  total_reviews: number;
  average_rating: number;
  rating_distribution: Record<1 | 2 | 3 | 4 | 5, number>;
}

export interface CartItem {
  id: string;
  user_id: string;
  plan_id: string;
  quantity: number;
  added_at: string;
  plans?: Plan;
}

export interface Cart {
  items: CartItem[];
  total_items: number;
  total_price: number;
}

export interface Purchase {
  id: string;
  user_id: string;
  plan_id: string;
  price_paid: number;
  payment_method: string;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  purchased_at: string;
  plans?: Plan;
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

// API Response Types
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface ApiError {
  success: false;
  error: {
    message: string;
    details?: string | Record<string, unknown>;
  };
}

// Authentication Types
export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  phone?: string;
}

export interface UserProfile {
  first_name?: string;
  last_name?: string;
  phone?: string;
}

// Search and Filter Types
export interface PlanFilters {
  q?: string;
  category?: string;
  min_price?: number;
  max_price?: number;
  bedrooms?: number;
  bathrooms?: number;
  architect?: string;
  sort?: string;
  page?: number;
  limit?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

// Create/Update Types
export interface CreatePlanData {
  title: string;
  description: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  square_feet: number;
  category_id: string;
  architect_id?: string;
  features?: string[];
  images?: string[];
}

export type UpdatePlanData = Partial<CreatePlanData>;

export interface CreateReviewData {
  rating: number;
  comment?: string;
}

// Auth Context Types
export interface AuthContextType {
  user: User | null;
  tokens: AuthTokens | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  updateProfile: (data: UserProfile) => Promise<void>;
  refreshToken: () => Promise<void>;
}
