#!/bin/bash

# PlanMorph Plans Store - Quick Setup Script
# This script helps you set up the development environment

set -e

echo "🏗️  Setting up PlanMorph Plans Store..."
echo ""

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first."
    exit 1
fi

if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

# Create .env files from examples if they don't exist
echo "📝 Creating environment files..."

if [ ! -f backend/.env ]; then
    cp backend/.env.example backend/.env
    echo "✅ Created backend/.env (please update with your credentials)"
else
    echo "⚠️  backend/.env already exists, skipping..."
fi

if [ ! -f frontend/.env ]; then
    cp frontend/.env.example frontend/.env
    echo "✅ Created frontend/.env"
else
    echo "⚠️  frontend/.env already exists, skipping..."
fi

echo ""
echo "⚙️  Next steps:"
echo ""
echo "1. Update backend/.env with your database and API credentials:"
echo "   - DATABASE_URL (Neon.tech PostgreSQL)"
echo "   - JWT_SECRET"
echo "   - DigitalOcean Spaces credentials"
echo ""
echo "2. Run database migrations:"
echo "   cd backend && npm install && npm run migrate && npm run seed"
echo ""
echo "3. Start the application:"
echo "   Development: docker-compose -f docker-compose.dev.yml up --build"
echo "   Production:  docker-compose up --build -d"
echo ""
echo "4. Access the application:"
echo "   - Frontend: http://localhost"
echo "   - Backend API: http://localhost/api"
echo ""
echo "📚 Test Accounts (after running seed):"
echo "   - Admin: admin@planmorph.com / admin123"
echo "   - Architect: architect@test.com / architect123"
echo "   - Client: client@test.com / client123"
echo ""
echo "✨ Setup complete! Happy coding!"
