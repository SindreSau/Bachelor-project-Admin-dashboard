FROM node:20-alpine AS base
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Install dependencies only when needed
FROM base AS deps
WORKDIR /app

# Install dependencies
COPY package.json pnpm-lock.yaml* ./
RUN npm install -g pnpm
RUN pnpm install

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Generate Prisma Client for the correct platform
RUN npm install -g pnpm prisma
RUN cd src && npx prisma generate

# Build Next.js
RUN pnpm run build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production

# Install required tools in the runner stage
RUN npm install -g pnpm prisma tsx

# Create non-root user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy necessary files and ensure proper structure
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/pnpm-lock.yaml ./pnpm-lock.yaml
COPY --from=builder /app/src/prisma ./src/prisma
COPY --from=builder /app/node_modules ./node_modules

# Set the correct permission for prerender cache
RUN mkdir .next
RUN chown nextjs:nodejs .next

# Copy built application
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

# Ensure proper permissions
RUN chown -R nextjs:nodejs /app

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Create a startup script
COPY --chown=nextjs:nodejs <<'EOF' /app/start.sh
#!/bin/sh
cd /app

echo "Resetting database..."
npx prisma migrate reset --force  # This will drop the DB, run migrations, and seed

echo "Starting Next.js application..."
exec node server.js
EOF

RUN chmod +x /app/start.sh

CMD ["/app/start.sh"]