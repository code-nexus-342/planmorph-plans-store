# PlanMorph Plans Store

A full-stack production-grade web application for browsing, purchasing, and managing architectural house designs with built-in internal management for architects/engineers and administrators.

## 🏗️ Architecture

### Tech Stack

- **Frontend**: React 18 + Vite + TypeScript + TailwindCSS + Framer Motion
- **Backend**: Node.js + Express + TypeScript
- **Database**: PostgreSQL (Neon.tech)
- **Storage**: DigitalOcean Spaces (S3-compatible)
- **Infrastructure**: Docker + Nginx (Reverse Proxy)
- **Authentication**: JWT with Role-Based Access Control (RBAC)

### Project Structure

```
planmorph-plans-store/
├── backend/                 # Express API server
│   ├── src/
│   │   ├── admin/          # Admin routes & controllers
│   │   ├── architects/     # Architect routes & controllers
│   │   ├── auth/           # Authentication & authorization
│   │   ├── db/             # Database connection & migrations
│   │   ├── designs/        # Design routes & controllers
│   │   ├── middleware/     # Error handling middleware
│   │   ├── purchases/      # Purchase routes & controllers
│   │   ├── storage/        # DigitalOcean Spaces integration
│   │   ├── utils/          # Logger and utilities
│   │   └── index.ts        # Main server entry
│   ├── Dockerfile
│   ├── package.json
│   └── tsconfig.json
├── frontend/               # React SPA
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── context/       # React Context (Auth)
│   │   ├── layouts/       # Layout components
│   │   ├── pages/         # Page components
│   │   ├── services/      # API service layer
│   │   └── App.tsx        # Main app component
│   ├── Dockerfile
│   ├── package.json
│   └── vite.config.ts
├── nginx/                 # Reverse proxy configuration
│   ├── Dockerfile
│   └── nginx.conf
├── docker-compose.yml     # Production compose file
├── docker-compose.dev.yml # Development compose file
└── README.md

```

## 🚀 Quick Start

### Prerequisites

- Docker & Docker Compose
- Node.js 20+ (for local development)
- PostgreSQL database (Neon.tech or local)
- DigitalOcean Spaces account

### 1. Clone the Repository

```bash
git clone <repository-url>
cd planmorph-plans-store
```

### 2. Environment Setup

#### Backend Environment

Create `backend/.env` from the example:

```bash
cp backend/.env.example backend/.env
```

Update with your credentials:

```env
DATABASE_URL=postgresql://user:password@host.neon.tech:5432/planmorph_db?sslmode=require
JWT_SECRET=your-super-secret-jwt-key
DO_SPACES_ENDPOINT=https://nyc3.digitaloceanspaces.com
DO_SPACES_KEY=your-spaces-access-key
DO_SPACES_SECRET=your-spaces-secret-key
DO_SPACES_BUCKET=planmorph
```

#### Frontend Environment

Create `frontend/.env`:

```bash
cp frontend/.env.example frontend/.env
```

```env
VITE_API_URL=http://localhost/api
```

### 3. Database Setup

Run migrations and seed data:

```bash
cd backend
npm install
npm run migrate
npm run seed
```

This creates:
- Admin user: `admin@planmorph.com` / `admin123`
- Test architect: `architect@test.com` / `architect123`
- Test client: `client@test.com` / `client123`

### 4. Run with Docker

#### Development Mode

```bash
docker-compose -f docker-compose.dev.yml up --build
```

#### Production Mode

```bash
docker-compose up --build -d
```

### 5. Access the Application

- **Frontend**: http://localhost
- **Backend API**: http://localhost/api
- **Health Check**: http://localhost/api/health

## 👥 User Roles & Access

### Client (Public)
- Browse designs
- View design details
- Purchase designs
- Access purchased files

### Architect/Engineer
- Apply for architect status
- Upload designs (after approval)
- Manage own designs
- View analytics dashboard

### Administrator
- Review architect applications
- Approve/reject architects
- View all designs
- Manage users
- System oversight

## 📁 Key Features

### 🔐 Security
- JWT-based authentication
- Role-based access control
- Rate limiting (Nginx)
- Security headers (Helmet + Nginx)
- Input validation (Zod)
- SQL injection prevention
- Presigned URLs for secure file access

### 🎨 Frontend
- Responsive design (TailwindCSS)
- Smooth animations (Framer Motion)
- Lazy loading
- Protected routes
- Error boundaries
- Optimistic UI updates

### ⚡ Performance
- Multi-stage Docker builds
- Nginx reverse proxy with compression
- Database connection pooling
- Efficient queries with pagination
- CDN-ready architecture

### 🗄️ Database Schema

**Tables:**
- `users` - All user accounts
- `architect_profiles` - Architect application data
- `designs` - Architectural designs
- `design_media` - Images, videos, CAD files
- `purchases` - Purchase transactions

## 🛠️ Development

### Local Development (without Docker)

#### Backend

```bash
cd backend
npm install
npm run dev
```

#### Frontend

```bash
cd frontend
npm install
npm run dev
```

### Available Scripts

**Backend:**
- `npm run dev` - Start development server
- `npm run build` - Build TypeScript
- `npm run migrate` - Run database migrations
- `npm run seed` - Seed test data
- `npm run db:setup` - Migrate + seed

**Frontend:**
- `npm run dev` - Start Vite dev server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## 🔄 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Get current user
- `POST /api/auth/architect/apply` - Submit architect application

### Designs (Public)
- `GET /api/designs` - List published designs
- `GET /api/designs/:id` - Get design details

### Architect (Protected)
- `GET /api/architect/dashboard` - Get stats
- `GET /api/architect/designs` - List my designs
- `POST /api/architect/designs` - Create design
- `POST /api/architect/upload-url` - Get presigned upload URL
- `POST /api/architect/media` - Add media to design

### Admin (Protected)
- `GET /api/admin/applications` - List pending applications
- `PUT /api/admin/applications/:id` - Approve/reject
- `GET /api/admin/users` - List all users
- `GET /api/admin/designs` - List all designs

### Purchases (Protected)
- `POST /api/purchases` - Purchase a design
- `GET /api/purchases/my-purchases` - My purchases
- `GET /api/purchases/files/:designId` - Get download URLs

## 🚢 Deployment

### Production Checklist

1. ✅ Update environment variables
2. ✅ Configure SSL certificates
3. ✅ Set up database backups
4. ✅ Configure DigitalOcean Spaces
5. ✅ Update CORS origins
6. ✅ Set NODE_ENV=production
7. ✅ Enable Nginx SSL configuration
8. ✅ Configure monitoring/logging
9. ✅ Set up CI/CD pipeline

### Docker Production Build

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

### Nginx SSL Configuration

Uncomment SSL sections in `nginx/nginx.conf` and add certificates:

```bash
mkdir -p nginx/ssl
# Add your SSL certificates to nginx/ssl/
```

## 📝 Environment Variables Reference

### Backend

| Variable | Description | Required |
|----------|-------------|----------|
| `PORT` | Server port | Yes |
| `NODE_ENV` | Environment (development/production) | Yes |
| `DATABASE_URL` | PostgreSQL connection string | Yes |
| `JWT_SECRET` | JWT signing secret | Yes |
| `JWT_REFRESH_SECRET` | Refresh token secret | Yes |
| `DO_SPACES_ENDPOINT` | DigitalOcean Spaces endpoint | Yes |
| `DO_SPACES_KEY` | Spaces access key | Yes |
| `DO_SPACES_SECRET` | Spaces secret key | Yes |
| `DO_SPACES_BUCKET` | Bucket name | Yes |
| `DO_SPACES_CDN_URL` | CDN URL (optional) | No |
| `ALLOWED_ORIGINS` | CORS origins (comma-separated) | Yes |

### Frontend

| Variable | Description | Required |
|----------|-------------|----------|
| `VITE_API_URL` | Backend API URL | Yes |
| `VITE_APP_NAME` | Application name | No |

## 🧪 Testing

```bash
# Backend tests (when implemented)
cd backend
npm test

# Frontend tests (when implemented)
cd frontend
npm test
```

## 🐛 Troubleshooting

### Database Connection Issues
- Verify DATABASE_URL is correct
- Check Neon.tech dashboard for connection details
- Ensure SSL mode is enabled for Neon

### Docker Issues
- Clear volumes: `docker-compose down -v`
- Rebuild images: `docker-compose build --no-cache`
- Check logs: `docker-compose logs [service-name]`

### Port Conflicts
- Change ports in docker-compose.yml
- Ensure ports 80, 3000, 5000 are available

## 📄 License

This project is proprietary and confidential.

## 👨‍💻 Contributing

This is a private project. Contact the maintainers for contribution guidelines.

## 📞 Support

For support, email support@planmorph.com or create an issue in the repository.

---

Built with ❤️ using modern web technologies
