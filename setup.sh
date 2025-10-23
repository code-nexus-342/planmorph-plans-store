#!/bin/bash

# ================================================
# PlanMorph Development Environment Setup Script
# ================================================
# This script automates the setup of PlanMorph development environment
# 
# Usage: ./setup.sh
# 
# Prerequisites:
# - Node.js 18+ installed
# - PostgreSQL 14+ installed and running
# - npm or yarn package manager
# ================================================

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_info() {
    echo -e "${BLUE}ℹ${NC} $1"
}

print_success() {
    echo -e "${GREEN}✓${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}⚠${NC} $1"
}

print_error() {
    echo -e "${RED}✗${NC} $1"
}

print_header() {
    echo ""
    echo -e "${BLUE}================================================${NC}"
    echo -e "${BLUE}$1${NC}"
    echo -e "${BLUE}================================================${NC}"
    echo ""
}

# Check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Main setup function
main() {
    print_header "PlanMorph Development Setup"
    
    # Check prerequisites
    print_info "Checking prerequisites..."
    
    if ! command_exists node; then
        print_error "Node.js is not installed. Please install Node.js 18+ first."
        exit 1
    fi
    
    NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
    if [ "$NODE_VERSION" -lt 18 ]; then
        print_error "Node.js version 18+ is required. Current version: $(node -v)"
        exit 1
    fi
    print_success "Node.js $(node -v) is installed"
    
    if ! command_exists npm; then
        print_error "npm is not installed."
        exit 1
    fi
    print_success "npm $(npm -v) is installed"
    
    if ! command_exists psql; then
        print_warning "PostgreSQL client (psql) not found. Make sure PostgreSQL is installed."
        print_warning "Continue anyway? (y/n)"
        read -r response
        if [[ ! "$response" =~ ^[Yy]$ ]]; then
            exit 1
        fi
    else
        print_success "PostgreSQL client is installed"
    fi
    
    # Setup Backend
    print_header "Setting Up Backend"
    
    print_info "Installing backend dependencies..."
    cd backend
    
    if [ -f "package-lock.json" ]; then
        npm ci
    else
        npm install
    fi
    print_success "Backend dependencies installed"
    
    # Check if .env exists
    if [ ! -f ".env" ]; then
        print_warning ".env file not found in backend directory"
        print_info "Creating .env file from .env.example..."
        if [ -f ".env.example" ]; then
            cp .env.example .env
            print_success ".env file created"
            print_warning "Please edit backend/.env and configure your settings"
        else
            print_error ".env.example not found. Cannot create .env file."
            exit 1
        fi
    else
        print_success "backend/.env file exists"
    fi
    
    cd ..
    
    # Setup Frontend
    print_header "Setting Up Frontend"
    
    print_info "Installing frontend dependencies..."
    cd frontend
    
    if [ -f "package-lock.json" ]; then
        npm ci
    else
        npm install
    fi
    print_success "Frontend dependencies installed"
    
    # Check if .env.local exists
    if [ ! -f ".env.local" ]; then
        print_warning ".env.local file not found in frontend directory"
        print_info "Creating .env.local file from .env.example..."
        if [ -f ".env.example" ]; then
            cp .env.example .env.local
            print_success ".env.local file created"
        else
            print_error ".env.example not found. Cannot create .env.local file."
            exit 1
        fi
    else
        print_success "frontend/.env.local file exists"
    fi
    
    cd ..
    
    # Database Setup
    print_header "Database Setup"
    
    print_info "Do you want to set up the database now? (y/n)"
    read -r setup_db
    
    if [[ "$setup_db" =~ ^[Yy]$ ]]; then
        print_info "Enter PostgreSQL superuser (default: postgres):"
        read -r pg_user
        pg_user=${pg_user:-postgres}
        
        print_info "Creating database and user..."
        
        # Create database and user
        psql -U "$pg_user" -c "CREATE DATABASE planmorph;" 2>/dev/null || print_warning "Database 'planmorph' may already exist"
        psql -U "$pg_user" -c "CREATE USER planmorph_user WITH PASSWORD 'planmorph_secure_pass_2025';" 2>/dev/null || print_warning "User 'planmorph_user' may already exist"
        psql -U "$pg_user" -c "GRANT ALL PRIVILEGES ON DATABASE planmorph TO planmorph_user;" 2>/dev/null
        psql -U "$pg_user" -d planmorph -c "CREATE EXTENSION IF NOT EXISTS \"uuid-ossp\";" 2>/dev/null
        
        print_success "Database setup completed"
        
        # Run migrations
        print_info "Do you want to run database migrations now? (y/n)"
        read -r run_migrations
        
        if [[ "$run_migrations" =~ ^[Yy]$ ]]; then
            print_info "Running database migrations..."
            cd backend
            npm run migrate:dev
            print_success "Database migrations completed"
            
            print_info "Do you want to seed the database with sample data? (y/n)"
            read -r run_seed
            
            if [[ "$run_seed" =~ ^[Yy]$ ]]; then
                print_info "Seeding database..."
                npm run seed:dev
                print_success "Database seeded"
            fi
            
            cd ..
        fi
    else
        print_warning "Skipping database setup. Run manually later."
    fi
    
    # Build Backend
    print_header "Building Backend"
    
    print_info "Do you want to build the backend now? (y/n)"
    read -r build_backend
    
    if [[ "$build_backend" =~ ^[Yy]$ ]]; then
        print_info "Building backend..."
        cd backend
        npm run build
        print_success "Backend built successfully"
        cd ..
    fi
    
    # Final Instructions
    print_header "Setup Complete!"
    
    print_success "PlanMorph development environment is ready!"
    echo ""
    print_info "Next steps:"
    echo ""
    echo "1. Configure your environment variables:"
    echo "   - Edit backend/.env with your database credentials and secrets"
    echo "   - Edit frontend/.env.local if needed"
    echo ""
    echo "2. Start the development servers:"
    echo ""
    echo "   Terminal 1 (Backend):"
    echo "   $ cd backend"
    echo "   $ npm run dev"
    echo ""
    echo "   Terminal 2 (Frontend):"
    echo "   $ cd frontend"
    echo "   $ npm run dev"
    echo ""
    echo "3. Access the application:"
    echo "   - Frontend: http://localhost:3000"
    echo "   - Backend API: http://localhost:5000"
    echo "   - API Health: http://localhost:5000/api/v1/health"
    echo ""
    print_info "For more information, see SETUP_GUIDE.md"
    echo ""
}

# Run main function
main
