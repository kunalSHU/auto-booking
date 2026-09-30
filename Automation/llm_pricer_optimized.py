from dataclasses import dataclass
from sys import argv
from openai import OpenAI
import glob
from dotenv import load_dotenv
import time
import csv
import json  # Added to generate JSONL files

## ---- TO RUN THIS SCRIPT ------ ##
## python3 llm_pricer_optimized.py /Users/kunalshukla/Downloads/Honda.csv ##

# Reads the .env file and sets OPENAI_API_KEY in process memory
load_dotenv()

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
    file_start = 1
    vehicle_bucket = [] # 50k vehicles will be stored in this bucket
    with open(file, encoding="utf-8") as f:
        reader = csv.DictReader(f)
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
            vehicle_bucket.append(vehicle_record)

            # Write to the batch file
            if len(vehicle_bucket) % 50000 == 0:
                print(f"Processed {len(vehicle_bucket)} records")

                # Execute tasks in parallel and allows for efficiency
                # Using jsonl files since they are ideal for streaming millions of records if needed, uses low memory unlike regular json
                # Note the batch api allows for only 50k rows per request so divide the file into buckets of 50k
                batch_file_path = f"openai_batch_tasks_{file_start}.jsonl"
                prepare_batch_jsonl_files(vehicle_bucket, batch_file_path)
                vehicle_bucket = []
                file_start += 1

        # For the remainder.
        if vehicle_bucket:
            print(f"Processed {len(vehicle_bucket)} records")
            batch_file_path = f"openai_batch_tasks_{file_start}.jsonl"
            prepare_batch_jsonl_files(vehicle_bucket, batch_file_path)


    print(f"Done! Created '{batch_file_path}' ready for upload to OpenAI.")

    # Create the OpenAI client
    client = OpenAI()

    # Find all batch files matching your naming pattern and sort them numerically
    batch_file_paths = sorted(
        glob.glob("openai_batch_tasks_*.jsonl"),
        key=lambda x: int(x.split("_")[-1].split(".")[0])  # Ensures 1, 2, 3... order
    )
    created_batches = []
    print(f"Found {len(batch_file_paths)} batch file(s) to process.\n")

    for file_path in batch_file_paths:
        print(f"Uploading '{file_path}' to OpenAI...")

        # 1. Upload the JSONL batch file
        with open(file_path, mode="rb") as file_stream:
            batch_input_file = client.files.create(
                file=file_stream,
                purpose="batch"
            )

        print(f"File uploaded successfully. File ID: {batch_input_file.id}")

        # 2. Create the Batch request job which contains our input file as the input file id
        batch_job = client.batches.create(
            input_file_id=batch_input_file.id,
            endpoint="/v1/chat/completions",
            completion_window="24h",
            metadata={"file": file_path, "description": f"Honda Service Estimation - {file_path}"}
        )

        print(f"Batch submitted! Batch ID: {batch_job.id} | Status: {batch_job.status}\n")
        created_batches.append(batch_job)


    # Output summary of all submitted batch IDs
    print("--- Submission Summary ---")
    for batch in created_batches:
        print(f"File: {batch.metadata.get('file')} | Batch ID: {batch.id} | Status: {batch.status}")

    submitted_batch_ids = [batch.id for batch in created_batches]
    wait_and_download_results(client, submitted_batch_ids)

def wait_and_download_results(client, batch_ids):
    print("\nStarting status listener for submitted batches...")
    pending_ids = set(batch_ids)

    while pending_ids:
        for b_id in list(pending_ids):
            batch = client.batches.retrieve(b_id)
            print(f"Batch {b_id} status: {batch.status}")

            if batch.status == "completed":
                print(f"Batch {b_id} finished! Fetching results from OpenAI...")
                # Download raw output content from OpenAI Cloud
                content = client.files.content(batch.output_file_id).text

                # Save locally on your machine
                local_result_file = f"results_{b_id}.jsonl"
                with open(local_result_file, "w", encoding="utf-8") as f:
                    f.write(content)

                print(f"Saved results to '{local_result_file}' locally.")
                pending_ids.remove(b_id)

            elif batch.status in ("failed", "cancelled", "expired"):
                print(f"Batch {b_id} ended with status: {batch.status}")
                if batch.error_file_id:
                    err_content = client.files.content(batch.error_file_id).text
                    with open(f"errors_{b_id}.jsonl", "w", encoding="utf-8") as f:
                        f.write(err_content)
                pending_ids.remove(b_id)

        if pending_ids:
            print(f"\n{len(pending_ids)} batch(es) still processing. Waiting 60 seconds before next check...\n")
            time.sleep(60)

    print("\nAll batch processing and file downloads completed!")

def prepare_batch_jsonl_files(vehicle_bucket, batch_file_path):
    # with open keeps writing efficient as well (using streams) can write millions of records in seconds with no memory overhead
    with open(batch_file_path, mode="w", encoding="utf-8") as out_f:
        for vehicle_record in vehicle_bucket:
            # Create a unique custom ID for every row so you can map results back later
            custom_id = f"task_{vehicle_record.vehicle_id}_{vehicle_record.service_id}"

            # Construct the dynamic vehicle & service prompt
            user_prompt = (
                f"Vehicle: {vehicle_record.year} {vehicle_record.make} {vehicle_record.model} ({vehicle_record.trim})\n"
                f"Region: {vehicle_record.region}\n"
                f"Service Category: {vehicle_record.service_category}\n"
                f"Service Name: {vehicle_record.service_name}\n"
                f"Service ID: {vehicle_record.service_id}"
            )

            # Construct the exact schema OpenAI demands for a batch request
            batch_line = {
                "custom_id": custom_id,
                "method": "POST",
                "url": "/v1/chat/completions",
                "body": {
                    "model": "gpt-4o-mini",
                    "messages": [
                        {"role": "system", "content": JSON_PROMPT_SYSTEM},
                        {"role": "user", "content": user_prompt}
                    ],
                    "temperature": 0.0,
                    "response_format": {"type": "json_object"}
                }
            }

            # Write as a single line of JSON text
            out_f.write(json.dumps(batch_line) + "\n")

        print("Length of vehicle bucket: ", len(vehicle_bucket))

if __name__ == "__main__":
    if len(argv) < 2:
        print("Please provide a file name")
    else:
        main(argv[1])
