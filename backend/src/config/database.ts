import { createClient, SupabaseClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { logger } from '../utils/logger';

// Load environment variables
dotenv.config();

const supabaseUrl = 'https://lezwnuaciajahuevicfl.supabase.co';
const supabaseKey = process.env.SUPABASE_KEY;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseKey) {
  throw new Error('SUPABASE_KEY environment variable is required');
}

if (!supabaseServiceKey) {
  throw new Error('SUPABASE_SERVICE_KEY environment variable is required');
}

// Enhanced configuration for high-scale operations
const createSupabaseClient = (key: string, isAdmin = false): SupabaseClient => {
  return createClient(supabaseUrl, key, {
    auth: {
      autoRefreshToken: !isAdmin,
      persistSession: !isAdmin,
    },
    db: {
      schema: 'public',
    },
    global: {
      headers: {
        'x-application-name': 'planmorph-backend',
      },
    },
    // Enhanced configuration for production scale
    realtime: {
      params: {
        eventsPerSecond: 10,
      },
    },
  });
};

// Client for public operations (with RLS)
export const supabase = createSupabaseClient(supabaseKey);

// Admin client for server-side operations (bypasses RLS)
export const supabaseAdmin = createSupabaseClient(supabaseServiceKey, true);

// Connection pool configuration for high-scale operations
export const dbConfig = {
  url: supabaseUrl,
  key: supabaseKey,
  serviceKey: supabaseServiceKey,
  pool: {
    min: parseInt(process.env.DB_POOL_MIN || '5'),
    max: parseInt(process.env.DB_POOL_MAX || '100'),
    acquireTimeoutMillis: parseInt(process.env.DB_ACQUIRE_TIMEOUT || '30000'),
    createTimeoutMillis: parseInt(process.env.DB_CREATE_TIMEOUT || '30000'),
    destroyTimeoutMillis: parseInt(process.env.DB_DESTROY_TIMEOUT || '5000'),
    idleTimeoutMillis: parseInt(process.env.DB_IDLE_TIMEOUT || '30000'),
    reapIntervalMillis: parseInt(process.env.DB_REAP_INTERVAL || '1000'),
    createRetryIntervalMillis: parseInt(process.env.DB_CREATE_RETRY_INTERVAL || '200'),
  },
  retry: {
    maxAttempts: parseInt(process.env.DB_MAX_RETRY_ATTEMPTS || '3'),
    delay: parseInt(process.env.DB_RETRY_DELAY || '1000'),
    backoffMultiplier: parseFloat(process.env.DB_BACKOFF_MULTIPLIER || '2'),
    maxDelay: parseInt(process.env.DB_MAX_RETRY_DELAY || '10000'),
  },
  timeout: parseInt(process.env.DB_QUERY_TIMEOUT || '30000'),
};

// Retry logic wrapper for database operations
export const withRetry = async <T>(
  operation: () => Promise<T>,
  context: string = 'database operation'
): Promise<T> => {
  let lastError: Error;
  
  for (let attempt = 1; attempt <= dbConfig.retry.maxAttempts; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error as Error;
      
      if (attempt === dbConfig.retry.maxAttempts) {
        logger.error(`${context} failed after ${attempt} attempts:`, lastError);
        throw lastError;
      }
      
      const delay = Math.min(
        dbConfig.retry.delay * Math.pow(dbConfig.retry.backoffMultiplier, attempt - 1),
        dbConfig.retry.maxDelay
      );
      
      logger.warn(`${context} failed on attempt ${attempt}, retrying in ${delay}ms:`, lastError.message);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  
  throw lastError!;
};

// Enhanced query wrapper with timeout and retry
export const executeQuery = async <T>(
  queryFn: () => Promise<T>,
  context: string = 'query'
): Promise<T> => {
  return withRetry(async () => {
    return Promise.race([
      queryFn(),
      new Promise<never>((_, reject) => 
        setTimeout(() => reject(new Error(`Query timeout after ${dbConfig.timeout}ms`)), dbConfig.timeout)
      )
    ]);
  }, context);
};

export default supabase;
