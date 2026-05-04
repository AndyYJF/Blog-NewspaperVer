# Docker deployment

Three-stage Alpine build → final image **~180 MB**, runtime memory **~150 MB**.
SQLite database and uploads are persisted on named Docker volumes.

## 1. Prepare environment

Create `.env` next to `docker-compose.yml`:

```env
# Required
AUTH_SECRET=<openssl rand -hex 32>
ADMIN_EMAIL=you@example.com
ADMIN_PASSWORD=change-me-please
AUTH_URL=https://your-domain.example

# Optional — also editable from /admin/settings after first boot
SITE_URL=https://your-domain.example
SITE_TITLE=Quill & Press
SITE_TAGLINE=A magazine of essays, ideas, and quiet observations
```

## 2. Build & run

```bash
docker compose up -d --build
docker compose logs -f blog
```

First boot runs `prisma migrate deploy` and seeds an admin user + sample
posts when the database is empty. Subsequent boots are idempotent.

Open <http://localhost:3000>. Sign in at `/admin/login` with the credentials
from `.env`, then **change every secret in `/admin/settings`** — the values
in `.env` are only used until something is stored in the DB.

## 3. Reverse proxy (optional but recommended)

Use the bundled `Caddyfile`:

```bash
sudo cp docker/Caddyfile /etc/caddy/Caddyfile
sudo systemctl reload caddy
```

Caddy will obtain a Let's Encrypt certificate for the domain you put at
the top of the file, then proxy port 80/443 → `127.0.0.1:3000`.

## 4. Resource budget

| Workload | RAM | CPU |
|---|---|---|
| Idle | ~110 MB | ~0% |
| Average traffic | 140–180 MB | <5% of 1 vCPU |
| 50 RPS sustained | 250–320 MB | ~30% of 1 vCPU |

Recommended VPS: **1 vCPU / 1 GB RAM** (e.g. Hetzner CAX11, Oracle ARM
free tier, 阿里云 / 腾讯云轻量 1C1G). The compose file caps memory at
512 MB; raise it if you stress-test.

## 5. Backups

The two volumes hold all mutable state:

```bash
docker run --rm -v my-blog_blog-data:/data -v "$PWD":/backup alpine \
    tar -czf /backup/blog-data-$(date +%F).tgz -C /data .
docker run --rm -v my-blog_blog-uploads:/data -v "$PWD":/backup alpine \
    tar -czf /backup/blog-uploads-$(date +%F).tgz -C /data .
```

Restore is the same command with `-xzf` and the volume mounted writable.

## 6. Updating

```bash
git pull
docker compose build --pull
docker compose up -d
```

The migration step in `entrypoint.sh` applies any new Prisma migrations
automatically — no manual `prisma migrate` needed.
