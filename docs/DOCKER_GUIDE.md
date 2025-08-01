## Docker Configuration & Local Development

### Docker Architecture

The Bulgarian Bakery Platform uses a multi-container Docker setup for both development and production environments, ensuring consistent behavior across all systems.

#### **Container Services:**

1. **bakery-app** - Main React application
2. **bakery-db** - PostgreSQL database (optional)
3. **bakery-redis** - Redis for session storage (optional)
4. **bakery-nginx** - Reverse proxy for production-like setup

#### **Development vs Production Docker Setup:**

```yaml
# Development (docker-compose.dev.yml)
services:
  bakery-app-dev:
    build:
      dockerfile: Dockerfile.dev  # Hot reloading enabled
    volumes:
      - ./src:/app/src           # Live code updates
    environment:
      - CHOKIDAR_USEPOLLING=true # File watching
    
# Production (docker-compose.yml)  
services:
  bakery-app:
    build:
      dockerfile: Dockerfile     # Optimized build
    volumes: []                  # No code mounting
    restart: unless-stopped      # Production stability
```

### Local Development Workflow

#### **Quick Start:**
```bash
# Clone and start development
git clone <repository>
cd bakery
docker-compose -f docker-compose.dev.yml up --build

# Access at http://localhost:3000
```

#### **Development Commands:**
```bash
# Start development with hot reloading
docker-compose -f docker-compose.dev.yml up --build

# View real-time logs
docker-compose -f docker-compose.dev.yml logs -f

# Execute commands inside container
docker-compose exec bakery-app-dev npm run test
docker-compose exec bakery-app-dev npm run lint

# Install new packages
docker-compose exec bakery-app-dev npm install <package-name>

# Stop development environment
docker-compose -f docker-compose.dev.yml down
```

#### **Database Development:**
```bash
# Start with database
docker-compose up bakery-db

# Connect to database
docker-compose exec bakery-db psql -U bakery_user -d bakery_db

# View database logs
docker-compose logs bakery-db

# Reset database
docker-compose down --volumes
docker-compose up bakery-db
```

### Production-Like Local Testing

#### **Full Stack Setup:**
```bash
# Start complete environment
docker-compose up --build

# Services available:
# - App: http://localhost:3000 (direct)
# - Nginx: http://localhost (proxied)
# - Database: localhost:5432
# - Redis: localhost:6379
```

#### **Performance Testing:**
```bash
# Build production image
docker build -t bakery-prod .

# Test production build locally
docker run -p 3000:3000 bakery-prod

# Load testing with multiple containers
docker-compose up --scale bakery-app=3
```

### Environment Configuration

#### **Development Environment Variables:**
```bash
# .env.development (auto-loaded in dev container)
REACT_APP_API_BASE_URL=http://localhost:3000
REACT_APP_REVOLUT_API_URL=https://sandbox-merchant.revolut.com
REACT_APP_ENVIRONMENT=development
CHOKIDAR_USEPOLLING=true  # Enable file watching in Docker
WATCHPACK_POLLING=true    # Webpack polling for Windows/WSL
```

#### **Production Environment Variables:**
```bash
# .env.production
REACT_APP_API_BASE_URL=https://api.bakery-zlatno-zhito.bg
REACT_APP_REVOLUT_API_URL=https://merchant.revolut.com
REACT_APP_ENVIRONMENT=production
REACT_APP_SENTRY_DSN=your-sentry-dsn
```

### Docker Best Practices Implementation

#### **Multi-Stage Dockerfile:**
```dockerfile
# Development stage
FROM node:18-alpine as development
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
CMD ["npm", "start"]

# Build stage
FROM node:18-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build

# Production stage
FROM nginx:alpine as production
COPY --from=build /app/build /usr/share/nginx/html
COPY docker/nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

#### **Health Checks:**
```yaml
healthcheck:
  test: ["CMD", "curl", "-f", "http://localhost:3000"]
  interval: 30s
  timeout: 10s
  retries: 3
  start_period: 40s
```

#### **Volume Management:**
```yaml
volumes:
  # Development - enable hot reloading
  - ./src:/app/src:cached
  - ./public:/app/public:cached
  - /app/node_modules  # Prevent overwriting
  
  # Production - persistent data
  bakery_db_data:
    driver: local
```

### Bulgarian-Specific Docker Considerations

#### **Locale Support:**
```dockerfile
# Add Bulgarian locale support
RUN apk add --no-cache \
    locale \
    tzdata \
    && cp /usr/share/zoneinfo/Europe/Sofia /etc/localtime \
    && echo "Europe/Sofia" > /etc/timezone
```

#### **Font Support for Cyrillic:**
```dockerfile
# Install fonts for proper Cyrillic rendering
RUN apk add --no-cache \
    fontconfig \
    ttf-dejavu \
    && fc-cache -f
```

### Troubleshooting Docker Issues

#### **Common Development Issues:**

1. **Hot Reloading Not Working:**
```bash
# Enable polling for Windows/WSL
export CHOKIDAR_USEPOLLING=true
export WATCHPACK_POLLING=true
docker-compose -f docker-compose.dev.yml up --build
```

2. **Port Already in Use:**
```bash
# Find and kill process using port 3000
lsof -ti:3000 | xargs kill -9
# Or change port in docker-compose.dev.yml
```

3. **Volume Mount Issues:**
```bash
# Reset Docker volumes
docker-compose down --volumes
docker system prune -f
docker-compose up --build
```

4. **Memory Issues:**
```bash
# Increase Docker memory limit
# Docker Desktop -> Settings -> Resources -> Memory: 4GB+
```

#### **Performance Optimization:**

1. **Build Caching:**
```dockerfile
# Copy package.json first for better caching
COPY package*.json ./
RUN npm ci
COPY . .  # This layer only rebuilds when source changes
```

2. **Development Speed:**
```yaml
# Use bind mounts for faster file sync
volumes:
  - type: bind
    source: ./src
    target: /app/src
    consistency: cached
```

### Container Monitoring

#### **Health Monitoring:**
```bash
# Check container health
docker-compose ps

# View container stats
docker stats

# Monitor logs in real-time
docker-compose logs -f --tail=100

# Container inspection
docker-compose exec bakery-app-dev sh
```

#### **Performance Metrics:**
```bash
# Container resource usage
docker-compose exec bakery-app-dev top

# Memory usage
docker-compose exec bakery-app-dev free -h

# Disk usage
docker-compose exec bakery-app-dev df -h
```

### Docker Security

#### **Security Best Practices:**
```dockerfile
# Use non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001
USER nextjs

# Minimal base image
FROM node:18-alpine  # Smaller attack surface

# Remove package managers
RUN rm -rf /var/cache/apk/*
```

#### **Environment Security:**
```yaml
# Secrets management
secrets:
  revolut_api_key:
    file: ./secrets/revolut_api_key.txt
    
services:
  bakery-app:
    secrets:
      - revolut_api_key
```

This Docker configuration ensures a smooth local development experience while maintaining production-like behavior for accurate testing of the Bulgarian Bakery Platform.