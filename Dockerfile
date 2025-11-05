# Multi-stage build for SlotSwapper

# Stage 1: Build React frontend
FROM node:18-alpine AS frontend-build
WORKDIR /app/client
COPY client/package*.json ./
RUN npm ci --only=production
COPY client/ ./
RUN npm run build

# Stage 2: Setup backend and serve
FROM node:18-alpine
WORKDIR /app

# Copy backend files
COPY package*.json ./
RUN npm ci --only=production

COPY server/ ./server/
COPY test-api.js ./

# Copy built frontend from stage 1
COPY --from=frontend-build /app/client/build ./client/build

# Expose port
EXPOSE 5000

# Set environment to production
ENV NODE_ENV=production

# Start the application
CMD ["node", "server/index.js"]
