# Multi-stage Dockerfile for Backend Service
FROM node:18-alpine AS backend-base

# Set working directory
WORKDIR /app

# Install system dependencies for native modules
RUN apk add --no-cache \
    python3 \
    make \
    g++ \
    libc6-compat

# Copy package files
COPY backend/package*.json ./

# Install dependencies
RUN npm ci --only=production && npm cache clean --force

# Copy application code
COPY backend/src ./src
COPY backend/config ./config

# Create non-root user for security
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

# Change ownership of app directory
RUN chown -R nodejs:nodejs /app
USER nodejs

# Expose port
EXPOSE 5000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:5000/health || exit 1

# Start the application
CMD ["node", "src/index.js"]

# =============================================================================
# Frontend Dockerfile
FROM node:18-alpine AS frontend-build

WORKDIR /app

# Install dependencies
COPY frontend/package*.json ./
RUN npm ci

# Copy source code
COPY frontend/src ./src
COPY frontend/public ./public

# Set environment variables
ENV NODE_ENV=production
ENV GENERATE_SOURCEMAP=false

# Build the application
RUN npm run build

# Production stage
FROM nginx:alpine AS frontend-production

# Copy built app from build stage
COPY --from=frontend-build /app/build /usr/share/nginx/html

# Copy custom nginx configuration
COPY deploy/nginx.conf /etc/nginx/conf.d/default.conf

# Create nginx user
RUN addgroup -g 1001 -S nginx-custom && \
    adduser -S nginx-custom -u 1001

# Set permissions
RUN chown -R nginx-custom:nginx-custom /usr/share/nginx/html && \
    chown -R nginx-custom:nginx-custom /var/cache/nginx && \
    chown -R nginx-custom:nginx-custom /var/log/nginx

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:80/ || exit 1

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]

# =============================================================================
# ML Services Dockerfile
FROM python:3.9-slim AS ml-services

# Set working directory
WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    gcc \
    g++ \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Create non-root user
RUN useradd -m -u 1001 mluser

# Copy requirements and install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy ML service code
COPY ml-services/ ./
COPY data/ ./data/

# Download required NLTK data
RUN python -c "import nltk; nltk.download('punkt'); nltk.download('stopwords'); nltk.download('wordnet')"

# Set permissions
RUN chown -R mluser:mluser /app
USER mluser

# Create directories for models and logs
RUN mkdir -p models logs processed_data

# Expose port
EXPOSE 8000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:8000/health || exit 1

# Start the ML service
CMD ["python", "app.py"]

# =============================================================================
# Database Migration Dockerfile
FROM postgres:15-alpine AS db-migration

# Copy schema and migration files
COPY database/schema.sql /docker-entrypoint-initdb.d/01-schema.sql
COPY database/seed-data.sql /docker-entrypoint-initdb.d/02-seed-data.sql

# Set permissions
RUN chown -R postgres:postgres /docker-entrypoint-initdb.d/

# =============================================================================
# Complete Application Dockerfile (All services)
FROM docker/compose:latest AS full-stack

WORKDIR /app

# Copy docker-compose and configuration
COPY docker-compose.yml .
COPY .env.example .env
COPY deploy/ ./deploy/

# Set up environment
ENV COMPOSE_PROJECT_NAME=mental_health_platform

# Health check for the entire stack
HEALTHCHECK --interval=60s --timeout=30s --start-period=10s --retries=3 \
    CMD docker-compose ps | grep -q "Up" || exit 1

CMD ["docker-compose", "up"]