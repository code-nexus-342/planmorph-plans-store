import { Router } from 'express';
import { healthCheck as pgHealthCheck, getPoolStatus } from '../config/database';
import { logger } from '../utils/logger';

const router = Router();

// Basic health check
router.get('/', async (req, res) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'planmorph-api'
  });
});

// Detailed health check including database connections
router.get('/detailed', async (req, res) => {
  const healthStatus = {
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'planmorph-api',
    checks: {
      postgresql: false,
    },
    details: {
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      poolStats: null as any,
    }
  };

  try {
    // Check PostgreSQL connection
    healthStatus.checks.postgresql = await pgHealthCheck();
    healthStatus.details.poolStats = getPoolStatus();
  } catch (error) {
    logger.error('PostgreSQL health check failed:', error);
    healthStatus.checks.postgresql = false;
  }

  // Determine overall status
  const allChecksPass = Object.values(healthStatus.checks).every(check => check === true);
  healthStatus.status = allChecksPass ? 'ok' : 'degraded';

  const statusCode = allChecksPass ? 200 : 503;
  res.status(statusCode).json(healthStatus);
});

// Database connection stats
router.get('/db-stats', async (req, res) => {
  try {
    const stats = {
      postgresql: {
        pool: getPoolStatus(),
        healthy: await pgHealthCheck(),
      },
      timestamp: new Date().toISOString(),
    };

    res.status(200).json(stats);
  } catch (error) {
    logger.error('Error getting database stats:', error);
    res.status(500).json({
      error: 'Failed to get database statistics',
      timestamp: new Date().toISOString(),
    });
  }
});

export default router;
