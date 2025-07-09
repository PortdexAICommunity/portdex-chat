#!/bin/sh

# Exit on any error
set -e

echo "🚀 Starting application..."

# Wait for PostgreSQL to be ready
echo "⏳ Waiting for PostgreSQL to be ready..."
until pg_isready -h postgres -p 5432 -U postgres; do
  echo "PostgreSQL is unavailable - sleeping"
  sleep 2
done

echo "✅ PostgreSQL is ready!"

# Run database migrations
echo "⏳ Running database migrations..."
npx tsx lib/db/migrate.ts

echo "✅ Database migrations completed!"

# Start the Next.js application
echo "🚀 Starting Next.js application..."
exec node server.js 