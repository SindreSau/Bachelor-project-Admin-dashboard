FROM node:23-alpine AS base
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

ENV NEXT_TELEMETRY_DISABLED=1

# Install pnpm in the builder stage
RUN npm install -g pnpm prisma

# Generate Prisma Client
RUN cd src && npx prisma generate

# Build Next.js
RUN pnpm run build:standalone

# Production image, copy all the files and run next
FROM node:23-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production

# Create non-root user
RUN addgroup -S -g 1001 nodejs && \
  adduser -S -u 1001 -G nodejs nextjs

# Copy only what's needed for production
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public
COPY --from=builder /app/src/prisma ./src/prisma

# Install Prisma CLI for migrations only
WORKDIR /home/nextjs
RUN npm install -g prisma
WORKDIR /app

# Set the correct permission for prerender cache
RUN mkdir -p .next
RUN chown nextjs:nodejs .next

# Create a startup script that only runs migrations (no reset, no seed)
RUN printf '#!/bin/sh\necho "Running database migrations..."\ncd /app\nprisma migrate deploy --schema=./src/prisma/schema.prisma\necho "Starting Next.js application..."\nexec node server.js\n' > start.sh
RUN chmod +x /app/start.sh

# Ensure proper permissions
RUN chown -R nextjs:nodejs /app

USER nextjs

EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Use direct path to the script
CMD ["/app/start.sh"]