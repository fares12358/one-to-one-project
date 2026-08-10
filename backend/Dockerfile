# One to One — backend (Node/Express API)
# Plain single-stage build: no compile step, just prod deps + source.
# Requires a persistent volume mounted at /app/src/uploads (see root
# docker-compose.yml) — this container's own filesystem is not durable
# across recreates, and uploaded images live on disk (see CLAUDE.md's
# "Image storage" section).

FROM node:20-alpine

WORKDIR /app

# Install prod-only deps first so this layer is cached across source edits
COPY package.json package-lock.json ./
RUN npm ci --omit=dev

COPY . .

# Non-root user for the process; uploads dir must be writable by it
RUN addgroup -g 1001 -S nodejs \
  && adduser -S expressjs -u 1001 \
  && mkdir -p src/uploads \
  && chown -R expressjs:nodejs /app

USER expressjs

ENV NODE_ENV=production
EXPOSE 5000

# MONGO_URI / JWT_SECRET / ADMIN_EMAIL / ADMIN_PASSWORD are required at
# startup (server.js exits immediately if missing) — pass them via
# docker-compose's env_file/environment, never bake them into the image.
CMD ["node", "src/server.js"]
