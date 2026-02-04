#!/bin/sh
# Entrypoint script to start the Next.js app, ensuring env vars are loaded at runtime

# Print all environment variables for debugging (optional, remove if not needed)
# printenv

exec "$@"
