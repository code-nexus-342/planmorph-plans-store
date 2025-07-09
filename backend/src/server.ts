import cluster from 'cluster';
import os from 'os';
import app from './app';
import { config } from './config';
import { logger } from './utils/logger';
import { supabase } from './config/database';

const numCPUs = os.cpus().length;

// Master process - fork workers
if (cluster.isPrimary) {
  logger.info(`Master ${process.pid} is running`);
  logger.info(`Starting ${numCPUs} workers for optimal performance`);

  // Fork workers
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  // Handle worker exit and restart
  cluster.on('exit', (worker, code, signal) => {
    logger.error(`Worker ${worker.process.pid} died with code ${code} and signal ${signal}`);
    logger.info('Starting a new worker');
    cluster.fork();
  });

  // Graceful shutdown
  process.on('SIGTERM', () => {
    logger.info('SIGTERM received, shutting down gracefully');
    for (const id in cluster.workers) {
      cluster.workers[id]?.kill();
    }
  });

} else {
  // Worker process - start the server
  const server = app.listen(config.port, () => {
    logger.info(`Worker ${process.pid} started on port ${config.port}`);
    logger.info(`Environment: ${config.nodeEnv}`);
    logger.info(`API Version: ${config.apiVersion}`);
  });

  // Handle graceful shutdown for workers
  const gracefulShutdown = (signal: string) => {
    logger.info(`${signal} received by worker ${process.pid}, shutting down gracefully`);
    
    server.close(async () => {
      try {
        // Close database connections
        await supabase.auth.signOut();
        logger.info(`Worker ${process.pid} closed all connections`);
        process.exit(0);
      } catch (error) {
        logger.error('Error during graceful shutdown:', error);
        process.exit(1);
      }
    });

    // Force close after 30 seconds
    setTimeout(() => {
      logger.error(`Worker ${process.pid} could not close connections in time, forcefully shutting down`);
      process.exit(1);
    }, 30000);
  };

  // Listen for termination signals
  process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
  process.on('SIGINT', () => gracefulShutdown('SIGINT'));

  // Handle uncaught exceptions
  process.on('uncaughtException', (error) => {
    logger.error('Uncaught Exception:', error);
    gracefulShutdown('UNCAUGHT_EXCEPTION');
  });

  // Handle unhandled promise rejections
  process.on('unhandledRejection', (reason, promise) => {
    logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
    gracefulShutdown('UNHANDLED_REJECTION');
  });
}
