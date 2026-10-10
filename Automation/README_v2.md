# LLM Service Pricer

Generates OpenAI Batch API payloads from a vehicle/service file (`.csv`, `.xlsx`, `.xlsm`), submits them, then validates the results and merges them back into a CSV.

## Setup

- Python 3.9+
- `pip install openai python-dotenv openpyxl`
- A `.env` file in the directory you run from:

```
OPENAI_API_KEY=sk-...
```

## Required input columns

`vehicle_id, make, model, year, trim, service_id, service_category, service_name, region, estimation_status, estimation_method, manual_checked, labor_cost, parts_cost, total_price, price_min, price_max`

Rows missing `vehicle_id` or `service_id` are skipped. Duplicate `(vehicle_id, service_id)` pairs are dropped.

## Flags

| Flag | Description |
|---|---|
| `file` (positional) | Input `.csv` / `.xlsx` / `.xlsm`. |
| *(no flags)* | Generate `.jsonl` payloads only. No API calls. |
| `--submit` | Upload payloads to OpenAI, wait for completion, then merge. |
| `--no-wait` | With `--submit`: submit and exit. With `--retrieve`: check once and exit if still running. |
| `--retrieve` | Download results of already-submitted batches, then merge. |
| `--merge` | Validate and merge results already downloaded. No API calls. |
| `--max-requests N` | Only write the first N requests. Use for test runs. |
| `--services-per-request N` | Max services per request (default `50`). |
| `--resubmit` | Allow a new run after batches were already submitted. The old manifest is backed up. |
| `--output-dir PATH` | Output folder (default `./<input_stem>_batches`). |

## Commands

```bash
# 1. Generate payloads only (inspect the .jsonl, nothing is sent)
python llm_pricer_optimized.py Toyota.xlsx

# 2. Small test: 2 requests, submit, don't wait
python llm_pricer_optimized.py Toyota.xlsx --max-requests 2 --submit --no-wait

# 3. Later: download results + merge
python llm_pricer_optimized.py Toyota.xlsx --retrieve

# 4. Full run, submit and wait until done (use --resubmit if a test was already submitted)
python llm_pricer_optimized.py Toyota.xlsx --submit

# 5. Full run, submit and exit; retrieve later
python llm_pricer_optimized.py Toyota.xlsx --submit --no-wait

# 6. Re-validate already-downloaded results (free, instant)
python llm_pricer_optimized.py Toyota.xlsx --merge

# 7. Re-estimate rows that failed validation or were missing
python llm_pricer_optimized.py Toyota_batches/Toyota_retry.csv --submit
```

Windows venv example:

```bash
./.venv/Scripts/python.exe Automation/llm_pricer_optimized.py Automation/Toyota.xlsx --max-requests 2 --submit --no-wait
```

## Output files

Written to `./<input_stem>_batches/`:

| File | Purpose |
|---|---|
| `<stem>_batch_N.jsonl` | Request payloads uploaded to OpenAI (max 50,000 requests / 190 MB per file). |
| `manifest.json` | Local record of batch IDs. Never sent to OpenAI. Needed for `--retrieve` / `--merge`. |
| `results_<batch_id>.jsonl` | Raw OpenAI output. |
| `errors_<batch_id>.jsonl` | Per-request errors, if any. |
| `<stem>_estimated.csv` | All input rows. Estimate columns are filled only for valid rows. |
| `<stem>_retry.csv` | Rows that were missing or invalid. Use it as a new input. |

## How it works

- Requests are grouped **per vehicle**, up to `--services-per-request` services each.
- `custom_id` = `v<vehicle_id>_c<chunk_number>`, for example `v123_c0`.
- Only these columns are filled in: `estimation_method`, `manual_checked`, `labor_cost`, `parts_cost`, `total_price`, `price_min`, `price_max`.
- Validation on merge:
  - values must be numeric and non-negative
  - `price_min <= total_price <= price_max`
  - if `total_price != labor_cost + parts_cost`, it is reset to the sum
  - duplicate or invalid estimates are dropped and go to the retry file

## Notes

- The Batch API model (`gpt-4o-mini`) cannot browse the web, so prices come from model knowledge. Spot-check a sample before a full run.
- Prices are in CAD, before HST. Services that do not apply to a vehicle are returned as `0`.
- After `--max-requests` test runs, nearly every row appears in the retry file. That is expected.
- To change the model, edit `MODEL` at the top of the script.