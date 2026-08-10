# One to One — backend (Node/Express API)
# Plain single-stage build: no compile step, just prod deps + source.
# Requires a persistent volume mounted at /app/src/uploads (see root
# docker-compose.yml) — this container's own filesystem is not durable
# across recreates, and uploaded images live on disk (see CLAUDE.md's
# "Image storage" section).

FROM node:22-alpine AS deps

WORKDIR /app

# Install prod-only deps first so this layer is cached across source edits
COPY package*.json ./
RUN npm ci --omit=dev
FROM node:22-alpine AS runner
WORKDIR /app

# Non-root user for security
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Create uploads directory with correct permissions
RUN mkdir -p src/uploads/expenses && chown -R appuser:appgroup src/uploads

USER appuser

EXPOSE 5000

ENV NODE_ENV=production

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget -qO- http://localhost:5000/api/v1/health || exit 1

CMD ["node", "src/server.js"]