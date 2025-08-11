#!/bin/bash

# Import production database from SQL dump
echo "Importing database from SQL dump..."

# Remove existing database if it exists
rm -f database/database.sqlite

# Import from SQL dump
sqlite3 database/database.sqlite < database/production_export.sql

echo "Database imported successfully!"