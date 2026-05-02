#!/bin/bash

# Overnight script to fetch vehicle data and populate the master list
# Iterates through Years -> Makes -> Models -> Trims
# Requires: python, psql

# Fail if any command in a pipe fails
set -o pipefail

# Resolve directory of the script
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
ENV_FILE="$DIR/../.env"

# Load environment variables
if [ -f "$ENV_FILE" ]; then
    # Load variables, stripping carriage returns (CRLF support)
    export $(grep -v '^#' "$ENV_FILE" | sed 's/\r$//' | xargs)
fi

echo "--- Starting Comprehensive Vehicle Data Fetch ---"
echo "This script will iterate from 1990 to $(date +%Y) and populate the database."

# We move the pipe to the start of the here-doc to ensure EOF is isolated
python - <<'PYTHON_SCRIPT_END' | PGPASSWORD="$DB_PASSWORD" psql -h "${DB_HOST:-localhost}" -U "$DB_USER" -d "$DB_NAME" -p "${DB_PORT:-5432}"
import json
import sys
import os
import time
import urllib.request
from urllib.error import HTTPError

API_BASE = "https://carsapi-7lpja5voja-uc.a.run.app/cars"
START_YEAR = 1990
END_YEAR = int(time.strftime("%Y")) + 1

def fetch_data(url):
    for attempt in range(3):
        try:
            req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
            with urllib.request.urlopen(req, timeout=10) as response:
                if response.status == 200:
                    return json.loads(response.read().decode('utf-8'))
        except HTTPError as e:
            if e.code == 404:
                return None
            print(f"-- HTTP Error {e.code} for {url}. Retrying...", file=sys.stderr)
        except Exception as e:
            print(f"-- Request failed: {e}. Retrying...", file=sys.stderr)
        time.sleep(1)
    return None

def main():
    # Iterate through years
    for year in range(END_YEAR, START_YEAR - 1, -1):
        print(f"-> Processing Year: {year}", file=sys.stderr)
        makes_data = fetch_data(f"{API_BASE}/makes?year={year}")
        if not makes_data or 'makes' not in makes_data:
            continue
            
        for make in makes_data['makes']:
            print(f"   -> {year} {make}", file=sys.stderr)
            models_data = fetch_data(f"{API_BASE}/models?year={year}&make={make.replace(' ', '%20')}")
            if not models_data or 'models' not in models_data:
                continue
                
            for model in models_data['models']:
                safe_model_url = str(model).replace(' ', '%20')
                trims_data = fetch_data(f"{API_BASE}/trims-copy?year={year}&make={make.replace(' ', '%20')}&model={safe_model_url}")
                
                # Use a default empty trim if none found
                trims = trims_data.get('trims', []) if trims_data else []
                if not trims:
                    trims = ['']
                
                for trim in trims:
                    trim_name = trim if isinstance(trim, str) else trim.get('model_trim', '')
                    # Escape single quotes for SQL
                    safe_make = str(make).replace("'", "''")
                    safe_model = str(model).replace("'", "''")
                    safe_trim = str(trim_name).replace("'", "''")
                    
                    print(f"INSERT INTO \"Vehicles\" (make, model, year, trim) VALUES ('{safe_make}', '{safe_model}', {year}, '{safe_trim}') ON CONFLICT (make, model, year, trim) DO NOTHING;")
            
            # Small sleep to be nice to the API
            time.sleep(0.05)

if __name__ == "__main__":
    main()
PYTHON_SCRIPT_END

if [ $? -eq 0 ]; then
    echo "--- Fetch and Population Complete ---"
else
    echo "--- Fetch Failed (Check for Python or Database errors above) ---"
    exit 1
fi
