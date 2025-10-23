#!/bin/bash

# Exit on any error
set -e

echo "Starting custom deployment for Next.js app..."

# Variables
DEPLOYMENT_SOURCE=${DEPLOYMENT_SOURCE:-$PWD}
DEPLOYMENT_TARGET=${DEPLOYMENT_TARGET:-/home/site/wwwroot}
DEPLOYMENT_TEMP=${DEPLOYMENT_TEMP:-/tmp/deployment}

# Setup deployment directory
echo "Setting up deployment directory..."
mkdir -p "$DEPLOYMENT_TEMP"
cd "$DEPLOYMENT_SOURCE/frontend"

# Install dependencies
echo "Installing dependencies..."
npm ci --production=false

# Build the application  
echo "Building Next.js application..."
npm run build

# Copy files to deployment target
echo "Copying files to deployment target..."
cp -r * "$DEPLOYMENT_TARGET/"
cp -r .next "$DEPLOYMENT_TARGET/"

# Install production dependencies in target
echo "Installing production dependencies in target..."
cd "$DEPLOYMENT_TARGET"
npm ci --omit=dev

echo "Deployment completed successfully!"
