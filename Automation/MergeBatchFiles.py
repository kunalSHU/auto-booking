import json
import pandas as pd

# TODO: This is not complete yet, once OpenAI returns us the data it will come in batches
# For example, our 238k csv file for honda will be split in 5 jsonl files, each will contain 50k vehicles
# since OpenAI batch api has a limit of 50k requests per batch. 238k / 50k = 5 files (note last file will have 38k vehicles
# due to the remainder. That logic is in llm_pricer_optimized.py.
# The purpose of this script is to look at the jsonl files which are returned and map them to the csv file vehicleid + serviceId
# since this is a unique identifier
def parse_batch_input_and_results(input_jsonl, output_jsonl, final_csv):
    # 1. Parse prompt strings from input JSONL
    metadata = {}
    with open(input_jsonl, "r", encoding="utf-8") as f:
        for line in f:
            if not line.strip():
                continue
            item = json.loads(line)
            cid = item.get("custom_id")

            messages = item.get("body", {}).get("messages", [])
            user_content = next(
                (m["content"] for m in messages if m.get("role") == "user"), ""
            )

            meta = {
                "year": "",
                "make": "",
                "model": "",
                "service_category": "",
                "service_name": "",
            }

            for p_line in user_content.split("\n"):
                if p_line.startswith("Vehicle:"):
                    v_str = p_line.replace("Vehicle:", "").strip()
                    v_parts = v_str.split()
                    meta["year"] = (
                        v_parts[0]
                        if len(v_parts) > 0 and v_parts[0].isdigit()
                        else ""
                    )
                    meta["make"] = v_parts[1] if len(v_parts) > 1 else ""
                    meta["model"] = (
                        " ".join(v_parts[2:]) if len(v_parts) > 2 else ""
                    )
                elif p_line.startswith("Service Name:"):
                    meta["service_name"] = p_line.replace(
                        "Service Name:", ""
                    ).strip()
                elif p_line.startswith("Service Category:"):
                    meta["service_category"] = p_line.replace(
                        "Service Category:", ""
                    ).strip()

            metadata[cid] = meta

    # 2. Combine with batch results
    records = []
    with open(output_jsonl, "r", encoding="utf-8") as f:
        for line in f:
            if not line.strip():
                continue
            item = json.loads(line)
            cid = item.get("custom_id")
            meta = metadata.get(cid, {})

            choices = (
                item.get("response", {}).get("body", {}).get("choices", [])
            )
            if choices:
                parsed = json.loads(choices[0]["message"]["content"])
                record = {
                    "custom_id": cid,
                    "year": meta.get("year"),
                    "make": meta.get("make"),
                    "model": meta.get("model"),
                    "service_category": meta.get("service_category"),
                    "service_name": meta.get("service_name"),
                    "estimation_method": parsed.get("estimation_method"),
                    "manual_checked": parsed.get("manual_checked"),
                    "labor_cost": parsed.get("labor_cost"),
                    "parts_cost": parsed.get("parts_cost"),
                    "total_price": parsed.get("total_price"),
                    "price_min": parsed.get("price_min"),
                    "price_max": parsed.get("price_max"),
                }
                records.append(record)

    df = pd.DataFrame(records)
    df.to_csv(final_csv, index=False)
    print(f"Exported combined CSV with Year and Service Name to {final_csv}")


# Run function
parse_batch_input_and_results(
    "batch_input.jsonl",
    "batch_output.jsonl",
    "Honda_Detailed_Pricing_Complete.csv",
)