# Use a specific Node.js version (LTS) for consistency
FROM node:20-alpine AS builder

# Set working directory
WORKDIR /app

# Copy only package.json and package-lock.json first for caching
#COPY package.json package-lock.json ./
COPY package.json ./

# Install dependencies with cache
RUN --mount=type=cache,target=/root/.npm \
    npm install \
    npm ci --production

# Copy application code
COPY server.js .

# Final stage for minimal image
FROM node:20-alpine

WORKDIR /app

# Copy only necessary files from builder stage
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/server.js .

# Run as non-root user for security
USER node

# Expose port (will be configured via environment variable)
EXPOSE 3000

# Use exec form to allow proper signal handling
CMD ["node", "server.js"]