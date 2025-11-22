# PlanMorph Plans Store - Development Guide

## 🚀 Getting Started

### Quick Start

```bash
# 1. Run setup script
chmod +x setup.sh
./setup.sh

# 2. Update backend/.env with your credentials

# 3. Install dependencies and run migrations
cd backend
npm install
npm run migrate
npm run seed
cd ..

# 4. Start development environment
docker-compose -f docker-compose.dev.yml up
```

## 📁 Project Structure Explained

### Backend (`/backend`)

```
src/
├── admin/              # Admin-only routes
│   ├── admin.controller.ts
│   └── admin.routes.ts
├── architects/         # Architect dashboard & upload
│   ├── architects.controller.ts
│   └── architects.routes.ts
├── auth/              # Authentication & authorization
│   ├── auth.controller.ts
│   ├── auth.middleware.ts
│   └── auth.routes.ts
├── db/                # Database utilities
│   ├── index.ts
│   ├── migrate.ts
│   ├── schema.sql
│   └── seed.ts
├── designs/           # Public design endpoints
│   ├── designs.controller.ts
│   └── designs.routes.ts
├── middleware/        # Global middleware
│   └── errorHandler.ts
├── purchases/         # Purchase logic
│   ├── purchases.controller.ts
│   └── purchases.routes.ts
├── storage/           # DigitalOcean Spaces integration
│   └── storage.service.ts
├── utils/             # Utilities
│   └── logger.ts
└── index.ts           # Main entry point
```

### Frontend (`/frontend`)

```
src/
├── components/
│   ├── ui/            # Reusable UI components
│   │   ├── Button.tsx
│   │   └── Input.tsx
│   ├── DesignCard.tsx
│   └── ProtectedRoute.tsx
├── context/
│   └── AuthContext.tsx
├── layouts/           # Page layouts
│   ├── AdminLayout.tsx
│   ├── ArchitectLayout.tsx
│   ├── AuthLayout.tsx
│   └── MainLayout.tsx
├── pages/             # Page components
│   ├── admin/
│   │   ├── Applications.tsx
│   │   └── Dashboard.tsx
│   ├── architect/
│   │   ├── Apply.tsx
│   │   ├── Dashboard.tsx
│   │   └── UploadDesign.tsx
│   ├── DesignDetails.tsx
│   ├── Designs.tsx
│   ├── Home.tsx
│   ├── Login.tsx
│   ├── NotFound.tsx
│   ├── Purchases.tsx
│   └── Register.tsx
├── services/          # API service layer
│   ├── admin.service.ts
│   ├── api.ts
│   ├── architect.service.ts
│   ├── auth.service.ts
│   ├── designs.service.ts
│   └── purchase.service.ts
├── App.tsx
├── index.css
└── main.tsx
```

## 🔑 Key Features Implementation

### Authentication Flow

1. **Registration**: Users choose role (client/architect)
2. **Architect Application**: Submit profile for admin approval
3. **Admin Approval**: Admin reviews and approves/rejects
4. **JWT Tokens**: Stored in localStorage, attached to API requests

### Role-Based Access Control

- **Client**: Browse & purchase designs
- **Architect**: Upload designs (after approval)
- **Admin**: Manage applications & users

### File Upload Flow

1. Request presigned URL from backend
2. Upload directly to DigitalOcean Spaces
3. Save file metadata to database
4. Generate secure download URLs for purchases

## 🛠️ Development Workflow

### Adding New Features

1. **Backend**:
   ```bash
   cd backend/src
   # Create new controller
   # Create new routes
   # Add to main index.ts
   ```

2. **Frontend**:
   ```bash
   cd frontend/src
   # Create new page/component
   # Add service function
   # Update routing in App.tsx
   ```

### Database Changes

```bash
# Update schema.sql
cd backend
npm run migrate
```

### Testing Locally

```bash
# Start backend only
cd backend && npm run dev

# Start frontend only
cd frontend && npm run dev

# Or use Docker Compose
docker-compose -f docker-compose.dev.yml up
```

## 📊 Database Schema

### Key Relationships

```
users (1) ─── (0..1) architect_profiles
  │
  ├─── (n) designs (as architect)
  │      │
  │      └─── (n) design_media
  │
  └─── (n) purchases
         │
         └─── (1) designs
```

## 🔒 Security Best Practices

1. **Environment Variables**: Never commit .env files
2. **JWT Secrets**: Use strong, random strings
3. **Database**: Use connection pooling
4. **File Access**: Always use presigned URLs
5. **Input Validation**: Use Zod schemas
6. **Rate Limiting**: Configured in Nginx

## 🐳 Docker Tips

### Development with Hot Reload

```bash
docker-compose -f docker-compose.dev.yml up
```

### Production Build

```bash
docker-compose up --build -d
```

### View Logs

```bash
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f nginx
```

### Restart Services

```bash
docker-compose restart backend
```

## 📝 Common Tasks

### Reset Database

```bash
cd backend
npm run migrate  # Recreate schema
npm run seed     # Add test data
```

### Add New Admin User

```bash
cd backend
node -e "
const bcrypt = require('bcrypt');
bcrypt.hash('password', 10).then(hash => console.log(hash));
"
# Then manually insert into database
```

### Update Dependencies

```bash
# Backend
cd backend && npm update

# Frontend
cd frontend && npm update
```

## 🚨 Troubleshooting

### Port Already in Use

```bash
# Find process using port
lsof -i :80
lsof -i :5000
lsof -i :3000

# Kill process
kill -9 <PID>
```

### Docker Issues

```bash
# Clean everything
docker-compose down -v
docker system prune -a

# Rebuild
docker-compose build --no-cache
```

### Database Connection

- Check DATABASE_URL format
- Verify Neon.tech dashboard
- Test connection: `psql $DATABASE_URL`

## 📚 Additional Resources

- [React Documentation](https://react.dev)
- [Express Documentation](https://expressjs.com)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Docker Documentation](https://docs.docker.com)
- [DigitalOcean Spaces](https://docs.digitalocean.com/products/spaces/)

## 🤝 Contributing

1. Create feature branch
2. Make changes
3. Test thoroughly
4. Submit pull request

---

Happy coding! 🚀
