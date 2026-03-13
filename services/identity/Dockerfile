# Stage 1: Builder
FROM node:20-alpine AS builder

WORKDIR /app

# Copy workspace manifests
COPY package.json package-lock.json turbo.json ./
COPY packages/common/package.json ./packages/common/
COPY packages/database/package.json ./packages/database/
COPY packages/events/package.json ./packages/events/
COPY services/identity/package.json ./services/identity/

# Install all dependencies (needed for workspace links)
RUN npm ci --workspace=services/identity --workspace=packages/common --workspace=packages/database --workspace=packages/events

# Copy source code
COPY tsconfig.base.json ./
COPY packages/common ./packages/common
COPY packages/database ./packages/database
COPY packages/events ./packages/events
COPY services/identity ./services/identity

# Build workspace packages first, then the service
RUN npm run build --workspace=packages/common && \
    npm run build --workspace=packages/database && \
    npm run build --workspace=packages/events && \
    npm run build --workspace=services/identity

# Stage 2: Production
FROM node:20-alpine AS production

ENV NODE_ENV=production

WORKDIR /app

# Create non-root user
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nestjs

# Copy package manifests for production install
COPY package.json package-lock.json turbo.json ./
COPY packages/common/package.json ./packages/common/
COPY packages/database/package.json ./packages/database/
COPY packages/events/package.json ./packages/events/
COPY services/identity/package.json ./services/identity/

# Install production dependencies only
RUN npm ci --workspace=services/identity --workspace=packages/common --workspace=packages/database --workspace=packages/events --omit=dev

# Copy built artifacts from builder
COPY --from=builder /app/packages/common/dist ./packages/common/dist
COPY --from=builder /app/packages/database/dist ./packages/database/dist
COPY --from=builder /app/packages/events/dist ./packages/events/dist
COPY --from=builder /app/services/identity/dist ./services/identity/dist

USER nestjs

EXPOSE 3001

HEALTHCHECK --interval=30s --timeout=10s --start-period=30s --retries=3 \
  CMD wget -qO- http://localhost:3001/health || exit 1

CMD ["node", "services/identity/dist/main.js"]
