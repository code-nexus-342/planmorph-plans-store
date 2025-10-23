import { Pool } from 'pg';
import { config } from '../config';
import { logger } from '../utils/logger';

/**
 * Simple database connection test
 */
async function testDatabaseConnection(): Promise<void> {
  // Use default PostgreSQL connection for testing
  const pool = new Pool({
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    database: process.env.DB_NAME || 'planmorph',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || '',
    max: 1,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 5000,
  });

  try {
    logger.info('Testing database connection...');
    
    const client = await pool.connect();
    const result = await client.query('SELECT version()');
    client.release();
    
    logger.info('Database connection successful!');
    logger.info('PostgreSQL version:', result.rows[0].version);
    
    // Test if database exists
    const dbResult = await pool.query('SELECT current_database()');
    logger.info('Connected to database:', dbResult.rows[0].current_database);
    
  } catch (error: any) {
    logger.error('Database connection failed:', error);
    
    if (error.code === 'ECONNREFUSED') {
      logger.error('PostgreSQL server is not running. Please start PostgreSQL service.');
    } else if (error.code === '28P01') {
      logger.error('Authentication failed. Please check your database credentials.');
    } else if (error.code === '3D000') {
      logger.error('Database does not exist. Please create the database first.');
    }
    
    throw error;
  } finally {
    await pool.end();
  }
}

// Run connection test
testDatabaseConnection()
  .then(() => {
    logger.info('Database connection test completed successfully');
    process.exit(0);
  })
  .catch((error) => {
    logger.error('Database connection test failed:', error);
    process.exit(1);
  });
