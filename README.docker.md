# Docker Deployment Guide

This guide explains how to build and deploy the Portdex Chat application using Docker.

## Prerequisites

- Docker and Docker Compose installed
- PostgreSQL database (or use the provided docker-compose.yml)

## Quick Start with Docker Compose

1. **Start the services:**

   ```bash
   docker-compose up -d
   ```

2. **Check the application:**

   - Application: http://localhost:3000
   - Health check: http://localhost:3000/api/health

3. **Stop the services:**
   ```bash
   docker-compose down
   ```

## Manual Docker Build

1. **Build the Docker image:**

   ```bash
   docker build -t portdex-chat .
   ```

2. **Run the container:**
   ```bash
   docker run -d \
     --name portdex-chat \
     -p 3000:3000 \
     -e POSTGRES_URL="postgresql://username:password@host:5432/database" \
     -e AUTH_SECRET="your-secret-key" \
     -e NEXTAUTH_URL="http://localhost:3000" \
     portdex-chat
   ```

## Environment Variables

### Required Variables

- `POSTGRES_URL`: PostgreSQL connection string
- `AUTH_SECRET`: Secret key for NextAuth.js
- `NEXTAUTH_URL`: Base URL of your application

### Optional Variables

- `OPENAI_API_KEY`: OpenAI API key for AI features
- `ANTHROPIC_API_KEY`: Anthropic API key for Claude models
- `XAI_API_KEY`: xAI API key for Grok models
- `REDIS_URL`: Redis connection string for caching
- `BLOB_READ_WRITE_TOKEN`: Vercel Blob token for file storage
- `VERCEL_ANALYTICS`: Enable Vercel Analytics

### Example Environment File

Create a `.env.local` file with:

```env
# Database
POSTGRES_URL=postgresql://postgres:postgres@localhost:5432/portdex_chat

# Authentication
AUTH_SECRET=your-random-secret-key-here
NEXTAUTH_URL=http://localhost:3000

# AI Services (add your API keys)
OPENAI_API_KEY=sk-your-openai-key
ANTHROPIC_API_KEY=sk-ant-your-anthropic-key
XAI_API_KEY=xai-your-xai-key

# Application
NODE_ENV=production
NEXT_TELEMETRY_DISABLED=1
```

## Testing the Docker Image

1. **Build and test locally:**

   ```bash
   # Build the image
   docker build -t portdex-chat .

   # Run with docker-compose (includes PostgreSQL)
   docker-compose up -d

   # Check health
   curl http://localhost:3000/api/health

   # View logs
   docker-compose logs app
   ```

2. **Test in production-like environment:**

   ```bash
   # Build for production
   docker build --target runner -t portdex-chat:prod .

   # Run with production settings
   docker run -d \
     --name portdex-chat-prod \
     -p 3000:3000 \
     --env-file .env.local \
     portdex-chat:prod
   ```

## Architecture

The Dockerfile uses a multi-stage build:

1. **Base**: Sets up Node.js and pnpm
2. **Dependencies**: Installs npm packages
3. **Builder**: Builds the application (includes database migrations)
4. **Runner**: Production image with minimal footprint

## Security Features

- Non-root user (`nextjs`) for running the application
- Minimal Alpine Linux base image
- Health checks for monitoring
- Proper file permissions

## Troubleshooting

### Database Connection Issues

1. Ensure PostgreSQL is running and accessible
2. Check the `POSTGRES_URL` format
3. Verify network connectivity between containers

### Build Failures

1. Check if all required files are present
2. Ensure pnpm-lock.yaml is up to date
3. Verify environment variables are set correctly

### Application Not Starting

1. Check Docker logs: `docker logs <container-name>`
2. Verify all required environment variables are set
3. Ensure database migrations completed successfully

## Deployment Options

### Kubernetes

Use the provided Kubernetes manifests in the `k8s/` directory:

```bash
kubectl apply -f k8s/
```

### Cloud Platforms

The Docker image can be deployed to:

- AWS ECS/Fargate
- Google Cloud Run
- Azure Container Instances
- DigitalOcean App Platform
- Any Docker-compatible hosting service

## Performance Optimization

For production deployments:

1. Use a multi-replica setup
2. Configure Redis for session storage
3. Use a managed PostgreSQL service
4. Enable CDN for static assets
5. Configure proper resource limits

## Monitoring

The application includes:

- Health check endpoint: `/api/health`
- OpenTelemetry instrumentation
- Application logs

Monitor these endpoints and metrics for production deployments.
