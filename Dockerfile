# syntax=docker/dockerfile:1.7
# ---------------------------------------------------------------------------
# Multi-stage build for the magazine blog
#  · deps stage  → install dependencies (Prisma engines for linux-musl auto-fetched)
#  · build stage → next build (output: standalone)
#  · run  stage  → node:alpine + standalone bundle + prisma CLI for migrate
#
# Resulting image: ~220 MB · runtime memory: ~150 MB
# ---------------------------------------------------------------------------

ARG NODE_VERSION=20.18.1

# ---------- 1. Dependencies ----------
FROM node:${NODE_VERSION}-alpine AS deps
RUN apk add --no-cache libc6-compat openssl
WORKDIR /app

COPY package.json package-lock.json ./
COPY prisma ./prisma
# `npm ci` runs the package's own `postinstall: prisma generate`.
RUN npm ci --no-audit --no-fund

# ---------- 2. Build ----------
FROM node:${NODE_VERSION}-alpine AS build
RUN apk add --no-cache libc6-compat openssl
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1
ENV DATABASE_URL="file:/tmp/build.db"

COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npx prisma generate
RUN npm run build

# ---------- 3. Runtime ----------
FROM node:${NODE_VERSION}-alpine AS runner
RUN apk add --no-cache libc6-compat openssl curl tini
WORKDIR /app
ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    PORT=3000 \
    HOSTNAME=0.0.0.0 \
    DATABASE_URL="file:/app/data/prod.db"

# Non-root runtime user.
RUN addgroup --system --gid 1001 nodejs && \
    adduser  --system --uid 1001 nextjs && \
    mkdir -p /app/data /app/public/uploads && \
    chown -R nextjs:nodejs /app

# Standalone bundle ships traced @prisma/client + engines + bcryptjs etc.
COPY --from=build --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=build --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=build --chown=nextjs:nodejs /app/public ./public
# Prisma migrations + schema for `migrate deploy` at boot.
COPY --from=build --chown=nextjs:nodejs /app/prisma ./prisma

# A focused install of the Prisma CLI + bcryptjs (entrypoint admin bootstrap).
# Adds ~45 MB total but keeps the rest of the image tiny.
RUN npm install --omit=dev --no-audit --no-fund --prefix /opt/tools \
        prisma@6 bcryptjs@2 @prisma/client@6 && \
    ln -s /opt/tools/node_modules/.bin/prisma /usr/local/bin/prisma && \
    chown -R nextjs:nodejs /opt/tools

ENV NODE_PATH=/opt/tools/node_modules

COPY --chown=nextjs:nodejs docker/entrypoint.sh /usr/local/bin/entrypoint.sh
RUN chmod +x /usr/local/bin/entrypoint.sh

USER nextjs
EXPOSE 3000

# Persistent data (SQLite + uploads) belong on a mounted volume.
VOLUME ["/app/data", "/app/public/uploads"]

HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
  CMD curl -fsS http://127.0.0.1:3000/robots.txt || exit 1

ENTRYPOINT ["/sbin/tini", "--", "/usr/local/bin/entrypoint.sh"]
CMD ["node", "server.js"]
