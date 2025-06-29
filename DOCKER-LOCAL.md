# Docker Local Development Setup

This guide helps you set up the Portdex Chat application for local testing using Docker Compose.

## Prerequisites

- [Docker](https://docs.docker.com/get-docker/) (v20.10+)
- [Docker Compose](https://docs.docker.com/compose/install/) (v2.0+)

## Quick Start

### Option 1: Using the Helper Script (Recommended)

1. **Make the script executable** (Unix/Linux/macOS):

   ```bash
   chmod +x docker-local.sh
   ```

2. **Start the services**:

   ```bash
   ./docker-local.sh up
   ```

3. **Access the application**:
   - Main app: http://localhost:3000
   - pgAdmin (database management): http://localhost:5050
     - Email: `admin@portdex.ai`
     - Password: `admin`

### Option 2: Using Docker Compose Directly

1. **Start services in background**:

   ```bash
   docker-compose up -d
   ```

2. **Run database migrations**:

   ```bash
   docker-compose run --rm migrate
   ```

3. **Access the application** at http://localhost:3000

## Services

The Docker Compose setup includes:

- **app**: Next.js application (port 3000)
- **postgres**: PostgreSQL database (port 5432)
- **redis**: Redis cache (port 6379)
- **migrate**: One-time database migration service
- **pgadmin**: Database management interface (port 5050)

## Development Mode

For development with hot reload:

```bash
# Using helper script
./docker-local.sh dev

# Or directly with Docker Compose
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up
```

## Environment Variables

The application requires several environment variables. On first run, the helper script will create a `.env.local` file with default values:

```env
# Database Configuration
POSTGRES_URL=postgresql://postgres:postgres@localhost:5432/portdex_chat

# Authentication
AUTH_SECRET=your-super-secret-auth-key-change-this-in-production-min-32-chars-long
NEXTAUTH_URL=http://localhost:3000

# Redis (optional)
REDIS_URL=redis://localhost:6379

# Application Environment
NODE_ENV=development
PORT=3000
HOSTNAME=0.0.0.0

# AI Provider API Keys (optional - add as needed)
# OPENAI_API_KEY=your-openai-api-key
# ANTHROPIC_API_KEY=your-anthropic-api-key
# GOOGLE_GENERATIVE_AI_API_KEY=your-google-api-key
```

**Important**: Update the `AUTH_SECRET` with a secure random string for production use.

## Helper Script Commands

The `docker-local.sh` script provides convenient commands:

```bash
# Start services
./docker-local.sh up

# Start in development mode with hot reload
./docker-local.sh dev

# Stop services
./docker-local.sh down

# View logs
./docker-local.sh logs [service-name]

# Run database migrations
./docker-local.sh migrate

# Reset database (WARNING: deletes all data)
./docker-local.sh db:reset

# Open shell in container
./docker-local.sh shell [service-name]

# View service status
./docker-local.sh status

# Clean up everything (WARNING: deletes all data)
./docker-local.sh clean
```

## Database Management

### Using pgAdmin

1. Access pgAdmin at http://localhost:5050
2. Login with `admin@portdex.ai` / `admin`
3. Add server connection:
   - Host: `postgres`
   - Port: `5432`
   - Database: `portdex_chat`
   - Username: `postgres`
   - Password: `postgres`

### Using Command Line

```bash
# Connect to PostgreSQL
docker-compose exec postgres psql -U postgres -d portdex_chat

# Run database migrations
./docker-local.sh migrate

# Reset database
./docker-local.sh db:reset
```

## Troubleshooting

### Port Conflicts

If you have conflicts with default ports, modify the port mappings in `docker-compose.yml`:

```yaml
services:
  app:
    ports:
      - "3001:3000" # Use port 3001 instead of 3000
  postgres:
    ports:
      - "5433:5432" # Use port 5433 instead of 5432
```

### Database Connection Issues

1. Ensure PostgreSQL is healthy:

   ```bash
   docker-compose ps postgres
   ```

2. Check database logs:

   ```bash
   ./docker-local.sh logs postgres
   ```

3. Reset database if needed:
   ```bash
   ./docker-local.sh db:reset
   ```

### Application Not Starting

1. Check application logs:

   ```bash
   ./docker-local.sh logs app
   ```

2. Rebuild the image:

   ```bash
   ./docker-local.sh build
   ```

3. Check environment variables in `.env.local`

### File Permission Issues (Linux/macOS)

If you encounter permission issues:

```bash
# Fix ownership of files
sudo chown -R $USER:$USER .

# Make script executable
chmod +x docker-local.sh
```

## Production Testing

To test the production build locally:

```bash
# Build production image
docker-compose build

# Start without development overrides
docker-compose up -d

# Check logs
docker-compose logs -f app
```

## Cleanup

To stop and remove all containers, networks, and volumes:

```bash
# Stop services
./docker-local.sh down

# Complete cleanup (WARNING: deletes all data)
./docker-local.sh clean
```

## Next Steps

1. Configure your AI provider API keys in `.env.local`
2. Set up your authentication settings
3. Customize the database schema as needed
4. Test your application features

For production deployment, refer to the main deployment documentation.
