# Vehicle Service Pricing with the OpenAI Batch API

Two Python scripts that estimate GTA (Greater Toronto Area) service prices for vehicles using OpenAI's Batch API, then merge the results back into a CSV.

| Script | Purpose |
| --- | --- |
| `llm_pricer_optimized.py` | Reads a vehicle/service CSV, builds batch `.jsonl` request files, submits them to OpenAI, waits for completion, and downloads the results. |
| `MergeBatchFiles.py` | Combines batch input and output `.jsonl` files into a single flat CSV of pricing estimates. **Work in progress** (see [Known limitations](#known-limitations)). |

## How it works

```
Input CSV (e.g. Honda.csv)
        │
        ▼
llm_pricer_optimized.py
  1. Streams the CSV row by row
  2. Writes openai_batch_tasks_1.jsonl, _2.jsonl, ... (50k requests each)
  3. Uploads each file and creates a batch job (24h completion window)
  4. Polls every 60s; downloads results_<batch_id>.jsonl on completion
        │
        ▼
MergeBatchFiles.py
  Joins each request (by custom_id) with its response and writes a final CSV
```

Each request uses `gpt-4o-mini` at `temperature 0.0` with JSON-object output. The system prompt asks for a CAD estimate based on GTA labor rates ($110–$160/hr), assumes full synthetic oil for oil services, and requires `total_price = labor_cost + parts_cost` with `price_min`/`price_max` roughly ±10–15% around the total.

The OpenAI Batch API allows at most 50,000 requests per batch, so the script splits the input into 50k-row chunks. For example, a 238k-row file becomes 5 batch files (four of 50k and one of 38k).

## Requirements

- Python 3.9+
- An OpenAI API key with Batch API access

```bash
pip install openai python-dotenv pandas
```

Create a `.env` file in the working directory:

```
OPENAI_API_KEY=sk-...
```

`load_dotenv()` reads this at startup, and the `OpenAI()` client picks the key up automatically.

## Input CSV format

The CSV must include these columns (the header names are read exactly):

```
vehicle_id, make, model, year, trim, service_id, service_category, service_name,
region, estimation_status, estimation_method, manual_checked,
labor_cost, parts_cost, total_price, price_min, price_max
```

- `(vehicle_id, service_id)` must be a unique combination per row. It is used to build each request's `custom_id`.
- Empty numeric cost fields are treated as `0.0`.
- `manual_checked` is parsed as `True` for `true`, `1`, or `yes` (case-insensitive).

## Usage

### 1. Submit and download batches

```bash
python3 llm_pricer_optimized.py /path/to/Honda.csv
```

This will:

1. Create `openai_batch_tasks_N.jsonl` files in the current directory.
2. Upload each one and submit a batch job.
3. Print a submission summary with every batch ID.
4. Poll every 60 seconds until all batches finish.
5. Save completed output as `results_<batch_id>.jsonl`. If a batch fails, is cancelled, or expires, any error file is saved as `errors_<batch_id>.jsonl`.

Batches can take up to 24 hours, so leave the script running. If it is interrupted, the batches keep processing on OpenAI's side. You can retrieve results later using the batch IDs from your OpenAI dashboard.

### 2. Merge results into a CSV

```bash
python3 MergeBatchFiles.py
```

The input, output, and CSV file names are currently hardcoded at the bottom of the script:

```python
parse_batch_input_and_results(
    "batch_input.jsonl",     # one of the openai_batch_tasks_N.jsonl files
    "batch_output.jsonl",    # the matching results_<batch_id>.jsonl file
    "Honda_Detailed_Pricing_Complete.csv",
)
```

Edit these to point at a request file and its matching results file. Each call handles one pair of files.

## Request and response format

**Request line** (one per row in `openai_batch_tasks_N.jsonl`):

- `custom_id`: `task_<vehicle_id>_<service_id>`, used to match responses to rows
- `body.messages`: the system prompt plus a user prompt containing vehicle, region, service category, service name, and service ID

**Expected model response** (JSON):

```json
{
  "estimation_method": "market_average",
  "manual_checked": false,
  "labor_cost": 0.0,
  "parts_cost": 0.0,
  "total_price": 0.0,
  "price_min": 0.0,
  "price_max": 0.0
}
```

**Merged CSV columns:** `custom_id, year, make, model, service_category, service_name, estimation_method, manual_checked, labor_cost, parts_cost, total_price, price_min, price_max`

## Known limitations

These are worth knowing about before relying on the output.

**`MergeBatchFiles.py`**
- It is marked incomplete in its own TODO and processes only one input/output pair per run.
- File names are hardcoded rather than passed as arguments.
- It recovers vehicle details by re-parsing the prompt text. The `trim` is not parsed separately, so it ends up appended to `model` (e.g. `Civic (EX)`), and multi-word makes would be split incorrectly.
- `vehicle_id` and `service_id` are not output as their own columns, only inside `custom_id`.
- It does not write back into the original CSV's rows or columns. It produces a separate file.
- Responses are assumed to be valid JSON. A malformed response raises an error, and rows with no `choices` are silently skipped.

**`llm_pricer_optimized.py`**
- The batch file discovery uses `glob("openai_batch_tasks_*.jsonl")`, so leftover files from a previous run in the same folder will be uploaded again. Clear old files first or run from a fresh directory.
- The final "Done! Created ..." message only names the last batch file written.
- The batch description metadata is hardcoded to "Honda Service Estimation".
- The polling loop has no retry handling for transient API errors or a maximum wait time.
- The script does not validate that `total_price = labor_cost + parts_cost` in the responses. It is only requested in the prompt.
- The prices are LLM estimates, not quotes. They should be spot-checked before use.

## Suggested next steps

- Accept file paths as command-line arguments in `MergeBatchFiles.py`.
- Loop over all `results_*.jsonl` files and their matching request files, and write a single CSV.
- Split `custom_id` back into `vehicle_id` and `service_id` and join against the original CSV.
- Add a validation step for the price math and min/max ranges.
