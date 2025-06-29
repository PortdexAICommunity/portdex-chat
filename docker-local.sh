#!/bin/bash

# Docker Compose helper script for local development
# Usage: ./docker-local.sh [command]

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Helper function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if Docker and Docker Compose are installed
check_requirements() {
    if ! command -v docker &> /dev/null; then
        print_error "Docker is not installed. Please install Docker first."
        exit 1
    fi
    
    if ! command -v docker-compose &> /dev/null; then
        print_error "Docker Compose is not installed. Please install Docker Compose first."
        exit 1
    fi
}

# Create .env.local file if it doesn't exist
create_env_file() {
    if [ ! -f .env.local ]; then
        print_warning ".env.local file not found. Creating a basic one..."
        cat > .env.local << EOL
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
EOL
        print_status "Created .env.local file. Please update it with your configuration."
    fi
}

# Main commands
case "$1" in
    "up"|"start")
        print_status "Starting services for local development..."
        check_requirements
        create_env_file
        docker-compose up -d
        print_status "Services started! Visit http://localhost:3000"
        print_status "pgAdmin available at http://localhost:5050 (admin@portdex.ai / admin)"
        ;;
    
    "dev")
        print_status "Starting services in development mode with hot reload..."
        check_requirements
        create_env_file
        docker-compose -f docker-compose.yml -f docker-compose.dev.yml up
        ;;
    
    "down"|"stop")
        print_status "Stopping all services..."
        docker-compose down
        ;;
    
    "restart")
        print_status "Restarting services..."
        docker-compose restart
        ;;
    
    "logs")
        if [ -z "$2" ]; then
            docker-compose logs -f
        else
            docker-compose logs -f "$2"
        fi
        ;;
    
    "migrate")
        print_status "Running database migrations..."
        docker-compose run --rm migrate
        ;;
    
    "db:reset")
        print_warning "This will delete all data in the database!"
        read -p "Are you sure? (y/N) " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            docker-compose down -v
            docker-compose up -d postgres redis
            sleep 5
            docker-compose run --rm migrate
            print_status "Database reset complete."
        fi
        ;;
    
    "shell")
        if [ -z "$2" ]; then
            docker-compose exec app sh
        else
            docker-compose exec "$2" sh
        fi
        ;;
    
    "build")
        print_status "Building Docker images..."
        docker-compose build
        ;;
    
    "clean")
        print_warning "This will remove all containers, networks, and volumes!"
        read -p "Are you sure? (y/N) " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            docker-compose down -v --remove-orphans
            docker system prune -f
            print_status "Cleanup complete."
        fi
        ;;
    
    "status")
        docker-compose ps
        ;;
    
    *)
        echo "Usage: $0 {up|dev|down|restart|logs|migrate|db:reset|shell|build|clean|status}"
        echo ""
        echo "Commands:"
        echo "  up        - Start services in background"
        echo "  dev       - Start services in development mode with hot reload"
        echo "  down      - Stop all services"
        echo "  restart   - Restart all services"
        echo "  logs      - Show logs (optionally specify service name)"
        echo "  migrate   - Run database migrations"
        echo "  db:reset  - Reset database (WARNING: deletes all data)"
        echo "  shell     - Open shell in app container (or specify service name)"
        echo "  build     - Build Docker images"
        echo "  clean     - Remove all containers and volumes (WARNING: deletes all data)"
        echo "  status    - Show container status"
        echo ""
        echo "Examples:"
        echo "  $0 up           # Start all services"
        echo "  $0 logs app     # Show app logs"
        echo "  $0 shell postgres # Open shell in postgres container"
        exit 1
        ;;
esac 