#!/bin/sh
set -e

echo "[entrypoint] applying database migrations…"
prisma migrate deploy --schema /app/prisma/schema.prisma

# First-boot admin bootstrap: create the configured admin user if missing.
# Idempotent — never overwrites an existing user, so changing the password
# in /admin/settings won't be undone by a restart.
echo "[entrypoint] ensuring admin user exists…"
node <<'EOF'
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const email = process.env.ADMIN_EMAIL;
const password = process.env.ADMIN_PASSWORD;
const name = process.env.ADMIN_NAME || 'Editor';

if (!email || !password) {
  console.log('[bootstrap] ADMIN_EMAIL / ADMIN_PASSWORD not set — skipping');
  process.exit(0);
}

const prisma = new PrismaClient();
(async () => {
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    console.log(`[bootstrap] admin "${email}" already exists`);
  } else {
    const passwordHash = await bcrypt.hash(password, 10);
    await prisma.user.create({
      data: { email, name, passwordHash, role: 'admin' },
    });
    console.log(`[bootstrap] created admin "${email}"`);
  }
  await prisma.$disconnect();
})().catch((e) => {
  console.error('[bootstrap] error:', e.message);
  process.exit(0); // never block startup
});
EOF

echo "[entrypoint] launching: $*"
exec "$@"
