# 🏗️ PlanMorph - Architectural Excellence

**Modern house plans marketplace with 3D tours and real-time user dashboard**

PlanMorph is a full-stack web application for browsing, purchasing, and downloading architectural house plans. Built with Next.js 15, Express.js, and PostgreSQL (Neon), it features a modern floating UI, real-time 3D tours, and comprehensive user management.

---

## ✨ Features

### 🎨 Modern User Experience
- **Floating Action Bar**: Smooth, accessible navigation that appears on scroll
- **Minimal Header**: Clean, distraction-free interface
- **Fully Responsive**: Optimized for all screen sizes (320px to 1536px+)
- **Modern Dashboard**: Real-time stats, purchases, downloads, and favorites

### 🏠 Plan Management
- Browse architectural plans by category
- Search and filter plans
- Add plans to cart and favorites
- Secure checkout process
- Download purchased plans

### 🔐 Authentication & Security
- JWT-based authentication
- Google OAuth integration
- Email verification with OTP
- Secure password hashing
- Protected API routes

### 📊 User Features
- Personal dashboard with live statistics
- Purchase history tracking
- Download management
- Favorites collection
- Profile settings
- Newsletter subscription

### 🎥 3D Tours
- Interactive 3D plan visualization
- Embedded tour support
- Mobile-optimized viewing

---

## 🚀 Tech Stack

### Frontend
- **Framework**: Next.js 15 (React 19)
- **Language**: TypeScript
- **Styling**: Tailwind CSS with custom breakpoints (xs, sm, md, lg, xl, 2xl)
- **State Management**: React Context API
- **HTTP Client**: Axios
- **Icons**: Lucide React

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: PostgreSQL (Neon serverless)
- **Authentication**: Passport.js + JWT
- **Security**: Helmet, CORS, bcrypt
- **Email**: Nodemailer

### Infrastructure
- **Database**: Neon PostgreSQL (serverless with optimized connection pooling)
- **Caching**: Redis (optional)
- **Deployment**: Docker support
- **Process Manager**: PM2

---

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher (or yarn/pnpm)
- **PostgreSQL**: v14.0 or higher (or use Neon - recommended)
- **Git**: v2.0.0 or higher

---

## �️ Installation

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/planmorph-plans-store.git
cd planmorph-plans-store
```

### 2. Install Dependencies

```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

---

## ⚙️ Configuration

### Backend Environment Variables

Create a `.env` file in the `backend` directory:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database Configuration (Neon PostgreSQL - Recommended)
DATABASE_URL=postgresql://username:password@host/database?sslmode=require

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRES_IN=7d

# Google OAuth Configuration
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback

# Email Configuration (Nodemailer)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_password
EMAIL_FROM="PlanMorph <noreply@planmorph.com>"

# Frontend URL
FRONTEND_URL=http://localhost:3000

# Redis Configuration (optional)
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=

# File Upload Configuration
UPLOAD_DIR=uploads
MAX_FILE_SIZE=10485760
```

### Frontend Environment Variables

Create a `.env.local` file in the `frontend` directory:

```env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:5000/api

# Google OAuth (optional)
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id

# App Configuration
NEXT_PUBLIC_APP_NAME=PlanMorph
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

## 🗄️ Database Setup

### Using Neon (Recommended)

1. Create a free account at [neon.tech](https://neon.tech)
2. Create a new project
3. Copy the connection string
4. Update `DATABASE_URL` in backend `.env`

### Run Migrations

```bash
cd backend
npm run migrate
```

This will create all required tables:
- `users` - User accounts
- `house_plans` - Architectural plans
- `categories` - Plan categories
- `cart_items` - Shopping cart
- `orders` - Purchase orders
- `order_items` - Order details
- `downloads` - Download tracking
- `favorites` - User favorites
- `reviews` - Plan reviews
- `newsletter_subscribers` - Newsletter list
- `tours_3d` - 3D tour data

---

## 🚀 Running the Application

### Development Mode

#### Terminal 1 - Start Backend
```bash
cd backend
npm run dev
```
Backend runs on `http://localhost:5000`

#### Terminal 2 - Start Frontend
```bash
cd frontend
npm run dev
```
Frontend runs on `http://localhost:3000`

### Production Build

#### Backend
```bash
cd backend
npm run build
npm start
```

#### Frontend
```bash
cd frontend
npm run build
npm start
```

---

## 📁 Project Structure

```
planmorph-plans-store/
├── frontend/                 # Next.js frontend
│   ├── src/
│   │   ├── app/             # App router pages
│   │   │   ├── dashboard/   # User dashboard
│   │   │   ├── plans/       # Plan pages
│   │   │   └── auth/        # Auth pages
│   │   ├── components/      # React components
│   │   │   ├── dashboard/   # Dashboard components
│   │   │   │   ├── ModernDashboard.tsx
│   │   │   │   └── tabs/    # Dashboard tab components
│   │   │   ├── layout/      # Layout components
│   │   │   │   ├── MinimalHeader.tsx
│   │   │   │   └── FloatingActionBar.tsx
│   │   │   └── ui/          # Reusable UI components
│   │   ├── contexts/        # React contexts (AuthContext)
│   │   ├── hooks/           # Custom hooks
│   │   ├── lib/             # Utilities (api client)
│   │   └── types/           # TypeScript types
│   ├── public/              # Static assets
│   ├── tailwind.config.ts   # Custom breakpoints config
│   └── package.json
│
├── backend/                 # Express.js API
│   ├── src/
│   │   ├── config/          # Configuration
│   │   │   ├── database.ts  # Neon-optimized connection
│   │   │   └── passport.ts  # Auth config
│   │   ├── controllers/     # Route controllers
│   │   ├── middleware/      # Express middleware
│   │   ├── routes/          # API routes
│   │   └── utils/           # Utilities
│   ├── scripts/             # Database scripts
│   └── package.json
│
├── database/                # Database files
│   └── migrations/          # SQL migrations
│
├── TECHNICAL_ARCHITECTURE.md
├── PROJECT_DOCUMENTATION.md
├── API_DOCUMENTATION.md
└── README.md
```

---

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/verify-email` - Verify email with OTP
- `GET /api/auth/google` - Google OAuth login
- `GET /api/auth/google/callback` - OAuth callback

### Users
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update profile
- `GET /api/users/dashboard-stats` - Dashboard statistics
- `GET /api/users/recent-activity` - Recent activity
- `GET /api/users/purchases` - Purchase history
- `GET /api/users/favorites` - User favorites
- `PUT /api/users/settings` - Update settings

### Plans
- `GET /api/plans` - List all plans
- `GET /api/plans/:id` - Get plan details
- `GET /api/plans/category/:category` - Plans by category
- `POST /api/plans/:id/favorite` - Toggle favorite

### Cart
- `GET /api/cart` - Get cart items
- `POST /api/cart` - Add to cart
- `PUT /api/cart/:id` - Update cart item
- `DELETE /api/cart/:id` - Remove from cart

### Orders
- `POST /api/orders` - Create order
- `GET /api/orders` - Get user orders

### Downloads
- `GET /api/downloads` - Get available downloads
- `GET /api/downloads/:id` - Download file

### Reviews
- `GET /api/reviews/:planId` - Get plan reviews
- `POST /api/reviews` - Create review

### Categories
- `GET /api/categories` - List all categories

### Newsletter
- `POST /api/newsletter/subscribe` - Subscribe
- `POST /api/newsletter/unsubscribe` - Unsubscribe

### 3D Tours
- `GET /api/tours/:planId` - Get plan's 3D tour

See [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) for detailed API documentation.

---

## 🎨 Responsive Design

PlanMorph uses custom Tailwind breakpoints for optimal responsiveness:

| Breakpoint | Min Width | Target Devices |
|------------|-----------|----------------|
| `xs` | 475px | Small phones |
| `sm` | 640px | Phones |
| `md` | 768px | Tablets |
| `lg` | 1024px | Small laptops |
| `xl` | 1280px | Desktops |
| `2xl` | 1536px | Large screens |

### Key Responsive Features
- Adaptive navigation with floating action bar
- Responsive grid layouts (2-col mobile → 4-col desktop)
- Touch-optimized interactions
- Mobile-first approach
- Adaptive spacing and typography

---

## 🐳 Docker Deployment

### Build and Run

```bash
# Build images
docker-compose build

# Start services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

Application will be available at:
- Frontend: `http://localhost:3000`
- Backend: `http://localhost:5000`

---

## 📚 Additional Documentation

- [Technical Architecture](./TECHNICAL_ARCHITECTURE.md) - System design and architecture
- [Project Documentation](./PROJECT_DOCUMENTATION.md) - Detailed project information
- [API Documentation](./API_DOCUMENTATION.md) - Complete API reference

---

## 🔒 Security

- JWT tokens for authentication
- Password hashing with bcrypt
- SQL injection prevention
- CORS configuration
- Helmet.js security headers
- Input validation and sanitization
- Environment variable protection

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/AmazingFeature`
3. Commit your changes: `git commit -m 'Add some AmazingFeature'`
4. Push to the branch: `git push origin feature/AmazingFeature`
5. Open a Pull Request

### Coding Standards
- Follow TypeScript best practices
- Use ESLint and Prettier
- Write meaningful commit messages
- Add tests for new features
- Update documentation

---

## 🔧 Troubleshooting

### Common Issues

**Dashboard Keeps Loading**
- Check backend is running on port 5000
- Verify JWT token is valid in localStorage
- Check browser console for API errors

**Database Connection Failed**
- Verify `DATABASE_URL` in backend `.env`
- Ensure Neon project is active
- Check connection pool settings (max: 10, min: 2)

**OAuth Not Working**
- Verify Google OAuth credentials
- Check redirect URIs match exactly
- Ensure OAuth consent screen is configured

**Build Errors**
- Run `npm install` in both frontend and backend
- Clear Next.js cache: `rm -rf .next`
- Check TypeScript errors: `npm run type-check`

---

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## 👥 Authors

- **Your Name** - [@yourusername](https://github.com/yourusername)

---

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- Express.js community
- Neon for serverless PostgreSQL
- All contributors and supporters

---

## 📧 Support

For support, email support@planmorph.com or open an issue on GitHub.

---

## 🗺️ Roadmap

- [ ] Payment integration (Stripe/PayPal)
- [ ] Advanced search with filters
- [ ] Plan customization tool
- [ ] Mobile app (React Native)
- [ ] AI-powered plan recommendations
- [ ] Multi-language support
- [ ] Admin dashboard
- [ ] Plan comparison feature

---

**Made with ❤️ by the PlanMorph team**

## ⚠️ Important Notes

### Plan Management

**This application is READ-ONLY for plans.** All plan creation, updates, and deletions are handled through a separate administrative application.

- ✅ Users can browse, search, and view plans
- ✅ Users can purchase and download plans
- ✅ Users can review and favorite plans
- ❌ Users CANNOT upload or modify plans
- ❌ Architects CANNOT upload plans through this interface
- ❌ No seeding or mock data included

Plans should be populated in the database through your external admin application.

## 🏗️ Architecture

### Backend (`/backend`)
- **Framework**: Express.js with TypeScript
- **Database**: PostgreSQL with connection pooling
- **Authentication**: JWT + Google OAuth
- **Security**: Rate limiting, CORS, helmet middleware
- **Email**: Nodemailer integration
- **File Structure**:
  ```
  src/
  ├── controllers/     # Request handlers
  ├── middleware/      # Authentication, validation, error handling
  ├── routes/          # API endpoints
  ├── services/        # Business logic
  ├── utils/           # Helper functions
  └── config/          # Database, auth configuration
  ```

### Frontend (`/frontend`)
- **Framework**: Next.js 14 with TypeScript
- **Styling**: Tailwind CSS
- **Authentication**: React Context + JWT
- **State Management**: React hooks
- **Components**: Modular, reusable components

### Database (`/database`)
- **Migrations**: Sequential SQL migration files
- **Schema**: Users, plans, categories, reviews, cart, downloads

## 🔧 Environment Configuration

### Required Environment Variables

Create a `.env` file in the root directory with these variables:

```bash
# Database Configuration
DATABASE_URL=postgresql://username:password@host:port/database_name

# JWT Configuration
JWT_SECRET=your_super_secure_jwt_secret_here
JWT_EXPIRES_IN=24h

# Session Configuration
SESSION_SECRET=your_super_secure_session_secret_here

# Google OAuth (Optional)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# Email Configuration (Optional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password

# Supabase Configuration (Optional)
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key

# Application URLs
FRONTEND_URL=http://localhost:3000
BACKEND_URL=http://localhost:5000
```

### 🔒 Security Notes

- **Never commit `.env` files** - they contain sensitive credentials
- Use strong, unique secrets for JWT and sessions
- Enable environment-specific configurations for production
- Regularly rotate secrets and API keys

## 📦 Available Scripts

### Backend Scripts
```bash
npm run dev          # Start development server with hot reload
npm run build        # Build TypeScript to JavaScript
npm run start        # Start production server
npm run migrate      # Run database migrations
npm run test         # Run tests
```

**Note**: Seed scripts have been removed. Plans are managed externally.

### Frontend Scripts
```bash
npm run dev          # Start Next.js development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run type-check   # TypeScript type checking
```

## 🗄️ Database Setup

### Using Neon (Recommended)

1. Create a free account at [Neon](https://neon.tech/)
2. Create a new project
3. Copy the connection string to your `.env` file
4. Run migrations: `npm run migrate`

### Local PostgreSQL

1. Install PostgreSQL locally
2. Create a database: `createdb planmorph_plans`
3. Update `.env` with local connection details
4. Run migrations: `npm run migrate`

## 🔐 Authentication Setup

### Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URIs:
   - `http://localhost:5000/auth/google/callback` (development)
   - `https://yourdomain.com/auth/google/callback` (production)
6. Copy Client ID and Secret to `.env`

## 🚀 Deployment

### Production Deployment

1. **Build the applications**
   ```bash
   cd backend && npm run build
   cd ../frontend && npm run build
   ```

2. **Set up production database**
3. **Configure environment variables**
4. **Deploy to your hosting platform**

## 📊 API Documentation

### Authentication Endpoints
- `POST /auth/register` - User registration
- `POST /auth/login` - User login
- `GET /auth/google` - Google OAuth login
- `POST /auth/logout` - User logout
- `POST /auth/verify-email` - Email verification

### Plans Endpoints

**Read-Only Access** - Plans are managed through external admin application

- `GET /plans` - Get all plans (with pagination)
- `GET /plans/:id` - Get plan details
- `GET /plans/category/:category` - Get plans by category
- `GET /plans/search` - Search plans with filters
- `GET /plans/featured` - Get featured plans

### User Endpoints
- `GET /users/profile` - Get user profile
- `PUT /users/profile` - Update user profile
- `GET /users/downloads` - Get user downloads

For detailed API documentation, see [API_DOCUMENTATION.md](./API_DOCUMENTATION.md)

## 🧪 Testing

```bash
# Backend tests
cd backend
npm run test

# Frontend tests
cd frontend
npm run test
```

## 📁 Project Structure

```
planmorph-plans-app/
├── backend/                 # Express.js API server
├── frontend/                # Next.js React application
├── database/                # Database migrations and schemas
├── .env.example            # Environment variables template
├── .gitignore              # Git ignore rules
└── README.md               # This file
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

### Development Guidelines

- Follow TypeScript best practices
- Write tests for new features
- Update documentation for API changes
- Follow the existing code style
- Never commit sensitive environment variables

## 🔧 Troubleshooting

### Common Issues

**Database Connection Failed**
- Check your `DATABASE_URL` in `.env`
- Ensure your database server is running
- Verify firewall settings allow connections

**OAuth Login Not Working**
- Verify Google OAuth credentials
- Check redirect URIs match exactly
- Ensure OAuth consent screen is configured

**Build Errors**
- Run `npm install` to ensure all dependencies are installed
- Check TypeScript errors: `npm run type-check`
- Clear build cache: `rm -rf .next node_modules && npm install`

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙋‍♂️ Support

If you need help or have questions:
- Check the troubleshooting section above
- Review the [technical architecture documentation](./TECHNICAL_ARCHITECTURE.md)
- Open an issue on GitHub

---

**⚠️ Security Reminder**: Always keep your `.env` file secure and never commit it to version control. Use strong, unique secrets for production deployments.
