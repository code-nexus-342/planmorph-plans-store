# PlanMorph - House Plans Marketplace (Read-Only Storefront)

## 📋 Project Overview

PlanMorph is a comprehensive marketplace platform for browsing, purchasing, and downloading architectural house plans. This application serves as a **read-only storefront** where users can view and purchase plans, but cannot upload or modify them.

## 🏗️ Architecture Overview

### Tech Stack
- **Frontend**: Next.js 15 with TypeScript, Tailwind CSS
- **Backend**: Node.js with Express.js, TypeScript
- **Database**: PostgreSQL
- **Caching**: Redis (optional)
- **Authentication**: JWT with OAuth (Google)
- **Deployment**: Docker containers

### Key Features
- **House Plan Browsing**: Search, filter, and view architectural plans (read-only)
- **User Authentication**: JWT-based auth with OAuth providers
- **Shopping Cart**: Add plans to cart and purchase
- **File Downloads**: Secure download system for purchased plans
- **Reviews & Ratings**: User feedback system
- **User Dashboard**: Track purchases, favorites, downloads
- **3D Tours**: Interactive plan visualization
- **Newsletter System**: Email subscription management
- **Mobile Responsive**: Modern, mobile-first design

## ⚠️ Important: Plan Management

**This application does NOT support plan uploads or modifications.**

- ✅ Users can browse and search plans
- ✅ Users can purchase and download plans  
- ✅ Users can review and favorite plans
- ❌ NO plan upload functionality
- ❌ NO plan editing functionality
- ❌ NO mock/seed data included

All plan creation, updates, and deletions are handled through a **separate administrative application**.

## 📁 Project Structure

```
planmorph-plans-app/
├── backend/                    # Express.js API server
│   ├── src/
│   │   ├── app.ts             # Main application setup
│   │   ├── server.ts          # Server entry point
│   │   ├── config/            # Configuration files
│   │   │   ├── index.ts       # Environment config
│   │   │   ├── database.ts    # Supabase connection
│   │   │   ├── cache.ts       # Redis configuration
│   │   │   └── passport.ts    # OAuth strategies
│   │   ├── controllers/       # Request handlers
│   │   │   ├── authController.ts
│   │   │   ├── plansController.ts
│   │   │   ├── cartController.ts
│   │   │   ├── usersController.ts
│   │   │   ├── reviewsController.ts
│   │   │   ├── categoriesController.ts
│   │   │   └── downloadsController.ts
│   │   ├── middleware/         # Express middleware
│   │   │   ├── auth.ts        # Authentication middleware
│   │   │   ├── errorHandler.ts # Error handling
│   │   │   └── validation.ts   # Input validation
│   │   ├── routes/            # API route definitions
│   │   ├── services/          # Business logic
│   │   ├── types/             # TypeScript type definitions
│   │   ├── utils/             # Utility functions
│   │   └── scripts/           # Database migration & seeding
│   ├── Dockerfile             # Container configuration
│   ├── ecosystem.config.json  # PM2 clustering config
│   └── package.json          # Dependencies & scripts
├── frontend/                  # Next.js web application
│   ├── src/
│   │   ├── app/              # Next.js App Router
│   │   │   ├── layout.tsx    # Root layout
│   │   │   ├── page.tsx      # Homepage
│   │   │   ├── auth/         # Authentication pages
│   │   │   ├── plans/        # Plan browsing & details
│   │   │   ├── cart/         # Shopping cart
│   │   │   ├── categories/   # Plan categories
│   │   │   ├── architects/   # Architect profiles
│   │   │   ├── 3d-tours/     # 3D visualization
│   │   │   └── pricing/      # Pricing information
│   │   ├── components/       # Reusable UI components
│   │   │   ├── Navigation.tsx
│   │   │   ├── Footer.tsx
│   │   │   ├── HeroSection.tsx
│   │   │   ├── PlanCard.tsx
│   │   │   ├── PlanGrid.tsx
│   │   │   ├── SearchAndFilter.tsx
│   │   │   └── LoadingSpinner.tsx
│   │   ├── contexts/         # React Context providers
│   │   │   └── AuthContext.tsx
│   │   ├── hooks/            # Custom React hooks
│   │   │   ├── usePlans.ts
│   │   │   └── useCart.ts
│   │   ├── lib/              # Utility libraries
│   │   │   ├── api-client.ts # HTTP client with retry logic
│   │   │   └── api-config.ts # API configuration
│   │   └── types/            # TypeScript interfaces
│   │       └── index.ts      # Shared type definitions
│   ├── Dockerfile            # Container configuration
│   └── package.json         # Dependencies & scripts
├── database/                 # Database schema & migrations
│   └── migrations/
│       └── 001_create_house_plans_schema.sql
└── Documentation files      # Setup & integration guides
```

## 🗄️ Database Schema

### Core Tables
- **house_plans**: Main table for plan metadata
- **categories**: Plan categorization
- **subcategories**: Granular classification
- **plan_images**: Multiple images per plan
- **plan_files**: Downloadable files
- **plan_views**: Analytics tracking
- **plan_downloads**: Download tracking
- **user_favorites**: User favorites system

### Key Features
- **UUID Primary Keys**: For scalability and security
- **Full-Text Search**: PostgreSQL GIN indexes
- **Performance Optimized**: Strategic indexing for common queries
- **Analytics Ready**: View and download tracking
- **Flexible Pricing**: Multiple pricing tiers
- **SEO Optimized**: Meta fields and search keywords

## 🔐 Authentication & Security

### Authentication Flow
1. **JWT Tokens**: Access & refresh token system
2. **OAuth Integration**: Google OAuth support
3. **Session Management**: Secure cookie-based sessions
4. **Role-Based Access**: Customer, Architect, Admin roles

### Security Features
- **Helmet.js**: Security headers
- **Rate Limiting**: Protection against abuse
- **CORS Configuration**: Cross-origin resource sharing
- **Input Validation**: Express-validator middleware
- **Error Handling**: Structured error responses
- **Logging**: Winston for comprehensive logging

## 🚀 Performance & Scalability

### Backend Optimizations
- **PM2 Clustering**: Multi-core CPU utilization
- **Connection Pooling**: Database connection management
- **Redis Caching**: High-performance caching layer
- **Circuit Breaker**: Fault tolerance patterns
- **Compression**: Gzip compression middleware
- **Health Checks**: Load balancer integration

### Frontend Optimizations
- **Next.js 15**: Latest performance improvements
- **Image Optimization**: Automatic WebP conversion
- **Code Splitting**: Lazy loading components
- **Bundle Optimization**: Tree shaking and minification
- **CDN Ready**: Static asset optimization
- **Responsive Design**: Mobile-first approach

### Infrastructure Scalability
- **Auto-scaling**: Horizontal scaling support
- **Load Balancing**: Multiple instance support
- **CDN Integration**: Global content distribution
- **Monitoring**: Application performance telemetry
- **Containerization**: Docker for consistent deployment

## 📊 API Documentation

### Base URL
- **Development**: `http://localhost:8000/api/v1`
- **Production**: `https://your-domain.com/api/v1`

### Core Endpoints

#### Authentication
- `POST /auth/login` - User login
- `POST /auth/register` - User registration
- `POST /auth/refresh` - Refresh access token
- `GET /auth/profile` - Get user profile
- `PUT /auth/profile` - Update user profile

#### Plans
- `GET /plans` - List plans with filtering/sorting (public, read-only)
- `GET /plans/:id` - Get plan details (public, read-only)
- `GET /plans/featured` - Get featured plans (public, read-only)
- `GET /plans/search` - Search plans (public, read-only)

**Note**: Plan creation/modification endpoints removed - handled by external admin app

#### Cart & Purchases
- `GET /cart` - Get user's cart
- `POST /cart` - Add item to cart
- `DELETE /cart/:id` - Remove from cart
- `POST /cart/checkout` - Process purchase

#### Reviews
- `GET /plans/:id/reviews` - Get plan reviews
- `POST /plans/:id/reviews` - Add review
- `PUT /reviews/:id` - Update review
- `DELETE /reviews/:id` - Delete review

## 🛠️ Development Setup

### Prerequisites
- Node.js 18+
- PostgreSQL 14+
- Redis (optional for caching)

### Installation
```bash
# Clone repository
git clone <repository-url>
cd planmorph-plans-app

# Backend setup
cd backend
npm install
cp .env.example .env
# Configure environment variables
npm run migrate:dev
npm run seed:dev

# Frontend setup
cd ../frontend
npm install
cp .env.example .env.local
# Configure environment variables

# Start development servers
cd ../backend && npm run dev &
cd ../frontend && npm run dev
```

### Environment Variables

#### Backend (.env)
```env
NODE_ENV=development
PORT=8000
DATABASE_URL=postgresql://user:pass@localhost:5432/planmorph
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_key
JWT_SECRET=your_jwt_secret
REDIS_URL=redis://localhost:6379
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

#### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id
```

## 🚀 Deployment

### Docker Deployment
```bash
# Build images
docker build -t planmorph-backend ./backend
docker build -t planmorph-frontend ./frontend

# Run with Docker Compose
docker-compose up -d
```

## 🧪 Testing

### Backend Tests
```bash
cd backend
npm test                 # Run all tests
npm run test:watch      # Watch mode
npm run test:coverage   # Coverage report
```

### Frontend Tests
```bash
cd frontend
npm test                # Run tests
npm run test:watch     # Watch mode
```

## 📈 Monitoring & Analytics

### Application Insights
- **Performance Monitoring**: Request/response times
- **Error Tracking**: Exception logging and alerts
- **Custom Metrics**: Business-specific analytics
- **User Analytics**: Page views and user journeys

### Health Checks
- **Backend Health**: `/health` endpoint
- **Database Connectivity**: Connection pool status
- **Redis Status**: Cache availability
- **External Services**: Third-party service health

## 🔧 Configuration

### PM2 Clustering (Production)
```json
{
  "apps": [{
    "name": "planmorph-backend",
    "script": "dist/server.js",
    "instances": "max",
    "exec_mode": "cluster",
    "env_production": {
      "NODE_ENV": "production"
    }
  }]
}
```

### Next.js Configuration
```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  compress: true,
  images: {
    domains: ['images.unsplash.com'],
    formats: ['image/webp', 'image/avif']
  }
}
```

## 📋 TODO & Roadmap

### Phase 1 (Current)
- [x] Core authentication system
- [x] Plan browsing and search (read-only)
- [x] Shopping cart functionality
- [x] Basic review system
- [x] Newsletter system
- [x] User dashboard

### Phase 2 (Next)
- [ ] Payment integration (Stripe)
- [ ] Advanced search filters
- [ ] Email notifications
- [ ] Enhanced analytics

### Phase 3 (Future)
- [ ] Mobile app (React Native)
- [ ] AI-powered recommendations
- [ ] Advanced 3D visualization
- [ ] Subscription plans

**Note**: Plan upload/management features are handled by separate admin application

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 📞 Support

For support and questions:
- **Documentation**: Check the setup guides in the project root
- **Issues**: Open GitHub issues for bugs and feature requests
- **Email**: support@planmorph.com

---

**Built with ❤️ by the PlanMorph Team**
