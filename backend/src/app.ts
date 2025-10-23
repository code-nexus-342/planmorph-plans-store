import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import session from 'express-session';
import RedisStore from 'connect-redis';
import 'express-async-errors';

import { config } from './config';
import { errorHandler, notFoundHandler } from './middleware/errorHandler';
import { logger, logStream } from './utils/logger';
import passport from './config/passport';
import { redis } from './config/cache';

// Import routes
import authRoutes from './routes/auth';
import plansRoutes from './routes/plans';
import categoriesRoutes from './routes/categories';
import reviewsRoutes from './routes/reviews';
import usersRoutes from './routes/users';
import cartRoutes from './routes/cart';
import downloadsRoutes from './routes/downloads';
import healthRoutes from './routes/health';
import newsletterRoutes from './routes/newsletter';
import toursRoutes from './routes/tours';

const app = express();

// Trust proxy for rate limiting behind reverse proxy
app.set('trust proxy', 1);

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
  crossOriginEmbedderPolicy: false,
}));

// CORS configuration
app.use(cors({
  origin: config.cors.origin,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: config.rateLimit.windowMs,
  max: config.rateLimit.maxRequests,
  message: {
    success: false,
    error: 'Too many requests from this IP, please try again later.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(limiter);

// Compression middleware
app.use(compression());

// Logging middleware
if (config.nodeEnv !== 'test') {
  app.use(morgan('combined', { stream: logStream }));
}

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Session middleware with Redis store (connect-redis v7)
let sessionStore;
if (redis) {
  try {
    sessionStore = new RedisStore({ 
      client: redis,
      prefix: 'planmorph:sess:',
      ttl: config.session.cookieMaxAge / 1000, // Convert to seconds
    });
    logger.info('Using Redis for session store');
  } catch (error) {
    logger.warn('Redis not available for sessions, falling back to memory store for development only:', error);
    if (config.nodeEnv === 'production') {
      throw new Error('Redis is required for session storage in production');
    }
    sessionStore = undefined; // Will use default MemoryStore
  }
} else {
  logger.info('Redis disabled - using memory store for sessions (development mode)');
  if (config.nodeEnv === 'production') {
    throw new Error('Redis is required for session storage in production');
  }
  sessionStore = undefined; // Will use default MemoryStore
}

const sessionConfig: session.SessionOptions = {
  ...(sessionStore && { store: sessionStore }),
  secret: config.session.secret,
  resave: false,
  saveUninitialized: false,
  rolling: true, // Reset expiry on activity
  cookie: {
    secure: config.nodeEnv === 'production',
    httpOnly: true,
    maxAge: config.session.cookieMaxAge,
    sameSite: config.nodeEnv === 'production' ? 'strict' : 'lax',
  },
  name: 'planmorph.sid', // Custom session name
};

app.use(session(sessionConfig));

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Health check endpoints
app.use('/health', healthRoutes);

// Health check endpoint (legacy)
app.get('/health-simple', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'PlanMorph API is running',
    timestamp: new Date().toISOString(),
    environment: config.nodeEnv,
    version: config.apiVersion,
  });
});

// API routes
const apiPrefix = `/api/${config.apiVersion}`;

app.use(`${apiPrefix}/auth`, authRoutes);
app.use(`${apiPrefix}/plans`, plansRoutes);
app.use(`${apiPrefix}/categories`, categoriesRoutes);
app.use(`${apiPrefix}/reviews`, reviewsRoutes);
app.use(`${apiPrefix}/users`, usersRoutes);
app.use(`${apiPrefix}/cart`, cartRoutes);
app.use(`${apiPrefix}/downloads`, downloadsRoutes);
app.use(`${apiPrefix}/newsletter`, newsletterRoutes);
app.use(`${apiPrefix}/tours`, toursRoutes);

// Catch unhandled routes
app.use(notFoundHandler);

// Global error handler
app.use(errorHandler);

export default app;
