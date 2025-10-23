/**
 * Simple Server for Development
 * 
 * This is a lightweight single-process server for local development.
 * Use this instead of the cluster mode to prevent system freezing.
 * 
 * For production with clustering, use: npm run start
 */

import app from './app';
import { config } from './config';
import { logger } from './utils/logger';
import { closePool } from './config/database';

// Single process server - perfect for development
const server = app.listen(config.port, () => {
  logger.info(`🚀 PlanMorph API Server started (Development Mode)`);
  logger.info(`📍 Port: ${config.port}`);
  logger.info(`🌍 Environment: ${config.nodeEnv}`);
  logger.info(`📦 API Version: ${config.apiVersion}`);
  logger.info(`\n✅ Server is ready!`);
  logger.info(`   - Health check: http://localhost:${config.port}/health`);
  logger.info(`   - API endpoint: http://localhost:${config.port}/api/${config.apiVersion}`);
  logger.info(`\n💡 Running in single-process mode (lightweight for development)`);
  logger.info(`   To run with clustering (production mode), use: npm run dev:cluster\n`);
});

// Graceful shutdown
const gracefulShutdown = (signal: string) => {
  logger.info(`\n${signal} received, shutting down gracefully...`);
  
  server.close(async () => {
    try {
      // Close database connections
      await closePool();
      logger.info('✅ All connections closed');
      logger.info('👋 Server shut down successfully');
      process.exit(0);
    } catch (error) {
      logger.error('❌ Error during shutdown:', error);
      process.exit(1);
    }
  });

  // Force close after 10 seconds (reduced from 30 for dev)
  setTimeout(() => {
    logger.error('⚠️  Could not close connections in time, forcing shutdown');
    process.exit(1);
  }, 10000);
};

// Listen for termination signals
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  logger.error('❌ Uncaught Exception:', error);
  gracefulShutdown('UNCAUGHT_EXCEPTION');
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  logger.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
  gracefulShutdown('UNHANDLED_REJECTION');
});

export default server;
