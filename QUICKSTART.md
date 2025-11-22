# 🚀 Quick Start Guide - PlanMorph Plans Store

## ⚡ 5-Minute Setup

### Step 1: Clone & Setup
```bash
git clone <repository-url>
cd planmorph-plans-store
chmod +x setup.sh
./setup.sh
```

### Step 2: Configure Environment

Edit `backend/.env`:
```env
DATABASE_URL=your_neon_postgres_url
JWT_SECRET=your_secret_key
DO_SPACES_ENDPOINT=https://nyc3.digitaloceanspaces.com
DO_SPACES_KEY=your_key
DO_SPACES_SECRET=your_secret
DO_SPACES_BUCKET=planmorph
```

### Step 3: Database Setup
```bash
cd backend
npm install
npm run db:setup  # Runs migrate + seed
cd ..
```

### Step 4: Launch
```bash
# Development mode (with hot reload)
docker-compose -f docker-compose.dev.yml up

# OR Production mode
docker-compose up -d
```

### Step 5: Access
- **App**: http://localhost
- **API**: http://localhost/api
- **Health**: http://localhost/api/health

## 🔑 Test Accounts

After running `npm run seed`:

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@planmorph.com | admin123 |
| Architect | architect@test.com | architect123 |
| Client | client@test.com | client123 |

## 📱 User Flows

### As a Client
1. Register → Browse Designs → View Details → Purchase → Download Files

### As an Architect
1. Register → Apply → Wait for Approval → Upload Designs → Manage Portfolio

### As an Admin
1. Login → Review Applications → Approve/Reject → Monitor System

## 🛠️ Common Commands

```bash
# Start services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down

# Rebuild
docker-compose up --build

# Reset database
cd backend && npm run db:setup

# Backend only (dev)
cd backend && npm run dev

# Frontend only (dev)
cd frontend && npm run dev
```

## 📚 Documentation

- **README.md** - Full documentation & deployment guide
- **DEVELOPMENT.md** - Development workflow & best practices
- **PROJECT_SUMMARY.md** - Complete feature list & architecture

## 🐛 Troubleshooting

**Port conflicts:**
```bash
lsof -i :80  # Find what's using port 80
kill -9 <PID>  # Kill the process
```

**Docker issues:**
```bash
docker-compose down -v  # Remove volumes
docker system prune -a  # Clean everything
docker-compose build --no-cache  # Fresh build
```

**Database connection:**
- Verify DATABASE_URL in backend/.env
- Check Neon.tech dashboard is active
- Ensure SSL mode is included in connection string

## 🔒 Security Notes

- Change all default passwords
- Use strong JWT secrets
- Update ALLOWED_ORIGINS for production
- Add SSL certificates for HTTPS
- Never commit .env files

## 📊 Project Structure

```
planmorph-plans-store/
├── backend/          # Express API
├── frontend/         # React App
├── nginx/            # Reverse Proxy
├── docker-compose.yml
└── README.md
```

## ✅ Checklist Before First Run

- [ ] Updated backend/.env with real credentials
- [ ] Updated frontend/.env with API URL
- [ ] Ran database migrations (`npm run migrate`)
- [ ] Ran seed data (`npm run seed`)
- [ ] Docker & Docker Compose installed
- [ ] Ports 80, 3000, 5000 available

## 🎯 Key Features

✅ Role-based access (Client/Architect/Admin)
✅ Secure file uploads to DigitalOcean Spaces
✅ JWT authentication
✅ Purchase & download system
✅ Architect application workflow
✅ Admin approval system
✅ Responsive design
✅ Production-ready Docker setup

## 🚀 Ready to Deploy?

1. Update environment variables for production
2. Add SSL certificates to nginx/ssl/
3. Update nginx.conf SSL sections
4. Run: `docker-compose up -d`
5. Monitor: `docker-compose logs -f`

---

Need help? Check the full README.md or DEVELOPMENT.md files!
