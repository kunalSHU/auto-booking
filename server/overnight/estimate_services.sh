#!/bin/bash

# Overnight script to fetch AI CAD estimates for automotive services
# Focuses on GTA, Ontario region
# Requires: python, psql

# Fail if any command in a pipe fails
set -o pipefail

# Resolve directory of the script
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
# Root .env is two levels up from server/overnight
ENV_FILE="$DIR/../../.env"

# Load environment variables robustly
if [ -f "$ENV_FILE" ]; then
    echo "--- Loading environment from $ENV_FILE ---"
    while IFS= read -r line || [ -n "$line" ]; do
        # Strip carriage returns and leading/trailing whitespace
        clean_line=$(echo "$line" | sed 's/\r$//' | sed -e 's/^[[:space:]]*//' -e 's/[[:space:]]*$//')
        
        # Skip comments and empty lines
        [[ "$clean_line" =~ ^#.*$ ]] && continue
        [[ -z "$clean_line" ]] && continue
        
        # Export the variable
        export "$clean_line"
    done < "$ENV_FILE"
else
    echo "Warning: .env file not found at $ENV_FILE"
fi

if [ -z "$PERPLEXITY_API_KEY" ]; then
    echo "Error: PERPLEXITY_API_KEY not found in environment."
    exit 1
fi

# Set defaults if not provided in .env
DB_HOST="${DB_HOST:-localhost}"
DB_PORT="${DB_PORT:-5432}"
DB_USER="${DB_USER:-postgres}"
DB_NAME="${DB_NAME:-AutoMobile}"

echo "--- Starting Incremental AI Service Estimation (GTA) ---"
echo "Identifying 5 vehicles with missing estimates..."

# We move the pipe to the start of the here-doc to ensure EOF is isolated
python - <<'PYTHON_SCRIPT_END' | PGPASSWORD="$DB_PASSWORD" psql -h "$DB_HOST" -U "$DB_USER" -d "$DB_NAME" -p "$DB_PORT"
import json
import sys
import os
import time
import urllib.request
import subprocess

# Config
REGION = "Ontario, Canada"
GTA_CONTEXT = "Greater Toronto Area (Toronto/Mississauga/Brampton)"
API_KEY = os.environ.get('PERPLEXITY_API_KEY')

def run_query(sql):
    db_host = os.environ.get('DB_HOST', 'localhost')
    db_user = os.environ.get('DB_USER', 'postgres')
    db_name = os.environ.get('DB_NAME', 'AutoMobile')
    db_port = os.environ.get('DB_PORT', '5432')
    db_pass = os.environ.get('DB_PASSWORD', '')
    
    cmd = ["psql", "-h", db_host, "-U", db_user, "-d", db_name, "-p", db_port, "-t", "-c", sql]
    
    env = os.environ.copy()
    env["PGPASSWORD"] = db_pass
    
    # We use subprocess.run and specifically check for errors
    result = subprocess.run(cmd, capture_output=True, text=True, env=env)
    if result.returncode != 0:
        print(f"SQL Error: {result.stderr}", file=sys.stderr)
        return None
    return result.stdout.strip()

def fetch_bulk_ai(year, make, model, trim, services):
    url = "https://api.perplexity.ai/chat/completions"
    service_list = ", ".join(services)
    prompt = f"""You are an automotive service pricing expert for the {GTA_CONTEXT}, Ontario, Canada.
Vehicle: {year} {make} {model} {trim}
Services to estimate: {service_list}

INSTRUCTIONS:
1. Search the internet for real-time, reliable pricing data from reputable Canadian automotive sources.
2. Provide realistic CAD cost estimates considering the GTA market.
3. Base decisions ONLY on reliable web sources.

Return ONLY a JSON array of objects:
[
  {{
    "service_name": "exact name from list",
    "labor_cost": 120.00,
    "parts_cost": 50.00,
    "price_min": 150.00,
    "price_max": 190.00
  }}
]
NO markdown, NO preamble."""

    data = json.dumps({
        "model": "sonar-pro",
        "messages": [
            {"role": "system", "content": "Factual automotive pricing expert. Return ONLY valid JSON."},
            {"role": "user", "content": prompt}
        ],
        "temperature": 0,
        "max_tokens": 3000
    }).encode('utf-8')

    req = urllib.request.Request(url, data=data, headers={
        "Authorization": f"Bearer {API_KEY}",
        "Content-Type": "application/json"
    })

    try:
        with urllib.request.urlopen(req, timeout=60) as response:
            res_data = json.loads(response.read().decode('utf-8'))
            content = res_data['choices'][0]['message']['content'].strip()
            # Robust JSON cleaning
            if "```json" in content:
                content = content.split("```json")[1].split("```")[0].strip()
            elif "```" in content:
                content = content.split("```")[1].split("```")[0].strip()
            return json.loads(content)
    except Exception as e:
        print(f"AI Fetch Error: {e}", file=sys.stderr)
        return None

def main():
    # 1. Get 5 vehicles with fewest estimates
    vehicles_raw = run_query("""
        SELECT v.vehicle_id, v.make, v.model, v.year, COALESCE(v.trim, '') 
        FROM \"Vehicles\" v
        CROSS JOIN (SELECT count(*) as total_active FROM \"Services\" WHERE service_active = true) s
        LEFT JOIN \"ServiceEstimates\" se ON v.vehicle_id = se.vehicle_id AND se.region = 'Ontario, Canada'
        GROUP BY v.vehicle_id, v.make, v.model, v.year, v.trim, s.total_active
        HAVING count(se.estimate_id) < s.total_active
        ORDER BY v.year DESC, v.make ASC, v.model ASC, v.trim ASC
        LIMIT 5;
    """)
    
    if not vehicles_raw:
        print("No vehicles found to process.")
        return

    vehicles = []
    for line in vehicles_raw.split('\n'):
        line = line.strip()
        if not line: continue
        parts = [x.strip() for x in line.split('|')] if '|' in line else line.split()
        if len(parts) >= 4:
            # vehicle_id, make, model, year, trim
            trim_val = " ".join(parts[4:]) if len(parts) > 4 else ""
            vehicles.append([parts[0], parts[1], parts[2], parts[3], trim_val])

    # 2. Get active services map
    services_raw = run_query("SELECT service_id, name FROM \"Services\" WHERE service_active = true;")
    services_map = {}
    if services_raw:
        for line in services_raw.split('\n'):
            line = line.strip()
            if not line: continue
            parts = [x.strip() for x in line.split('|')] if '|' in line else line.split()
            if len(parts) >= 2:
                # name -> id
                s_name = " ".join(parts[1:])
                services_map[s_name.lower()] = parts[0]

    for vid, make, model, year, trim in vehicles:
        print(f"-> Processing: {year} {make} {model} {trim} ({vid})", file=sys.stderr)
        
        # Get missing services for this vehicle
        missing_sql = f"""
            SELECT s.name FROM \"Services\" s
            LEFT JOIN \"ServiceEstimates\" se ON s.service_id = se.service_id 
              AND se.vehicle_id = {vid} AND se.region = '{REGION}'
            WHERE s.service_active = true AND se.estimate_id IS NULL;
        """
        missing_res = run_query(missing_sql)
        if not missing_res:
            print(f"   No missing services for {vid}", file=sys.stderr)
            continue
            
        missing_names = [x.strip() for x in missing_res.split('\n') if x.strip()]
        
        # Batch by 10
        for i in range(0, len(missing_names), 10):
            batch = missing_names[i:i+10]
            print(f"   Gathering {len(batch)} estimates...", file=sys.stderr)
            results = fetch_bulk_ai(year, make, model, trim, batch)
            
            if results and isinstance(results, list):
                for res in results:
                    s_name = str(res.get('service_name', '')).lower()
                    sid = services_map.get(s_name)
                    
                    if sid:
                        labor = res.get('labor_cost', 0)
                        parts = res.get('parts_cost', 0)
                        p_min = res.get('price_min', 0)
                        p_max = res.get('price_max', 0)
                        total = labor + parts
                        
                        sql = f"""
                        INSERT INTO \"ServiceEstimates\" 
                          (service_id, vehicle_id, region, labor_cost, parts_cost, price_min, price_max, total_price, updated_at)
                        VALUES ({sid}, {vid}, '{REGION}', {labor}, {parts}, {p_min}, {p_max}, {total}, NOW())
                        ON CONFLICT (vehicle_id, service_id, region) DO UPDATE SET
                          labor_cost = EXCLUDED.labor_cost, parts_cost = EXCLUDED.parts_cost,
                          price_min = EXCLUDED.price_min, price_max = EXCLUDED.price_max,
                          total_price = EXCLUDED.total_price, updated_at = NOW()
                        WHERE \"ServiceEstimates\".manual_checked = false;
                        """
                        print(sql)
            time.sleep(1) # Rate limit safety

if __name__ == "__main__":
    main()
PYTHON_SCRIPT_END

echo "--- Estimation Batch Complete ---"
