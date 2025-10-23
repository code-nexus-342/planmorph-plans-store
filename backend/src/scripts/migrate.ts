import { promises as fs } from 'fs';
import { join } from 'path';
import { Pool } from 'pg';
import { config } from '../config';
import { logger } from '../utils/logger';

/**
 * Database migration script with Azure best practices
 * Implements proper error handling, logging, and security measures
 */
export class MigrationRunner {
  private pool: Pool;
  private migrationsDir: string;

  constructor() {
    // Initialize database pool with secure configuration
    this.pool = new Pool({
      connectionString: config.database.url,
      host: config.database.host,
      port: config.database.port,
      database: config.database.name,
      user: config.database.user,
      password: config.database.password,
      
      // Connection pool settings for reliability
      max: 2, // Limited connections for migrations
      min: 1,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 10000,
      
      // SSL configuration for production
      ssl: config.nodeEnv === 'production' ? {
        rejectUnauthorized: false
      } : false,
    });

    // Set migrations directory path
    this.migrationsDir = join(__dirname, '..', '..', '..', 'database', 'migrations');
    
    // Setup graceful shutdown
    process.on('SIGINT', () => this.close());
    process.on('SIGTERM', () => this.close());
  }

  /**
   * Create migrations table if it doesn't exist
   */
  private async createMigrationsTable(): Promise<void> {
    const query = `
      CREATE TABLE IF NOT EXISTS migrations (
        id SERIAL PRIMARY KEY,
        filename VARCHAR(255) NOT NULL UNIQUE,
        applied_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        checksum VARCHAR(64) NOT NULL
      );
    `;
    
    try {
      await this.pool.query(query);
      logger.info('Migrations table created or already exists');
    } catch (error) {
      logger.error('Failed to create migrations table:', error);
      throw error;
    }
  }

  /**
   * Get list of applied migrations
   */
  private async getAppliedMigrations(): Promise<string[]> {
    try {
      const result = await this.pool.query(
        'SELECT filename FROM migrations ORDER BY applied_at ASC'
      );
      return result.rows.map(row => row.filename);
    } catch (error) {
      logger.error('Failed to get applied migrations:', error);
      throw error;
    }
  }

  /**
   * Generate checksum for migration content
   */
  private generateChecksum(content: string): string {
    const crypto = require('crypto');
    return crypto.createHash('sha256').update(content).digest('hex');
  }

  /**
   * Execute a single migration file
   */
  private async executeMigration(filename: string, content: string): Promise<void> {
    const client = await this.pool.connect();
    
    try {
      // Start transaction
      await client.query('BEGIN');
      
      // Execute migration SQL
      logger.info(`Executing migration: ${filename}`);
      await client.query(content);
      
      // Record migration in migrations table
      const checksum = this.generateChecksum(content);
      await client.query(
        'INSERT INTO migrations (filename, checksum) VALUES ($1, $2)',
        [filename, checksum]
      );
      
      // Commit transaction
      await client.query('COMMIT');
      logger.info(`Migration ${filename} completed successfully`);
      
    } catch (error) {
      // Rollback on error
      await client.query('ROLLBACK');
      logger.error(`Migration ${filename} failed:`, error);
      throw error;
    } finally {
      client.release();
    }
  }

  /**
   * Run all pending migrations
   */
  public async runMigrations(): Promise<void> {
    try {
      logger.info('Starting database migrations...');
      
      // Ensure migrations table exists
      await this.createMigrationsTable();
      
      // Get list of applied migrations
      const appliedMigrations = await this.getAppliedMigrations();
      logger.info(`Found ${appliedMigrations.length} applied migrations`);
      
      // Read all migration files
      const migrationFiles = await fs.readdir(this.migrationsDir);
      const sqlFiles = migrationFiles
        .filter(file => file.endsWith('.sql'))
        .sort(); // Execute in alphabetical order
      
      logger.info(`Found ${sqlFiles.length} migration files`);
      
      // Execute pending migrations
      let executedCount = 0;
      for (const filename of sqlFiles) {
        if (!appliedMigrations.includes(filename)) {
          const filePath = join(this.migrationsDir, filename);
          const content = await fs.readFile(filePath, 'utf8');
          
          await this.executeMigration(filename, content);
          executedCount++;
        } else {
          logger.info(`Skipping already applied migration: ${filename}`);
        }
      }
      
      if (executedCount === 0) {
        logger.info('No pending migrations to execute');
      } else {
        logger.info(`Successfully executed ${executedCount} migrations`);
      }
      
    } catch (error) {
      logger.error('Migration process failed:', error);
      throw error;
    }
  }

  /**
   * Verify database connection
   */
  public async testConnection(): Promise<void> {
    try {
      const client = await this.pool.connect();
      const result = await client.query('SELECT NOW() as current_time');
      client.release();
      
      logger.info('Database connection successful:', {
        currentTime: result.rows[0].current_time,
        database: config.database.name,
        host: config.database.host
      });
    } catch (error) {
      logger.error('Database connection failed:', error);
      throw error;
    }
  }

  /**
   * Close database connections
   */
  public async close(): Promise<void> {
    try {
      await this.pool.end();
      logger.info('Database connections closed');
    } catch (error) {
      logger.error('Error closing database connections:', error);
    }
  }
}

/**
 * CLI interface for running migrations
 */
async function runMigrationsCLI(): Promise<void> {
  const runner = new MigrationRunner();
  
  try {
    // Test database connection first
    await runner.testConnection();
    
    // Run migrations
    await runner.runMigrations();
    
    logger.info('Migration process completed successfully');
    process.exit(0);
    
  } catch (error) {
    logger.error('Migration process failed:', error);
    process.exit(1);
  } finally {
    await runner.close();
  }
}

// Run migrations if this file is executed directly
if (require.main === module) {
  runMigrationsCLI();
}

export default MigrationRunner;
