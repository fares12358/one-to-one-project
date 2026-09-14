# One to One

CMS-driven, bilingual (EN + AR) marketing website for **One to One** — Egypt's first
independent field-trial management platform for the vegetable seed industry. One to One
doesn't grow, import, or sell seeds — it plans, executes, and reports on scientific field
trials (screening, multi-site validation, technical/commercial consulting, training) so
international seed companies, local agents, and R&D centers can make data-driven,
risk-managed launch decisions in the Egyptian market.

All site content (text, images, stats, contact info, brand colors, logos, SMTP/Telegram
notification config) is managed through a private `/dashboard` — no code deploys are
needed to update content.

> This codebase started as a white-label clone of an agricultural-import template
> ("Valley Seeds"). Every section, string, and CMS default has since been rewritten
> end-to-end for One to One's field-trial business. See `CLAUDE.md` for the full
> architectural history if you have access to it — it is intentionally excluded from
> version control in this repo (see `.gitignore`) and is contributor/AI-agent reference
> material, not part of the shipped product.

---

## Table of contents

- [Tech stack](#tech-stack)
- [Repository layout](#repository-layout)
- [Features](#features)
- [Prerequisites](#prerequisites)
- [Local development (without Docker)](#local-development-without-docker)
- [Environment variables](#environment-variables)
- [API overview](#api-overview)
- [Docker](#docker)
- [Deploying to a VPS](#deploying-to-a-vps)
- [White-label replication](#white-label-replication)
- [Known limitations](#known-limitations)

---

## Tech stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 16 (App Router), React 19, Tailwind CSS 4, Framer Motion, Axios |
| Backend | Node.js (ESM) + Express 4, Mongoose 8 |
| Database | MongoDB (Atlas or self-hosted — connected via `MONGO_URI`, not bundled in Docker Compose) |
| Auth | HTTP-only JWT cookie, single seeded admin account, no registration UI |
| Image storage | Local disk on the backend (`backend/src/uploads/`), served via Express static — not Cloudinary/S3 |
| Email | Nodemailer, SMTP config editable from the dashboard (AES-256-GCM encrypted at rest) with `.env` fallback |
| Notifications | Telegram bot (contact-form alerts), config editable from the dashboard with `.env` fallback |
| Containerization | Docker + Docker Compose (two services: `backend`, `frontend`) |

## Repository layout

Two independent Node projects share this repo root, each with its own `package.json`
(no shared root `node_modules` beyond the orchestration scripts below):

```
one-to-one/
├── frontend/                Next.js app — public website + /dashboard (port 3000)
│   ├── src/app/              routes (public pages + /dashboard route group)
│   ├── src/components/       public-site sections + dashboard components
│   ├── src/i18n/             locales/en.js, locales/ar.js + translation loader
│   ├── src/context/          LangContext (public i18n), AuthContext (dashboard auth)
│   ├── src/services/api.js   shared Axios instance (withCredentials: true)
│   └── Dockerfile
├── backend/                  Node/Express REST API (port 5000)
│   ├── src/modules/          feature modules: auth, content, settings, upload, contact, telegram
│   ├── src/middlewares/      auth, rate limiting, error handling
│   ├── src/config/           db connection, seed script, email templates
│   ├── src/uploads/          uploaded images (gitignored, persisted via Docker volume)
│   └── Dockerfile
├── docker-compose.yml         orchestrates backend + frontend containers
├── .env.example                env for docker-compose itself (build-time frontend URL, host ports)
└── package.json                root convenience scripts (concurrently runs both dev servers)
```

## Features

- **Bilingual public site** (EN/AR) — single-page scroll layout, 16 CMS-editable content
  sections (`nav hero about whyUs mission philosophy problem services technology serve
  partners clients market team contact footer`).
- **Private dashboard** (`/dashboard`) — JWT-protected, section-by-section content
  editors, image manager, contact-message inbox, site settings.
- **Site settings** — brand name/logo, dynamic primary/accent brand colors (applied at
  runtime via CSS variables on the public site), contact info, social links.
- **Local image storage** — uploaded images are written to the backend's own disk and
  served statically; no external image CDN dependency.
- **Dashboard-configurable outbound email** — SMTP (or Gmail app-password) credentials
  can be set from Settings, encrypted at rest, used for contact-form delivery and
  password-reset emails.
- **Dashboard-configurable Telegram alerts** — optional bot notification on every
  contact-form submission, configured and tested entirely from the dashboard.
- **Self-service password reset** and in-session admin email/password change.
- Google Analytics 4 + Meta Pixel wired into the root layout.

## Prerequisites

- Node.js ≥ 18 (backend `engines` requires this; Docker images use Node 22)
- npm
- A MongoDB connection string (Atlas or self-hosted) — this project does **not** run
  MongoDB in Docker; only the two app containers are orchestrated
- (Optional, for containerized workflow) Docker + Docker Compose v2

## Local development (without Docker)

```bash
git clone <repo-url> one-to-one
cd one-to-one

# 1. Backend env
cp backend/.env.example backend/.env
# fill in MONGO_URI, JWT_SECRET, ADMIN_EMAIL, ADMIN_PASSWORD at minimum (required —
# the server exits at startup if any are missing). See "Environment variables" below.

# 2. Frontend env
# There's no committed example file for this one — just create frontend/.env.local
# with the one line below (see "Environment variables" for the full picture):
echo "NEXT_PUBLIC_API_URL=http://localhost:5000/api" > frontend/.env.local

# 3. Install dependencies
npm install --prefix backend
npm install --prefix frontend

# 4. Seed the database (idempotent — 16 Content docs + Settings + the admin account)
npm run seed --prefix backend

# 5. Run both dev servers together from the repo root...
npm run dev
# ...or separately, each with its own terminal:
npm run dev:backend    # nodemon, http://localhost:5000
npm run dev:frontend   # Next.js dev server, http://localhost:3000
```

Then sign in at `http://localhost:3000/dashboard/login` with the `ADMIN_EMAIL` /
`ADMIN_PASSWORD` you seeded.

### Root convenience scripts

| Command | Effect |
|---|---|
| `npm run dev` | Runs backend + frontend dev servers concurrently |
| `npm run dev:backend` | Backend dev server only |
| `npm run dev:frontend` | Frontend dev server only |
| `npm run build` | Production build of the frontend only |
| `npm run start` | Starts the backend in production mode |

### Frontend scripts (`frontend/`)

```
npm run dev      # Next.js dev server, port 3000
npm run build    # production build
npm run start    # serve production build
npm run lint     # next lint
```

### Backend scripts (`backend/`)

```
npm run dev      # nodemon src/server.js, port 5000
npm run start    # node src/server.js
npm run seed     # populate MongoDB — 16 Content docs + Settings + Admin (idempotent upserts)
```

There is no automated test suite in either project (tracked as a known gap).

## Environment variables

### `backend/.env` (required unless noted)

| Variable | Required | Notes |
|---|---|---|
| `PORT` | No | Defaults to `5000` |
| `NODE_ENV` | No | `development` / `production` |
| `MONGO_URI` | **Yes** | MongoDB connection string |
| `JWT_SECRET` | **Yes** | Signs the auth cookie; also used to derive the AES-256-GCM key for encrypted email/Telegram credentials — rotating it invalidates previously-saved encrypted secrets |
| `JWT_EXPIRES_IN` | No | Defaults to `7d` |
| `ADMIN_EMAIL` | **Yes** | Seeded single admin account email |
| `ADMIN_PASSWORD` | **Yes** | Seeded single admin account password |
| `CLIENT_URL` | No (but set it) | Used to build password-reset email links; defaults to `http://localhost:3000` |
| `DASHBOARD_URL` | No | Included in the CORS allowlist alongside `CLIENT_URL` |
| `EMAIL_HOST` / `EMAIL_PORT` / `EMAIL_SECURE` / `EMAIL_USER` / `EMAIL_PASS` / `EMAIL_FROM` / `EMAIL_TO` | No | Fallback SMTP config, only used if nothing is saved in the dashboard's Settings → Email card |
| `TELEGRAM_BOT_TOKEN` / `TELEGRAM_CHAT_ID` | No | Fallback Telegram config, only used if nothing is saved in the dashboard's Settings → Telegram card |
| `TELEGRAM_WEBHOOK_SECRET` | No (recommended if Telegram is used) | Validates incoming webhook calls actually come from Telegram |
| `WEBHOOK_BASE_URL` | No | Default base URL used when registering the Telegram webhook from the dashboard without typing a URL each time |

### `frontend/.env.local`

| Variable | Required | Notes |
|---|---|---|
| `NEXT_PUBLIC_API_URL` | **Yes** | Must point at the backend's `/api` root, e.g. `http://localhost:5000/api` in dev. Baked in at **build time** for the standalone/Docker build. |

### `.env` at repo root (read only by `docker-compose.yml`)

| Variable | Required | Notes |
|---|---|---|
| `NEXT_PUBLIC_API_URL` | For Docker builds | Must be a URL the **browser** can reach, not the internal `backend` service hostname |
| `BACKEND_PORT` | No | Host port mapped to the backend container, defaults to `5000` |
| `FRONTEND_PORT` | No | Host port mapped to the frontend container, defaults to `3000` |

Copy `.env.example` → `.env` at the repo root before running `docker compose up`.

## API overview

All responses are `{ success: true, data }` or `{ success: false, message }`. Routes are
mounted under `/api` in `backend/src/server.js`.

| Base path | Module | Notes |
|---|---|---|
| `GET /api/health` | — | Health check, used by Docker healthchecks |
| `/api/auth` | `auth` | `login`, `logout`, `me`, `forgot-password`, `reset-password`, `credentials` (in-session change) |
| `/api/content` | `content` | Public `GET` of all 16 sections; protected `PUT` per section for the dashboard |
| `/api/settings` | `settings` | Public `GET` (brand/contact info, excludes `emailConfig`/`telegramConfig`); protected `PUT`, plus protected `/settings/email` and `/settings/telegram` sub-resources |
| `/api/upload` | `upload` | Protected image upload/delete, backed by local disk storage (`multer`) |
| `/api/contact` | `contact` | Public contact-form submission — triggers email + Telegram notification, both fire-and-forget |
| `/api/telegram` | `telegram` | Public webhook (`/webhook`, secret-token validated) + protected `register-webhook`, `webhook-info`, `test` |

Auth is a single HTTP-only JWT cookie (`vs_token`, 7-day expiry) — there is no
registration flow or multi-user support by design.

## Docker

This repo ships a `docker-compose.yml` at the root that builds and runs **both**
apps as containers. It deliberately does **not** run MongoDB — this project connects to
an external Mongo (e.g. Atlas) via `MONGO_URI`.

```bash
# from the repo root
cp .env.example .env                      # set NEXT_PUBLIC_API_URL + optional ports
cp backend/.env.example backend/.env       # fill in MONGO_URI, JWT_SECRET, ADMIN_EMAIL, ADMIN_PASSWORD, etc.

docker compose up --build -d
```

- **Backend** builds from `backend/Dockerfile` (Node 22 alpine, non-root user, prod
  deps only), reads its config from `backend/.env` via `env_file` (never baked into the
  image), and exposes `${BACKEND_PORT:-5000}`.
- **Frontend** builds from `frontend/Dockerfile` as a standalone Next.js production
  build. `NEXT_PUBLIC_API_URL` is passed as a build `ARG` — it must already be reachable
  from a **browser**, not the internal Docker network, since it's compiled into the
  client bundle. Exposes `${FRONTEND_PORT:-3000}`.
- **Uploaded images persist** across container recreates via the named volume
  `backend_uploads`, mounted at `/app/src/uploads` in the backend container. This is
  required — a serverless/ephemeral filesystem would silently lose every uploaded image
  on the next deploy (this is also why the backend can no longer run on Vercel
  serverless; see `backend/vercel.json`, which is stale and not a valid deploy target
  anymore).
- Both services have a Docker `HEALTHCHECK`, and `frontend` waits on
  `backend: condition: service_healthy` before starting.
- Rebuilding after a code change: `docker compose up --build -d` (add `--no-deps
  <service>` to rebuild just one).
- Logs: `docker compose logs -f backend` / `frontend`.
- Stopping: `docker compose down` (add `-v` only if you intentionally want to wipe the
  `backend_uploads` volume — this deletes every uploaded image, so don't do this in
  production without a backup).

> **Note:** `backend/Dockerfile`'s own `HEALTHCHECK` instruction currently probes
> `/api/v1/health`, which doesn't exist on this API (the real route is `/api/health`,
> already correctly used by `docker-compose.yml`'s own healthcheck). This only affects
> running the backend image standalone outside this compose file — under
> `docker compose up`, the compose-level healthcheck is what's actually used.

## Deploying to a VPS

The backend requires a **persistent filesystem** (uploaded images live on disk — see
above), so it should run on a normal VPS/host rather than serverless. A typical setup:

1. **Provision a VPS** (Ubuntu 22.04+ is a safe default) and point a DNS record (or two,
   if you split frontend/API onto subdomains) at its IP.
2. **Install Docker + Docker Compose plugin**:
   ```bash
   curl -fsSL https://get.docker.com | sh
   sudo usermod -aG docker $USER   # log out/in after this
   ```
3. **Allow only the ports you need** (SSH + HTTP/HTTPS; keep 3000/5000 off the public
   firewall — they're proxied, not exposed directly):
   ```bash
   sudo ufw allow OpenSSH
   sudo ufw allow 80/tcp
   sudo ufw allow 443/tcp
   sudo ufw enable
   ```
4. **Clone the repo and configure env files** as in the [Docker](#docker) section above.
   For a real deployment, set:
   - `backend/.env`: real `MONGO_URI` (whitelist the VPS's outbound IP in Atlas's
     Network Access if using Atlas), a strong random `JWT_SECRET`, real
     `ADMIN_EMAIL`/`ADMIN_PASSWORD`, `CLIENT_URL`/`DASHBOARD_URL` set to your real
     public domain (`NODE_ENV=production`).
   - root `.env`: `NEXT_PUBLIC_API_URL` set to your **public** API URL, e.g.
     `https://api.yourdomain.com/api` — this is baked into the frontend at build time,
     so changing it later requires a rebuild (`docker compose up --build -d frontend`),
     not just a restart.
5. **Seed the database once**, then bring the stack up:
   ```bash
   docker compose run --rm backend npm run seed
   docker compose up -d --build
   ```
6. **Put a reverse proxy with TLS in front** — Compose only exposes plain HTTP on the
   host ports. Nginx + Let's Encrypt is the simplest path:
   ```bash
   sudo apt install -y nginx certbot python3-certbot-nginx
   ```
   Example `/etc/nginx/sites-available/one-to-one` (two subdomains — adjust if you'd
   rather path-route a single domain):
   ```nginx
   server {
       server_name yourdomain.com www.yourdomain.com;
       location / {
           proxy_pass http://127.0.0.1:3000;
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
           proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
           proxy_set_header X-Forwarded-Proto $scheme;
       }
   }

   server {
       server_name api.yourdomain.com;
       location / {
           proxy_pass http://127.0.0.1:5000;
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
           proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
           proxy_set_header X-Forwarded-Proto $scheme;
       }
   }
   ```
   ```bash
   sudo ln -s /etc/nginx/sites-available/one-to-one /etc/nginx/sites-enabled/
   sudo nginx -t && sudo systemctl reload nginx
   sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com -d api.yourdomain.com
   ```
   The backend already sets `trust proxy` and reads `req.protocol`/`req.get("host")`
   correctly behind a proxy like this (used to build uploaded-image URLs), and CORS is
   driven by `CLIENT_URL`/`DASHBOARD_URL`, so make sure those env vars match the real
   public domain before starting the stack.
7. **If using Telegram notifications**, register the webhook once the backend is
   reachable over public HTTPS: from the dashboard's Settings → Telegram card, or
   directly via `POST /api/telegram/register-webhook` with your public
   `https://api.yourdomain.com/api/telegram/webhook` URL.
8. **Ongoing deploys**:
   ```bash
   git pull
   docker compose up -d --build
   ```
9. **Back up the `backend_uploads` volume** periodically (it holds every uploaded
   image and isn't otherwise replicated):
   ```bash
   docker run --rm -v one-to-one_backend_uploads:/data -v $(pwd):/backup alpine \
     tar czf /backup/uploads-backup.tar.gz -C /data .
   ```

## White-label replication

This codebase is built for clone-and-rebrand reuse:

1. Clone the repo, rename the root folder.
2. Update `backend/.env` — new `MONGO_URI`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`, email
   config.
3. Update `frontend/.env.local` (and root `.env` for Docker builds) — point
   `NEXT_PUBLIC_API_URL` at the new backend.
4. Replace `frontend/public/images/logo.png` / `logo-white.png`, or simply set
   `Settings.logoUrl`/`logoWhiteUrl` from the dashboard post-deploy instead of touching
   files.
5. Edit the section content and `DEFAULT_SETTINGS` in `backend/src/config/seed.js`, then
   run `npm run seed`.
6. Deploy — no further code changes required. Brand name, colors, and logos live in the
   single `Settings` document and are editable from `/dashboard/settings`.

## Known limitations

- No automated test suite (unit/integration/E2E) in either project.
- No API documentation (Swagger/Postman collection).
- CSRF protection is an Origin-header check, not a full double-submit token scheme.
- No JWT refresh/rotation — a single 7-day token with no revocation store.
- Single global admin account; no multi-user roles.
- Rate limiting and the admin-lookup cache use in-memory stores — fine on a single
  persistent VPS container, but wouldn't survive multiple replicas without a shared
  store (e.g. Redis).
- `backend/Dockerfile`'s built-in `HEALTHCHECK` path is stale (`/api/v1/health` vs. the
  real `/api/health`) — harmless under `docker compose` (which defines its own correct
  healthcheck) but worth fixing if you run the backend image standalone.
- `backend/vercel.json` still targets Vercel serverless — stale now that local-disk
  image storage requires a persistent host; not a valid deploy target as-is.
- Rotating `JWT_SECRET` invalidates any previously-saved encrypted email/Telegram
  credentials in `Settings` (falls back to `.env` values, doesn't crash, but requires
  re-entering them in the dashboard).
