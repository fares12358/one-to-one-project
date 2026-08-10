# One to One — frontend (Next.js, standalone output)
# NEXT_PUBLIC_API_URL is a build-time value: Next.js inlines NEXT_PUBLIC_*
# vars into the client bundle at `next build` time, and next.config.mjs
# also reads it at build time to derive the allowed next/image remote host.
# Pass it as a build ARG — setting it only as a runtime `environment:` in
# docker-compose has NO effect on the already-built bundle.
# IMPORTANT: this must be a URL the end user's *browser* can reach (e.g.
# http://localhost:5000/api for local docker-compose, or the real public
# backend domain in production) — never the internal Docker network
# hostname (http://backend:5000/api), which only resolves container-to-
# container, not from the browser.

FROM node:22-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm install

FROM node:22-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
ENV NODE_ENV=production

RUN npm run build

FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# next.config.mjs sets output: "standalone" — this copies just the traced
# production server + its deps, not the full node_modules tree.
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER appuser

ENV PORT=3000
EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=15s --retries=3 \
  CMD wget -qO- http://localhost:3000 || exit 1

CMD ["node", "server.js"]