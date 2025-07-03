# syntax=docker/dockerfile:1
FROM node:20-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

RUN rm -rf .next node_modules

COPY package.json pnpm-lock.yaml* ./
RUN corepack enable pnpm && pnpm install --frozen-lockfile

# Build the app with standalone output
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Enable standalone output in next.config.js:
# module.exports = { output: 'standalone' }

RUN corepack enable pnpm && pnpm build

# Production image
FROM node:20-alpine AS runner
WORKDIR /app
#####################################
# ENV NODE_ENV=production
# ENV PORT=3000
# ENV HOSTNAME="0.0.0.0"
# ENV AUTH_URL="https://chat.portdex.ai/"
####################################
# Create non-root user for security
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Copy only the standalone output
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

USER nextjs

EXPOSE 3000

# Use the Next.js built-in production server
CMD ["node", "server.js"]
