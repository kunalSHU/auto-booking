#!/bin/bash

# Go to the script's parent directory (server/)
cd "$(dirname "$0")/.." || exit 1

# Load environment variables from .env
set -o allexport
source .env
set +o allexport

# Define the schema file path (relative to server/)
SCHEMA_FILE="db_schema/Postgres_Schema.sql"
CSV_FILE="${1:-db_schema/All Services(clean data).csv}"  # Default to the services CSV file

# Drop schema like tables, enums, etc., and resets the database schema
echo "Dropping existing schema..."
PGPASSWORD=$DB_PASSWORD psql -U "$DB_USER" -d "$DB_NAME" -c "DROP SCHEMA public CASCADE; CREATE SCHEMA public;"

# Apply the schema
echo "Creating new schema from $SCHEMA_FILE..."
PGPASSWORD=$DB_PASSWORD psql -U "$DB_USER" -d "$DB_NAME" -f "$SCHEMA_FILE"

# Load service data from CSV
echo "Loading service data from $CSV_FILE..."
if [ -f "$CSV_FILE" ]; then
  node db_schema/loadServices.js "$CSV_FILE"
else
  echo "Error: CSV file not found at $CSV_FILE"
  echo "Usage: ./schema_override.sh [optional: path-to-alternative-csv-file]"
  echo "Default: Uses db_schema/All Services(clean data).csv"
  exit 1
fi

echo "✓ Database setup complete!"