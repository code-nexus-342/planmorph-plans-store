import { Pool, PoolClient, PoolConfig } from 'pg';
import dotenv from 'dotenv';
import { logger } from '../utils/logger';

// Load environment variables
dotenv.config();

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error('DATABASE_URL environment variable is required');
}

// Enhanced PostgreSQL connection pool configuration optimized for Neon
const poolConfig: PoolConfig = {
  connectionString: databaseUrl,
  ssl: {
    rejectUnauthorized: false // Required for hosted databases like Neon
  },
  // Connection pool settings optimized for Neon's serverless pooler
  max: parseInt(process.env.DB_POOL_SIZE || '10'), // Reduced for Neon pooler
  min: parseInt(process.env.DB_MIN_POOL_SIZE || '2'), // Lower minimum
  idleTimeoutMillis: parseInt(process.env.DB_IDLE_TIMEOUT || '20000'), // Shorter idle timeout
  connectionTimeoutMillis: parseInt(process.env.DB_CONNECTION_TIMEOUT || '10000'),
  
  // Connection optimizations for Neon
  keepAlive: true,
  keepAliveInitialDelayMillis: 10000,
  
  // Query timeout
  query_timeout: parseInt(process.env.DB_QUERY_TIMEOUT || '30000'),
  
  // Application name for connection tracking
  application_name: 'planmorph-backend',
  
  // Allow exit on idle to reduce hanging connections
  allowExitOnIdle: true,
};

// Create PostgreSQL connection pool
const pool = new Pool(poolConfig);

// Enhanced connection event handlers
pool.on('connect', (client) => {
  const processId = (client as any).processID || 'unknown';
  logger.info('New database client connected', {
    processId,
    poolTotalCount: pool.totalCount,
    poolIdleCount: pool.idleCount,
    poolWaitingCount: pool.waitingCount
  });
  
  // Set connection parameters for better stability with Neon
  client.query('SET statement_timeout = 30000').catch(err => 
    logger.warn('Failed to set statement_timeout', { error: err.message })
  );
  client.query('SET idle_in_transaction_session_timeout = 30000').catch(err => 
    logger.warn('Failed to set idle_in_transaction_session_timeout', { error: err.message })
  );
});

pool.on('acquire', (client) => {
  const processId = (client as any).processID || 'unknown';
  logger.debug('Client acquired from pool', { processId });
});

pool.on('remove', (client) => {
  const processId = (client as any).processID || 'unknown';
  logger.info('Database client removed from pool', {
    processId,
    poolTotalCount: pool.totalCount
  });
});

pool.on('error', (err, client) => {
  const processId = client ? (client as any).processID || 'unknown' : 'unknown';
  logger.error('Database pool error', {
    error: err.message,
    stack: err.stack,
    processId
  });
  
  // Don't crash on connection errors - pool will handle reconnection
  if (err.message.includes('Connection terminated')) {
    logger.warn('Connection terminated - pool will create new connection on next request');
  }
});

// Database query function with enhanced error handling and retry logic
export const query = async (text: string, params?: any[], retries = 2): Promise<any> => {
  const start = Date.now();
  let client: PoolClient | undefined;
  let lastError: any;
  
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      client = await pool.connect();
      const result = await client.query(text, params);
      const duration = Date.now() - start;
      
      // Log slow queries
      if (duration > 1000) {
        logger.info('Query performance metrics', {
          queryTime: duration,
          resultCount: result.rowCount,
          slowQuery: true
        });
      }
      
      return result;
    } catch (error) {
      lastError = error;
      const duration = Date.now() - start;
      const isConnectionError = error instanceof Error && 
        (error.message.includes('Connection terminated') || 
         error.message.includes('connect ECONNREFUSED') ||
         error.message.includes('ENOTFOUND'));
      
      logger.error('Database query error:', {
        attempt: attempt + 1,
        maxRetries: retries + 1,
        duration: `${duration}ms`,
        error: error instanceof Error ? error.message : String(error),
        willRetry: isConnectionError && attempt < retries
      });
      
      // Retry on connection errors
      if (isConnectionError && attempt < retries) {
        await new Promise(resolve => setTimeout(resolve, 1000 * (attempt + 1)));
        continue;
      }
      
      throw error;
    } finally {
      if (client) {
        try {
          client.release();
        } catch (releaseError) {
          logger.warn('Error releasing client', { 
            error: releaseError instanceof Error ? releaseError.message : String(releaseError) 
          });
        }
      }
    }
  }
  
  throw lastError;
};

// Transaction wrapper with retry logic
export const transaction = async <T>(
  callback: (client: PoolClient) => Promise<T>,
  retries = 2
): Promise<T> => {
  let lastError: any;
  
  for (let attempt = 0; attempt <= retries; attempt++) {
    let client: PoolClient | undefined;
    
    try {
      client = await pool.connect();
      await client.query('BEGIN');
      const result = await callback(client);
      await client.query('COMMIT');
      return result;
    } catch (error) {
      lastError = error;
      
      if (client) {
        try {
          await client.query('ROLLBACK');
        } catch (rollbackError) {
          logger.warn('Error during transaction rollback', {
            error: rollbackError instanceof Error ? rollbackError.message : String(rollbackError)
          });
        }
      }
      
      const isConnectionError = error instanceof Error && 
        (error.message.includes('Connection terminated') || 
         error.message.includes('connect ECONNREFUSED'));
      
      if (isConnectionError && attempt < retries) {
        logger.warn('Transaction failed due to connection error, retrying...', {
          attempt: attempt + 1,
          maxRetries: retries + 1
        });
        await new Promise(resolve => setTimeout(resolve, 1000 * (attempt + 1)));
        continue;
      }
      
      throw error;
    } finally {
      if (client) {
        try {
          client.release();
        } catch (releaseError) {
          logger.warn('Error releasing transaction client', {
            error: releaseError instanceof Error ? releaseError.message : String(releaseError)
          });
        }
      }
    }
  }
  
  throw lastError;
};

// Health check function
export const healthCheck = async (): Promise<boolean> => {
  try {
    const result = await query('SELECT 1 as healthy');
    return result.rows.length > 0 && result.rows[0].healthy === 1;
  } catch (error) {
    logger.error('Database health check failed:', error);
    return false;
  }
};

// Pool status for monitoring
export const getPoolStatus = () => {
  return {
    totalConnections: pool.totalCount,
    idleConnections: pool.idleCount,
    waitingClients: pool.waitingCount
  };
};

// Graceful shutdown
export const closePool = async (): Promise<void> => {
  logger.info('Closing PostgreSQL connection pool...');
  await pool.end();
  logger.info('PostgreSQL connection pool closed');
};

// Export the pool for advanced usage
export { pool };

// Default export
export default {
  query,
  transaction,
  healthCheck,
  getPoolStatus,
  closePool,
  pool
};
