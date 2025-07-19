#!/bin/bash

# Go to the script's parent directory (server/)
cd "$(dirname "$0")/.." || exit 1

# Load environment variables from .env
set -o allexport
source .env
set +o allexport

# Define the schema file path (relative to server/)
SCHEMA_FILE="db_schema/Postgres_Schema.sql"
DATA_FILE="db_schema/services_test.txt"
INSERT_FILE="db_schema/service_inserts.sql"   #This is where the insert records will be put - if some bad data gets in, we know where our script went wrong

# Drop schema like tables, enums, etc., and resets the database schema
PGPASSWORD=$DB_PASSWORD psql -U "$DB_USER" -d "$DB_NAME" -c "DROP SCHEMA public CASCADE; CREATE SCHEMA public;"
PGPASSWORD=$DB_PASSWORD psql -U "$DB_USER" -d "$DB_NAME" -f "$SCHEMA_FILE" # Apply the schema


# Let's load our data into Services table
echo "Generating SQL insert statements from $DATA_FILE..."

awk -F'\t' '
BEGIN {
    OFS = "\t";
    print "-- Generated SQL insert statements" > "'"$INSERT_FILE"'"
}

NR == 1 { next }  # skip header

# Detect category row (name is filled, others are empty)
$1 != "" && $2 == "" && $3 == "" && $4 == "" && $5 == "" && $6 == "" {
    category = $1;
    next;
}

# Skip empty rows
$1 == "" { next }

{
    name = escape($1);
    est_time = convertRange($2);
    tools = escape($3);
    difficulty = normalizeDifficulty($4);
    cost = convertCost($5);
    service_id = escape($6);

    if (name == "" || service_id == "") next;

    print "INSERT INTO \"Services\" (service_id, category, name, estimated_time, tools_required, difficulty, avg_cost, created_at) VALUES (" \
        "\047" service_id "\047, " \
        "\047" category "\047, " \
        "\047" name "\047, " \
        "\047" est_time "\047::int4range, " \
        "\047" tools "\047, " \
        "\047" difficulty "\047::service_difficulty_enum, " \
        "\047" cost "\047::numrange, " \
        "NOW());" >> "'"$INSERT_FILE"'"
}

function escape(str) {
    gsub("\047", "\047\047", str);  # escape single quotes
    return str;
}

function convertRange(time, arr, cleaned) {
    gsub(/[^0-9\-]/, "-", time);
    split(time, arr, "-");
    return "[" arr[1] "," arr[2] "]";
}

function convertCost(cost, arr, cleaned) {
    gsub(/[^0-9\-\$]/, "-", cost);
    gsub(/\$/, "", cost);
    split(cost, arr, "-");
    if (arr[1] == "" || arr[2] == "") return "[0,0]";
    return "[" arr[1] "," arr[2] "]";
}

function normalizeDifficulty(diff) {
    tolower(diff);
    if (diff ~ /easy/) return "easy";
    if (diff ~ /moderate/) return "medium";
    if (diff ~ /medium/) return "medium";
    if (diff ~ /hard/ || diff ~ /difficult/) return "hard";
    return "medium";  # default fallback
}
' "$DATA_FILE"

# Run the insert SQL statements in $INSERT_FILE(service_inserts.txt)
echo "Inserting service data into the database..."
PGPASSWORD=$DB_PASSWORD psql -U "$DB_USER" -d "$DB_NAME" -f "$INSERT_FILE"

echo "Schema and data load complete."