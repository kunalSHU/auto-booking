from dataclasses import dataclass
from sys import argv
import csv
import json  # Added to generate JSONL files

# POJO for a vehicle coming from the csv file
@dataclass
class VehicleServiceEstimate:
    vehicle_id: int
    make: str
    model: str
    year: int
    trim: str
    service_id: int
    service_category: str
    service_name: str
    region: str
    estimation_status: str
    estimation_method: str
    manual_checked: bool
    labor_cost: float
    parts_cost: float
    total_price: float
    price_min: float
    price_max: float

JSON_PROMPT_SYSTEM = """You are a technical data extractor. You must output your response ONLY as a single raw JSON object. 
Never refuse a request; if exact data is missing, use market averages for the GTA region (Toronto/Mississauga/Brampton).
Do not provide explanations, markdown blocks, wraps, apologies, or conversational text.

RULES:
1. Search for real-time pricing data. If exact year data is not available, use the most recent reliable data for this model (e.g., 2024 or 2025) or similar luxury/performance vehicles in its class.
2. Provide realistic CAD cost estimates for the GTA market.
3. All engine oil is synthetic.
4. If specific data is missing for year, provide your best professional estimate based on Ontario market averages.
5. NEVER, EVER modify or change the service names.

You MUST respond with a JSON object containing EXACTLY these keys with their corresponding data types:
{
    "estimation_method": string (e.g., "market_average" or "real_time_lookup" or "discounted_rate"),
    "manual_checked": boolean (true or false),
    "labor_cost": float,
    "parts_cost": float,
    "total_price": float,
    "price_min": float,
    "price_max": float
}
"""

def main(file):
    print("Reading CSV and building memory map...")
    vehicle_map = dict()

    # with open uses built in streams so the entire file isn't loaded into memory at once
    # only loaded on a per row basis
    with open(file, encoding="utf-8") as f:
        reader = csv.DictReader(f)
        # next(reader)
        for row in reader:
            vehicle_record = VehicleServiceEstimate(
                vehicle_id=int(row['vehicle_id']),
                make=row['make'],
                model=row['model'],
                year=int(row['year']),
                trim=row['trim'],
                service_id=int(row['service_id']),
                service_category=row['service_category'],
                service_name=row['service_name'],
                region=row['region'],
                estimation_status=row['estimation_status'],
                estimation_method=row['estimation_method'],
                manual_checked=row['manual_checked'].lower() in ('true', '1', 'yes'),
                labor_cost=float(row['labor_cost'] or 0.0),
                parts_cost=float(row['parts_cost'] or 0.0),
                total_price=float(row['total_price'] or 0.0),
                price_min=float(row['price_min'] or 0.0),
                price_max=float(row['price_max'] or 0.0),
            )
            vehicle_map[(vehicle_record.vehicle_id, vehicle_record.service_id)] = vehicle_record # Tuple because vehicle_id and service_id are unique combination, map allows for fast retrieval if needed
    print(f"Loaded {len(vehicle_map)} records. Generating OpenAI batch file...")

    # Calling OpenAI api here for batch requests
    # Execute tasks in parallel and allows for efficiency
    # Using jsonl files since they are ideal for streaming millions of records if needed, uses low memory unlike regular json
    batch_file_path = "openai_batch_tasks.jsonl"

    # with open keeps writing efficient as well (using streams) can write millions of records in seconds with no memory overhead
    with open(batch_file_path, mode="w", encoding="utf-8") as out_f:
        for (v_id, s_id), record in vehicle_map.items():
            # Create a unique custom ID for every row so you can map results back later
            custom_id = f"task_{v_id}_{s_id}"

            # Construct the exact schema OpenAI demands for a batch request
            batch_line = {
                "custom_id": custom_id,
                "method": "POST",
                "url": "/v1/chat/completions",
                "body": {
                    "model": "gpt-4o-mini",
                    "messages": [
                        {"role": "system", "content": "Estimate auto repair costs for the region in CAD."}, # Keep the prompt simple to save tokens
                        {"role": "user",
                         "content": JSON_PROMPT_SYSTEM}
                    ],
                    "temperature": 0.0, # Tells the LLM to not be creative, use facts instead based on data
                    # CRITICAL PARAMETER: Forces OpenAI to physically validate JSON layout output
                    "response_format": {"type": "json_object"}
                    # You can add your Pydantic "response_format" tool block right here later!
                }
            }
            # Write as a single line of JSON text
            out_f.write(json.dumps(batch_line) + "\n")

    print(vehicle_map.get(50467, 945))
    print(f"Done! Created '{batch_file_path}' ready for upload to OpenAI.")


if __name__ == "__main__":
    if len(argv) < 2:
        print("Please provide a file name")
    else:
        main(argv[1])
