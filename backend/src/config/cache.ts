import Redis from 'ioredis';
import { logger } from '../utils/logger';
import { config } from './index';

// Redis connection configuration for high-scale operations
const redisConfig = {
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379'),
  password: process.env.REDIS_PASSWORD,
  db: parseInt(process.env.REDIS_DB || '0'),
  keyPrefix: process.env.REDIS_KEY_PREFIX || 'planmorph:',
  
  // Connection pool settings for high concurrency
  maxRetriesPerRequest: 3,
  retryDelayOnFailover: 100,
  lazyConnect: true,
  keepAlive: 30000,
  connectTimeout: 10000,
  commandTimeout: 5000,
  
  // Cluster configuration (if using Redis Cluster)
  enableReadyCheck: true,
  maxLoadingTimeout: 5000,
};

// Create Redis client with error handling
export const redis = new Redis(redisConfig);

// Redis event handlers
redis.on('connect', () => {
  logger.info('Redis connected successfully');
});

redis.on('ready', () => {
  logger.info('Redis ready for operations');
});

redis.on('error', (error: Error) => {
  logger.error('Redis connection error:', error);
});

redis.on('close', () => {
  logger.warn('Redis connection closed');
});

redis.on('reconnecting', () => {
  logger.info('Redis reconnecting...');
});

// Cache utility functions
export class CacheManager {
  private defaultTTL = parseInt(process.env.CACHE_DEFAULT_TTL || '3600'); // 1 hour

  // Set cache with TTL
  async set(key: string, value: any, ttl?: number): Promise<void> {
    try {
      const serializedValue = JSON.stringify(value);
      if (ttl || this.defaultTTL) {
        await redis.setex(key, ttl || this.defaultTTL, serializedValue);
      } else {
        await redis.set(key, serializedValue);
      }
      logger.debug(`Cache set: ${key}`);
    } catch (error) {
      logger.error(`Cache set error for key ${key}:`, error);
    }
  }

  // Get cache value
  async get<T = any>(key: string): Promise<T | null> {
    try {
      const value = await redis.get(key);
      if (value) {
        logger.debug(`Cache hit: ${key}`);
        return JSON.parse(value) as T;
      }
      logger.debug(`Cache miss: ${key}`);
      return null;
    } catch (error) {
      logger.error(`Cache get error for key ${key}:`, error);
      return null;
    }
  }

  // Delete cache key
  async del(key: string): Promise<void> {
    try {
      await redis.del(key);
      logger.debug(`Cache deleted: ${key}`);
    } catch (error) {
      logger.error(`Cache delete error for key ${key}:`, error);
    }
  }

  // Delete multiple cache keys
  async delPattern(pattern: string): Promise<void> {
    try {
      const keys = await redis.keys(pattern);
      if (keys.length > 0) {
        await redis.del(...keys);
        logger.debug(`Cache deleted pattern: ${pattern} (${keys.length} keys)`);
      }
    } catch (error) {
      logger.error(`Cache delete pattern error for ${pattern}:`, error);
    }
  }

  // Cache with automatic refresh
  async getOrSet<T>(
    key: string,
    fetchFunction: () => Promise<T>,
    ttl?: number
  ): Promise<T> {
    try {
      // Try to get from cache first
      const cached = await this.get<T>(key);
      if (cached !== null) {
        return cached;
      }

      // If not in cache, fetch and set
      const value = await fetchFunction();
      await this.set(key, value, ttl);
      return value;
    } catch (error) {
      logger.error(`Cache getOrSet error for key ${key}:`, error);
      // Fallback to direct fetch if cache fails
      return await fetchFunction();
    }
  }

  // Increment counter (useful for rate limiting)
  async increment(key: string, ttl?: number): Promise<number> {
    try {
      const value = await redis.incr(key);
      if (value === 1 && (ttl || this.defaultTTL)) {
        await redis.expire(key, ttl || this.defaultTTL);
      }
      return value;
    } catch (error) {
      logger.error(`Cache increment error for key ${key}:`, error);
      return 0;
    }
  }

  // Set with NX (only if not exists)
  async setNX(key: string, value: any, ttl?: number): Promise<boolean> {
    try {
      const serializedValue = JSON.stringify(value);
      const result = await redis.set(key, serializedValue, 'EX', ttl || this.defaultTTL, 'NX');
      return result === 'OK';
    } catch (error) {
      logger.error(`Cache setNX error for key ${key}:`, error);
      return false;
    }
  }

  // Health check
  async healthCheck(): Promise<boolean> {
    try {
      const result = await redis.ping();
      return result === 'PONG';
    } catch (error) {
      logger.error('Redis health check failed:', error);
      return false;
    }
  }
}

// Export singleton instance
export const cacheManager = new CacheManager();

// Graceful shutdown
export const closeRedis = async (): Promise<void> => {
  try {
    await redis.quit();
    logger.info('Redis connection closed gracefully');
  } catch (error) {
    logger.error('Error closing Redis connection:', error);
  }
};

export default redis;
