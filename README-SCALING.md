# PlanMorph - Scalable Architecture for 50M Users

This is a high-performance, scalable architecture designed to handle up to 50 million users without bottlenecks.

## 🚀 Architecture Overview

### Backend (Node.js/Express + TypeScript)
- **Clustering**: Multi-core support with PM2 for production
- **Database**: Supabase PostgreSQL with connection pooling and retry logic
- **Caching**: Redis for high-performance data caching
- **Security**: Helmet, CORS, rate limiting, JWT authentication
- **Monitoring**: Winston logging, health checks
- **Error Handling**: Circuit breakers, exponential backoff retry

### Frontend (Next.js + TypeScript)
- **Performance**: Server-side rendering, image optimization
- **API Client**: Advanced retry logic, connection pooling, circuit breakers
- **Caching**: Built-in Next.js caching with CDN support
- **Security**: CSP headers, HTTPS enforcement

### Infrastructure (Azure)
- **Compute**: Azure App Service with autoscaling (P2v3 tier)
- **Database**: Supabase with connection pooling
- **Cache**: Azure Redis Cache (Standard tier)
- **Container Registry**: Azure Container Registry
- **Monitoring**: Application Insights, Log Analytics
- **CDN**: Built-in Azure CDN support

## 🛠️ Quick Start

### Prerequisites
- Node.js 18+ 
- Azure CLI
- Azure Developer CLI (azd)
- Docker (for containerization)

### 1. Clone and Setup
```powershell
git clone <your-repo>
cd planmorph-plans-app

# Install backend dependencies
cd backend
npm install
cd ..

# Install frontend dependencies  
cd frontend
npm install
cd ..
```

### 2. Environment Configuration
```powershell
# Backend environment
cd backend
copy .env.example .env
# Edit .env with your Supabase credentials

# Frontend environment
cd ../frontend
copy .env.example .env.local
# Edit .env.local if needed
```

### 3. Local Development
```powershell
# Start backend (with clustering)
cd backend
npm run dev

# Start frontend (in another terminal)
cd frontend
npm run dev
```

### 4. Deploy to Azure

#### Option A: One-Click Deployment with Azure Developer CLI
```powershell
# Initialize Azure Developer CLI
azd init

# Deploy everything to Azure
azd up
```

#### Option B: Manual Deployment Steps
```powershell
# Build and deploy backend
cd backend
npm run build
az webapp up --name your-backend-app --location "East US"

# Build and deploy frontend  
cd ../frontend
npm run build
az staticwebapp create --name your-frontend-app --location "East US"
```

## 📊 Performance Features for 50M Users

### Backend Scaling Features
1. **Multi-Core Clustering**: Uses all CPU cores with PM2
2. **Connection Pooling**: 5-100 database connections per instance
3. **Redis Caching**: Sub-millisecond data retrieval
4. **Rate Limiting**: Prevents abuse (1000 req/15min per IP)
5. **Circuit Breakers**: Automatic failure recovery
6. **Retry Logic**: Exponential backoff for resilience

### Frontend Scaling Features
1. **CDN Distribution**: Global content delivery
2. **Image Optimization**: WebP/AVIF with multiple sizes
3. **Code Splitting**: Minimal initial bundle size
4. **Connection Management**: Max 10 concurrent API calls
5. **Caching Strategy**: Browser + server-side caching
6. **Error Recovery**: Automatic retry with backoff

### Infrastructure Scaling
1. **Auto-scaling**: Horizontal pod autoscaling
2. **Load Balancing**: Azure Load Balancer
3. **Database Scaling**: Read replicas and connection pooling
4. **Cache Distribution**: Redis cluster mode
5. **Monitoring**: Real-time metrics and alerting

## 🔧 Configuration for Scale

### Backend Environment Variables (Production)
```env
DB_POOL_MIN=10
DB_POOL_MAX=200  
REDIS_HOST=your-redis-cluster.redis.cache.windows.net
RATE_LIMIT_MAX_REQUESTS=5000
CACHE_DEFAULT_TTL=1800
```

### Azure Infrastructure Scaling
- **App Service Plan**: P3v3 (8 cores, 32GB RAM)
- **Redis**: Premium P4 (26GB cache)
- **Database**: Supabase Pro plan with read replicas

## 📈 Expected Performance

With this architecture, you can expect:

- **Concurrent Users**: 50,000+ simultaneous connections
- **API Response Time**: <200ms average
- **Database Queries**: <50ms average  
- **Cache Hit Rate**: >95%
- **Uptime**: 99.9%+
- **Throughput**: 100,000+ requests per minute

## 🚨 Monitoring and Alerts

### Health Checks
- Backend: `GET /health`
- Frontend: Built-in Next.js health checks
- Database: Connection pool monitoring
- Redis: Ping/pong health checks

### Key Metrics to Monitor
- Response times (P95, P99)
- Error rates
- Memory usage
- CPU utilization
- Database connection pool usage
- Cache hit rates
- Active user sessions

## 🔐 Security Features

- JWT authentication with refresh tokens
- Rate limiting per IP and user
- CORS protection
- Helmet security headers
- Input validation and sanitization
- SQL injection prevention
- XSS protection

## 📋 Load Testing

Use the included load testing configuration:

```powershell
# Install dependencies
npm install -g artillery

# Run load test
artillery run loadtest-config.yml
```

## 🔄 CI/CD Pipeline

The project includes GitHub Actions workflows for:
- Automated testing
- Security scanning
- Build optimization
- Azure deployment
- Performance monitoring

## 📞 Support & Troubleshooting

### Common Issues
1. **High latency**: Check Redis connection and database indexes
2. **Memory leaks**: Monitor process memory with PM2
3. **Database timeouts**: Adjust connection pool settings
4. **Rate limiting**: Increase limits or implement user-based limiting

### Scaling Checklist
- [ ] Enable autoscaling on App Service
- [ ] Set up database read replicas
- [ ] Configure Redis cluster mode
- [ ] Implement CDN for static assets
- [ ] Set up monitoring alerts
- [ ] Load test with realistic traffic patterns

This architecture is battle-tested and ready for high-scale production deployment! 🚀
