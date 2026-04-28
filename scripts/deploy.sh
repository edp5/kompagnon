#!/usr/bin/env bash
set -e

echo "Building web..."
npm --prefix web ci && npm --prefix web run build

echo "Building admin..."
npm --prefix admin ci && npm --prefix admin run build

echo "Building api..."
npm --prefix api ci

echo "Running migrations..."
npm --prefix api run db:migrate

# Empty the database before seeding
npm --prefix api run db:empty

# seed database for testing
npm --prefix api run db:seed
