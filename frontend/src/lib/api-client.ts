import { buildApiUrl } from './api-config';
import { ApiResponse, ApiError } from '../types';

// API Error Class
export class ApiClientError extends Error {
  public statusCode: number;
  public response?: unknown;

  constructor(message: string, statusCode: number, response?: unknown) {
    super(message);
    this.name = 'ApiClientError';
    this.statusCode = statusCode;
    this.response = response;
  }
}

// Request configuration interface
interface RequestConfig {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  headers?: Record<string, string>;
  body?: string | FormData | URLSearchParams | Blob | Record<string, unknown>;
  cache?: RequestCache;
  timeout?: number;
  retries?: number;
  retryDelay?: number;
}

// Circuit breaker for handling failures
class CircuitBreaker {
  private failures = 0;
  private lastFailureTime = 0;
  private state: 'CLOSED' | 'OPEN' | 'HALF_OPEN' = 'CLOSED';
  private readonly failureThreshold = 5;
  private readonly recoveryTimeout = 30000; // 30 seconds

  async execute<T>(operation: () => Promise<T>): Promise<T> {
    if (this.state === 'OPEN') {
      if (Date.now() - this.lastFailureTime > this.recoveryTimeout) {
        this.state = 'HALF_OPEN';
      } else {
        throw new ApiClientError('Circuit breaker is OPEN', 503);
      }
    }

    try {
      const result = await operation();
      
      if (this.state === 'HALF_OPEN') {
        this.reset();
      }
      
      return result;
    } catch (error) {
      this.recordFailure();
      throw error;
    }
  }

  private reset(): void {
    this.failures = 0;
    this.state = 'CLOSED';
  }

  private recordFailure(): void {
    this.failures++;
    this.lastFailureTime = Date.now();
    
    if (this.failures >= this.failureThreshold) {
      this.state = 'OPEN';
    }
  }
}

// API Client class with enhanced features for high-scale operations
class ApiClient {
  private baseHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  
  private circuitBreaker = new CircuitBreaker();
  private requestQueue: Array<() => void> = [];
  private activeRequests = 0;
  private readonly maxConcurrentRequests = 10;

  // Set authentication token
  setAuthToken(token: string | null) {
    if (token) {
      this.baseHeaders['Authorization'] = `Bearer ${token}`;
    } else {
      delete this.baseHeaders['Authorization'];
    }
  }

  // Queue management for concurrent requests
  private async acquireSlot(): Promise<void> {
    if (this.activeRequests < this.maxConcurrentRequests) {
      this.activeRequests++;
      return;
    }

    return new Promise((resolve) => {
      this.requestQueue.push(() => {
        this.activeRequests++;
        resolve();
      });
    });
  }

  private releaseSlot(): void {
    this.activeRequests--;
    if (this.requestQueue.length > 0) {
      const next = this.requestQueue.shift();
      next?.();
    }
  }

  // Enhanced retry logic with exponential backoff
  private async retryWithBackoff<T>(
    operation: () => Promise<T>,
    retries: number = 3,
    baseDelay: number = 1000
  ): Promise<T> {
    let lastError: Error;

    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        return await operation();
      } catch (error) {
        lastError = error as Error;
        
        // Don't retry on client errors (4xx) except 429
        if (error instanceof ApiClientError) {
          if (error.statusCode >= 400 && error.statusCode < 500 && error.statusCode !== 429) {
            throw error;
          }
        }

        if (attempt < retries) {
          const delay = baseDelay * Math.pow(2, attempt) + Math.random() * 1000;
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      }
    }

    throw lastError!;
  }

  // Generic request method with enhanced error handling and retry logic
  async request<T = unknown>(
    endpoint: string,
    config: RequestConfig = {}
  ): Promise<ApiResponse<T>> {
    const {
      method = 'GET',
      headers = {},
      body,
      cache = 'no-cache',
      timeout = 30000,
      retries = 3,
      retryDelay = 1000,
    } = config;

    await this.acquireSlot();

    try {
      return await this.circuitBreaker.execute(async () => {
        return await this.retryWithBackoff(async () => {
          const url = buildApiUrl(endpoint);
          const requestHeaders = { ...this.baseHeaders, ...headers };

          // Create abort controller for timeout
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), timeout);

          try {
            let processedBody: string | FormData | URLSearchParams | Blob | undefined;
            
            if (body) {
              if (typeof body === 'string' || body instanceof FormData || 
                  body instanceof URLSearchParams || body instanceof Blob) {
                processedBody = body;
              } else {
                // JSON serialize objects
                processedBody = JSON.stringify(body);
                requestHeaders['Content-Type'] = 'application/json';
              }
            }

            const response = await fetch(url, {
              method,
              headers: requestHeaders,
              body: processedBody,
              cache,
              signal: controller.signal,
            });

            clearTimeout(timeoutId);

            const data = await response.json();

            if (!response.ok) {
              const error = data as ApiError;
              throw new ApiClientError(
                error.error?.message || `HTTP ${response.status}: ${response.statusText}`,
                response.status,
                data
              );
            }

            return data as ApiResponse<T>;
          } catch (error) {
            clearTimeout(timeoutId);

            if (error instanceof ApiClientError) {
              throw error;
            }

            if (error instanceof Error) {
              if (error.name === 'AbortError') {
                throw new ApiClientError('Request timeout', 408);
              }
              throw new ApiClientError(error.message, 0);
            }

            throw new ApiClientError('Unknown error occurred', 0);
          }
        }, retries, retryDelay);
      });
    } finally {
      this.releaseSlot();
    }
  }

  // Batch request helper for multiple operations
  async batchRequest<T = unknown>(
    requests: Array<{ endpoint: string; config?: RequestConfig }>,
    concurrency: number = 5
  ): Promise<Array<ApiResponse<T> | ApiClientError>> {
    const results: Array<ApiResponse<T> | ApiClientError> = [];
    
    // Process requests in batches
    for (let i = 0; i < requests.length; i += concurrency) {
      const batch = requests.slice(i, i + concurrency);
      
      const batchPromises = batch.map(async ({ endpoint, config }) => {
        try {
          return await this.request<T>(endpoint, config);
        } catch (error) {
          return error as ApiClientError;
        }
      });
      
      const batchResults = await Promise.all(batchPromises);
      results.push(...batchResults);
    }
    
    return results;
  }

  // HTTP method helpers with optimized defaults
  async get<T = unknown>(endpoint: string, config?: Omit<RequestConfig, 'method'>) {
    return this.request<T>(endpoint, { 
      ...config, 
      method: 'GET',
      cache: config?.cache || 'default' // Allow caching for GET requests
    });
  }

  async post<T = unknown>(endpoint: string, body?: string | FormData | URLSearchParams | Blob | Record<string, unknown>, config?: Omit<RequestConfig, 'method' | 'body'>) {
    return this.request<T>(endpoint, { ...config, method: 'POST', body });
  }

  async put<T = unknown>(endpoint: string, body?: string | FormData | URLSearchParams | Blob | Record<string, unknown>, config?: Omit<RequestConfig, 'method' | 'body'>) {
    return this.request<T>(endpoint, { ...config, method: 'PUT', body });
  }

  async delete<T = unknown>(endpoint: string, config?: Omit<RequestConfig, 'method'>) {
    return this.request<T>(endpoint, { ...config, method: 'DELETE' });
  }

  async patch<T = unknown>(endpoint: string, body?: string | FormData | URLSearchParams | Blob | Record<string, unknown>, config?: Omit<RequestConfig, 'method' | 'body'>) {
    return this.request<T>(endpoint, { ...config, method: 'PATCH', body });
  }

  // Health check endpoint
  async healthCheck(): Promise<boolean> {
    try {
      await this.get('/health', { timeout: 5000, retries: 1 });
      return true;
    } catch {
      return false;
    }
  }

  // Get circuit breaker status
  getStatus(): { activeRequests: number; queueSize: number } {
    return {
      activeRequests: this.activeRequests,
      queueSize: this.requestQueue.length,
    };
  }
}

// Create and export singleton instance
export const apiClient = new ApiClient();

// Export the class for potential instantiation in tests or special cases
export { ApiClient };
