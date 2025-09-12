#!/bin/zsh
set -e

echo "==========="
echo "Configuring the environment for the project..."

# Install all dependencies
echo "Installing dependencies..."
npm ci || { echo "Error installing npm ci dependencies"; exit 1; }

# Root-level environment variable
echo "Setting up root-level environment variables..."
cp ./sample.env ./.env || { echo "Error copying environment file"; exit 1; }

# docker
echo "Starting Docker"
docker compose up -d || { echo "Error starting Docker"; exit 1; }

# database
echo "Creating database..."
npm run db:reset || { echo "Error resetting the database"; exit 1; }


# end
echo "Configuration complete."
