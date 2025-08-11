#!/bin/bash

# Create storage directories if they don't exist
mkdir -p storage/logs
mkdir -p storage/framework/cache
mkdir -p storage/framework/sessions
mkdir -p storage/framework/views
mkdir -p bootstrap/cache

# Set proper permissions
chmod -R 755 storage
chmod -R 755 bootstrap/cache

# Create SQLite database if it doesn't exist
touch database/database.sqlite

# Run migrations
php artisan migrate --force

# Clear and cache config
php artisan config:cache
php artisan route:cache
php artisan view:cache

echo "Laravel setup complete"