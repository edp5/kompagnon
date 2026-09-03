#!/bin/sh
set -e

echo "Running database migrations..."
npm --prefix api run db:migrate

echo "Starting application..."
exec "$@"
