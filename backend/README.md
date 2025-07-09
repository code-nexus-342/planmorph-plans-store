# PlanMorph Backend API

A robust, scalable Express.js backend for the PlanMorph house plans platform, built with TypeScript and Supabase.

## 🚀 Features

- **Authentication & Authorization**: JWT-based auth with role-based access control
- **Plans Management**: CRUD operations for house plans with search and filtering
- **Categories**: Organize plans by categories with slug-based routing
- **Reviews & Ratings**: User reviews with rating statistics
- **User Management**: Admin panel for user management
- **Security**: Rate limiting, CORS, helmet, input validation
- **Logging**: Structured logging with Winston
- **Error Handling**: Comprehensive error handling with custom error classes

## 🛠️ Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js with TypeScript
- **Database**: Supabase (PostgreSQL)
- **Authentication**: JWT tokens
- **Validation**: express-validator
- **Security**: Helmet, CORS, Rate limiting
- **Logging**: Winston
- **Development**: Nodemon, ts-node

## 📋 Prerequisites

- Node.js 18+ 
- npm or yarn
- Supabase account and project

## 🔧 Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd planmorph-plans-app/backend
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
# Edit .env with your configuration
```

4. Start the development server:
```bash
npm run dev
```

## 📝 Environment Variables

```env
# Server Configuration
NODE_ENV=development
PORT=5000
API_VERSION=v1

# Supabase Configuration
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_anon_key
SUPABASE_SERVICE_KEY=your_supabase_service_key

# JWT Configuration
JWT_SECRET=your_jwt_secret_min_32_chars
JWT_EXPIRES_IN=7d
JWT_REFRESH_EXPIRES_IN=30d

# CORS Configuration
CORS_ORIGIN=http://localhost:3000

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Logging
LOG_LEVEL=info
```

## 🛣️ API Routes

### Authentication (`/api/v1/auth`)
- `POST /register` - Register new user
- `POST /login` - User login
- `GET /profile` - Get user profile (protected)
- `PUT /profile` - Update user profile (protected)
- `PUT /change-password` - Change password (protected)
- `POST /refresh-token` - Refresh JWT token

### Plans (`/api/v1/plans`)
- `GET /` - Get all plans (with pagination and filtering)
- `GET /search` - Search plans
- `GET /featured` - Get featured plans
- `GET /:id` - Get plan by ID
- `POST /` - Create plan (admin/architect only)
- `PUT /:id` - Update plan (owner/admin only)
- `DELETE /:id` - Delete plan (owner/admin only)

### Categories (`/api/v1/categories`)
- `GET /` - Get all categories
- `GET /stats` - Get category statistics
- `GET /slug/:slug` - Get category by slug
- `GET /:id` - Get category by ID
- `POST /` - Create category (admin only)
- `PUT /:id` - Update category (admin only)
- `DELETE /:id` - Delete category (admin only)

### Reviews (`/api/v1/reviews`)
- `GET /plan/:planId` - Get reviews for a plan
- `GET /plan/:planId/stats` - Get review statistics
- `POST /plan/:planId` - Create review (authenticated)
- `PUT /:reviewId` - Update review (owner only)
- `DELETE /:reviewId` - Delete review (owner/admin)

### Users (`/api/v1/users`)
- `GET /` - Get all users (admin only)
- `GET /:id` - Get user by ID (admin only)
- `PUT /:id/role` - Update user role (admin only)
- `PUT /:id/toggle-status` - Toggle user status (admin only)
- `DELETE /:id` - Delete user (admin only)

## 🔒 Authentication

The API uses JWT tokens for authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

### User Roles
- `customer` - Regular users who can browse and review plans
- `architect` - Can create and manage their own plans
- `admin` - Full access to all resources

## 📊 Response Format

All API responses follow a consistent format:

### Success Response
```json
{
  "success": true,
  "data": { ... },
  "message": "Operation successful",
  "pagination": { // For paginated responses
    "page": 1,
    "limit": 10,
    "total": 100,
    "pages": 10
  }
}
```

### Error Response
```json
{
  "success": false,
  "error": {
    "message": "Error description",
    "details": { ... } // Additional error details (dev mode only)
  }
}
```

## 🗃️ Database Schema

The API expects the following Supabase tables:

- `users` - User accounts and profiles
- `plans` - House plans
- `categories` - Plan categories
- `plan_reviews` - User reviews for plans
- `architects` - Architect profiles

## 🧪 Testing

Run tests:
```bash
npm test
```

## 🚀 Deployment

1. Build the project:
```bash
npm run build
```

2. Start production server:
```bash
npm start
```

## 📄 Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build TypeScript to JavaScript
- `npm start` - Start production server
- `npm test` - Run tests
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript type checking

## 🔧 Project Structure

```
src/
├── config/          # Configuration files
├── controllers/     # Route controllers
├── middleware/      # Express middleware
├── routes/          # API routes
├── types/          # TypeScript type definitions
├── utils/          # Utility functions
├── app.ts          # Express app setup
└── server.ts       # Server entry point
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License.
