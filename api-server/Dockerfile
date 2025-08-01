# Secure API Server Dockerfile
FROM node:18-alpine AS base

# Create app directory
WORKDIR /app

# Create non-root user for security
RUN addgroup -g 1001 -S nodejs
RUN adduser -S apiserver -u 1001

# Install system dependencies for SQLite and native modules
RUN apk add --no-cache \
    sqlite \
    sqlite-dev \
    python3 \
    py3-pip \
    make \
    g++ \
    libc6-compat \
    linux-headers

# Copy package files
COPY package*.json ./

# Install dependencies with rebuild for native modules
RUN npm ci --only=production && \
    npm cache clean --force

# Copy application code
COPY . .

# Create necessary directories with correct permissions
RUN mkdir -p logs data && \
    chown -R apiserver:nodejs /app && \
    chmod -R 755 /app

# Set environment variables
ENV NODE_ENV=production
ENV PORT=3002

# Expose port
EXPOSE 3002

# Switch to non-root user
USER apiserver

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3002/health || exit 1

# Start the application
CMD ["npm", "start"]