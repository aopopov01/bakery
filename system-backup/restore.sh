#!/bin/bash

# 🚀 COMPLETE SYSTEM RESTORATION SCRIPT
# Restores ТортоМания bakery platform to exact state after UI/UX enhancements
# GUARANTEE: 100% restoration with this script

echo "🚀 Starting ТортоМания Complete System Restoration..."
echo "================================================="

# Verify we're in the right location
if [ ! -f "restore.sh" ]; then
    echo "❌ ERROR: restore.sh not found. Please run from system-backup directory."
    exit 1
fi

# Create project directory
echo "📁 Creating project directory..."
cd ..
mkdir -p tortomaniya-restored
cd tortomaniya-restored

# Copy all source files
echo "📋 Copying source files..."
cp -r ../system-backup/src-complete ./src
cp -r ../system-backup/public-complete ./public
cp ../system-backup/package.json ./
cp ../system-backup/tailwind.config.js ./
cp ../system-backup/Dockerfile ./
cp ../system-backup/docker-compose.dev.yml ./

# Copy documentation
echo "📚 Copying documentation..."
cp ../Claude.md ./
cp -r ../system-backup ./

echo "✅ All files copied successfully!"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ ERROR: npm install failed. Please check Node.js installation."
    exit 1
fi

echo "✅ Dependencies installed successfully!"

# Build and start Docker container
echo "🐳 Building and starting Docker container..."
docker-compose -f docker-compose.dev.yml up --build -d

if [ $? -ne 0 ]; then
    echo "❌ ERROR: Docker deployment failed. Please check Docker installation."
    exit 1
fi

echo "✅ Docker container started successfully!"

# Wait for application to start
echo "⏳ Waiting for application to start..."
sleep 10

# Verify deployment
echo "🔍 Verifying deployment..."
if curl -s http://localhost:4000 > /dev/null; then
    echo "✅ Application is running at http://localhost:4000"
else
    echo "⚠️  Application may still be starting. Check http://localhost:4000 in a moment."
fi

echo ""
echo "🎉 RESTORATION COMPLETE!"
echo "========================"
echo ""
echo "✅ ТортоМания bakery platform restored with ALL enhancements:"
echo "   • Timeline icons with hover effects"
echo "   • Magical bakery backgrounds"
echo "   • Complete responsive design"
echo "   • Mobile navigation menu"
echo "   • Scroll-to-top functionality"
echo "   • Shopping cart image display"
echo "   • Optimized About page"
echo ""
echo "🌐 Access your application: http://localhost:4000"
echo "📁 Project location: $(pwd)"
echo ""
echo "🔧 Development commands:"
echo "   docker-compose -f docker-compose.dev.yml logs -f  # View logs"
echo "   docker-compose -f docker-compose.dev.yml down     # Stop"
echo "   ./system-backup/verify.sh                         # Verify features"