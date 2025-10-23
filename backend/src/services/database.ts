import { Pool, PoolClient, QueryResult, QueryResultRow } from 'pg';
import { config } from '../config';
import { logger } from '../utils/logger';
import { PerformanceMetrics } from '../types/plans';

/**
 * High-performance PostgreSQL database service with connection pooling
 * Implements Azure best practices for database connections and error handling
 */
export class DatabaseService {
  private pool: Pool;
  private static instance: DatabaseService;

  private constructor() {
    this.pool = new Pool({
      // Connection configuration
      connectionString: config.database.url,
      host: config.database.host,
      port: config.database.port,
      database: config.database.name,
      user: config.database.user,
      password: config.database.password,
      
      // Performance optimization settings
      max: config.database.poolSize || 20, // Maximum connections in pool
      min: config.database.minPoolSize || 5, // Minimum connections to maintain
      idleTimeoutMillis: 30000, // Close idle connections after 30s
      connectionTimeoutMillis: 5000, // Timeout for getting connection
      
      // Reliability settings
      maxUses: 7500, // Retire connections after 7500 uses
      keepAlive: true,
      keepAliveInitialDelayMillis: 0,
      
      // SSL configuration for Azure
      ssl: config.nodeEnv === 'production' ? {
        rejectUnauthorized: false, // Azure requires this
        ca: config.database.sslCa,
      } : false,
      
      // Query timeout
      query_timeout: 30000, // 30 second query timeout
      statement_timeout: 30000,
    });

    // Pool event handlers for monitoring
    this.pool.on('connect', (client) => {
      logger.info('New database client connected', {
        processId: (client as any).processID,
        poolTotalCount: this.pool.totalCount,
        poolIdleCount: this.pool.idleCount,
        poolWaitingCount: this.pool.waitingCount
      });
    });

    this.pool.on('error', (err, client) => {
      logger.error('Database pool error', {
        error: err.message,
        stack: err.stack,
        processId: (client as any)?.processID
      });
    });

    this.pool.on('remove', (client) => {
      logger.info('Database client removed from pool', {
        processId: (client as any).processID,
        poolTotalCount: this.pool.totalCount
      });
    });

    // Graceful shutdown handler
    process.on('SIGINT', () => this.close());
    process.on('SIGTERM', () => this.close());
  }

  /**
   * Singleton pattern for database service
   */
  public static getInstance(): DatabaseService {
    if (!DatabaseService.instance) {
      DatabaseService.instance = new DatabaseService();
    }
    return DatabaseService.instance;
  }

  /**
   * Execute a query with performance monitoring and error handling
   */
  public async query<T extends QueryResultRow = any>(
    text: string, 
    params?: any[], 
    options?: { 
      timeout?: number;
      trackPerformance?: boolean;
      cacheTtl?: number;
    }
  ): Promise<QueryResult<T> & { metrics?: PerformanceMetrics }> {
    const startTime = Date.now();
    let client: PoolClient | undefined;
    
    try {
      // Get client from pool with timeout
      client = await this.pool.connect();
      
      // Set query timeout if specified
      if (options?.timeout) {
        await client.query(`SET statement_timeout = ${options.timeout}`);
      }

      logger.debug('Executing query', {
        query: text.substring(0, 100) + (text.length > 100 ? '...' : ''),
        paramsCount: params?.length || 0,
        poolStats: {
          total: this.pool.totalCount,
          idle: this.pool.idleCount,
          waiting: this.pool.waitingCount
        }
      });

      // Execute query
      const result = await client.query<T>(text, params);
      
      const queryTime = Date.now() - startTime;
      
      // Performance monitoring
      if (options?.trackPerformance || queryTime > 1000) {
        const metrics: PerformanceMetrics = {
          queryTime,
          cacheHit: false, // Will be set by cache layer
          resultCount: result.rowCount || 0,
          indexesUsed: [] // Could be populated by EXPLAIN if needed
        };

        logger.info('Query performance metrics', {
          queryTime,
          resultCount: result.rowCount,
          slowQuery: queryTime > 1000
        });

        return { ...result, metrics };
      }

      return result;

    } catch (error) {
      const queryTime = Date.now() - startTime;
      
      logger.error('Database query error', {
        error: error instanceof Error ? error.message : 'Unknown error',
        query: text.substring(0, 200),
        paramsCount: params?.length || 0,
        queryTime,
        stack: error instanceof Error ? error.stack : undefined
      });

      // Re-throw with additional context
      if (error instanceof Error) {
        error.message = `Database query failed: ${error.message}`;
      }
      throw error;

    } finally {
      // Always release client back to pool
      if (client) {
        client.release();
      }
    }
  }

  /**
   * Execute multiple queries in a transaction
   */
  public async transaction<T extends QueryResultRow>(
    queries: Array<{ text: string; params?: any[] }>,
    options?: { isolationLevel?: 'READ_COMMITTED' | 'SERIALIZABLE' }
  ): Promise<QueryResult<T>[]> {
    const client = await this.pool.connect();
    const results: QueryResult<T>[] = [];

    try {
      // Start transaction
      await client.query('BEGIN');
      
      // Set isolation level if specified
      if (options?.isolationLevel) {
        await client.query(`SET TRANSACTION ISOLATION LEVEL ${options.isolationLevel}`);
      }

      logger.debug('Starting database transaction', {
        queryCount: queries.length,
        isolationLevel: options?.isolationLevel
      });

      // Execute all queries
      for (const query of queries) {
        const result = await client.query<T>(query.text, query.params);
        results.push(result);
      }

      // Commit transaction
      await client.query('COMMIT');
      
      logger.info('Database transaction committed', {
        queryCount: queries.length,
        totalRows: results.reduce((sum, r) => sum + (r.rowCount || 0), 0)
      });

      return results;

    } catch (error) {
      // Rollback on error
      await client.query('ROLLBACK');
      
      logger.error('Database transaction failed and rolled back', {
        error: error instanceof Error ? error.message : 'Unknown error',
        queryCount: queries.length
      });

      throw error;

    } finally {
      client.release();
    }
  }

  /**
   * Execute a query with automatic retry for transient failures
   */
  public async queryWithRetry<T extends QueryResultRow = any>(
    text: string,
    params?: any[],
    maxRetries: number = 3,
    retryDelay: number = 1000
  ): Promise<QueryResult<T>> {
    let lastError: Error;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        return await this.query<T>(text, params);
      } catch (error) {
        lastError = error instanceof Error ? error : new Error('Unknown error');
        
        // Check if error is retryable (connection issues, deadlocks, etc.)
        const isRetryable = this.isRetryableError(lastError);
        
        if (!isRetryable || attempt === maxRetries) {
          throw lastError;
        }

        logger.warn('Retrying database query after error', {
          attempt,
          maxRetries,
          error: lastError.message,
          retryDelay
        });

        // Exponential backoff delay
        await this.delay(retryDelay * Math.pow(2, attempt - 1));
      }
    }

    throw lastError!;
  }

  /**
   * Get database pool statistics for monitoring
   */
  public getPoolStats() {
    return {
      totalCount: this.pool.totalCount,
      idleCount: this.pool.idleCount,
      waitingCount: this.pool.waitingCount,
      maxCount: this.pool.options.max || 10,
      minCount: this.pool.options.min || 0
    };
  }

  /**
   * Health check for database connectivity
   */
  public async healthCheck(): Promise<{
    healthy: boolean;
    latency: number;
    poolStats: {
      totalCount: number;
      idleCount: number;
      waitingCount: number;
      maxCount: number;
      minCount: number;
    };
  }> {
    const startTime = Date.now();
    
    try {
      await this.query('SELECT 1 as health_check');
      const latency = Date.now() - startTime;
      
      return {
        healthy: true,
        latency,
        poolStats: this.getPoolStats()
      };
    } catch (error) {
      logger.error('Database health check failed', { error });
      
      return {
        healthy: false,
        latency: Date.now() - startTime,
        poolStats: this.getPoolStats()
      };
    }
  }

  /**
   * Close all connections and shut down pool
   */
  public async close(): Promise<void> {
    try {
      await this.pool.end();
      logger.info('Database pool closed successfully');
    } catch (error) {
      logger.error('Error closing database pool', { error });
    }
  }

  /**
   * Check if an error is retryable (transient)
   */
  private isRetryableError(error: Error): boolean {
    const retryableMessages = [
      'connection terminated',
      'connection reset',
      'connection timeout',
      'deadlock detected',
      'could not serialize access',
      'server closed the connection',
      'connection to server was lost'
    ];

    const message = error.message.toLowerCase();
    return retryableMessages.some(msg => message.includes(msg));
  }

  /**
   * Utility function for delays
   */
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Execute raw SQL file (for migrations)
   */
  public async executeSqlFile(sqlContent: string): Promise<void> {
    const client = await this.pool.connect();
    
    try {
      await client.query(sqlContent);
      logger.info('SQL file executed successfully');
    } catch (error) {
      logger.error('Failed to execute SQL file', { error });
      throw error;
    } finally {
      client.release();
    }
  }
}

// Export singleton instance
export const db = DatabaseService.getInstance();

// Export types for external use
export type { PerformanceMetrics };
