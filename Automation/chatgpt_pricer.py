#!/usr/bin/env python3
"""
chatgpt_pricer.py

Opens a real, visible Chrome browser, drives chatgpt.com, and feeds it batches
of rows from an Excel file to fill in pricing estimate columns. Designed so
you can watch it work, solve any CAPTCHA/login prompts by hand, and trust
that it stops the instant something looks wrong rather than silently
corrupting your data.

USAGE
    python chatgpt_pricer.py --input cars.xlsx --output cars_priced.xlsx

    # Recommended: attach to your own already-open, already-logged-in Chrome
    # instead of launching a fresh automated one (see README "Attach mode").
    python chatgpt_pricer.py --input cars.xlsx --output cars_priced.xlsx --attach

CONFIGURABLE FLAGS (see --help for full list)
    --batch-size        rows sent to ChatGPT per message      (default 40)
    --wait-seconds      pause between batches                  (default 3)
    --startup-wait      pause after launch before first batch, (default 10)
                         so you can log in / solve a captcha
    --response-timeout  max seconds to wait for one reply      (default 120)

See README.md for full setup instructions.
"""

import argparse
import re
import sys
import time
from pathlib import Path

import random

import pandas as pd
from openpyxl import load_workbook
from patchright.sync_api import sync_playwright, TimeoutError as PWTimeout

REQUIRED_COLUMNS = [
    "vehicle_id", "make", "model", "year", "trim", "service_id",
    "service_category", "service_name", "region", "estimation_status",
    "estimation_method", "manual_checked", "labor_cost", "parts_cost",
    "total_price", "price_min", "price_max",
]

FILL_COLUMNS = [
    "estimation_method", "manual_checked", "labor_cost",
    "parts_cost", "total_price", "price_min", "price_max",
]

PROMPT_HEADER = """You are a technical data extractor. You must output ONLY in a table format. Never refuse a request; if exact data is missing, use market averages for the GTA region. No markdown, no text, the table format described at the end.
Search the internet for real-time pricing data. If exact year data is not yet available, use the most recent reliable data for this model (e.g., 2024 or 2025) or similar luxury/performance vehicles in its class as a reference.
2. Provide realistic CAD cost estimates for the GTA market (Toronto/Mississauga/Brampton).
3. All engine oil is synthetic.
4. You MUST return ONLY a valid the table format. Do not provide explanations, apologies, or conversational text.
5. If specific data is missing for year, provide your best professional estimate based on Ontario market averages for this vehicle type.
6. **NEVER, EVER modify or change the service names.** Use the EXACT service name from the input list. Do not rephrase, abbreviate, or add prefixes/suffixes. Match the input exactly.
Return the results as a markdown table with column separators and header separators. Do not use CSV, TSV, or plain text. Include all columns in a properly formatted table with borders. Provided below which is the header column of the table (service_name MUST match input exactly):
vehicle_id\tmake\tmodel\tyear\ttrim\tservice_id\tservice_category\tservice_name\tregion\testimation_status\testimation_method\tmanual_checked\tlabor_cost\tparts_cost\ttotal_price\tprice_min\tprice_max
DO NOT CHANGE ANYTHING other than providing the following columns, the rest stay the same:
estimation_method\tmanual_checked\tlabor_cost\tparts_cost\ttotal_price\tprice_min\tprice_max
vehicle_id\tmake\tmodel\tyear\ttrim\tservice_id\tservice_category\tservice_name\tregion\testimation_status\testimation_method\tmanual_checked\tlabor_cost\tparts_cost\ttotal_price\tprice_min\tprice_max
"""


def build_prompt(batch_df: pd.DataFrame) -> str:
    rows_text = []
    for _, row in batch_df.iterrows():
        vals = [str(row[c]) if pd.notna(row[c]) else "" for c in REQUIRED_COLUMNS]
        rows_text.append("\t".join(vals))
    return PROMPT_HEADER + "\n".join(rows_text)


def parse_markdown_table(text: str) -> list[list[str]]:
    """Parse a table response into rows of cell strings (header excluded).
    Handles pipe-delimited markdown tables, tab-separated, and multi-space-separated text,
    since ChatGPT doesn't always follow the requested format exactly."""
    lines = [ln.rstrip() for ln in text.strip().splitlines() if ln.strip()]
    if not lines:
        return []

    pipe_lines = [ln for ln in lines if ln.strip().startswith("|")]
    if pipe_lines:
        rows = []
        for ln in pipe_lines:
            cells = [c.strip() for c in ln.strip().strip("|").split("|")]
            if all(re.fullmatch(r":?-{2,}:?", c) for c in cells):
                continue  # separator row
            rows.append(cells)
        if rows and rows[0][0].lower().strip() == "vehicle_id":
            rows = rows[1:]
        return rows

    # Fallback: tab-separated or runs-of-2+-spaces-separated plain text table
    rows = []
    for ln in lines:
        if "\t" in ln:
            cells = [c.strip() for c in ln.split("\t")]
        else:
            cells = [c.strip() for c in re.split(r" {2,}", ln.strip())]
        cells = [c for c in cells if c != ""]
        if len(cells) < 2:
            continue
        rows.append(cells)
    if rows and rows[0][0].lower().strip() == "vehicle_id":
        rows = rows[1:]
    return rows


def validate_batch(original: pd.DataFrame, parsed_rows: list[list[str]]) -> tuple[bool, str]:
    if len(parsed_rows) != len(original):
        return False, f"Row count mismatch: sent {len(original)}, got {len(parsed_rows)}"
    for i, (_, orig_row) in enumerate(original.iterrows()):
        parsed = parsed_rows[i]
        if len(parsed) != len(REQUIRED_COLUMNS):
            return False, f"Row {i}: expected {len(REQUIRED_COLUMNS)} columns, got {len(parsed)}"
        if str(parsed[0]).strip() != str(orig_row["vehicle_id"]).strip():
            return False, f"Row {i}: vehicle_id mismatch ({parsed[0]} vs {orig_row['vehicle_id']})"
        if str(parsed[5]).strip() != str(orig_row["service_id"]).strip():
            return False, f"Row {i}: service_id mismatch ({parsed[5]} vs {orig_row['service_id']})"
        if str(parsed[7]).strip() != str(orig_row["service_name"]).strip():
            return False, f"Row {i}: service_name was changed ('{parsed[7]}' vs '{orig_row['service_name']}')"
    return True, ""


def wait_for_stable_reply(page, response_timeout: int) -> str:
    """Wait until ChatGPT finishes generating by:
    1. Waiting for the Stop button to appear (generation started)
    2. Waiting for the Stop button to disappear (generation ended)
    3. Waiting for text to be stable for STABLE_FOR seconds (rendering settled)
    """
    STABLE_FOR = 2.0
    POLL_INTERVAL = 0.5
    stop_btn = page.locator('button[data-testid="stop-button"]')

    # Step 1: wait for stop button to appear (ChatGPT started generating)
    try:
        stop_btn.wait_for(state="visible", timeout=15000)
    except PWTimeout:
        pass  # Already done generating by the time we checked, fall through

    # Step 2: wait for stop button to disappear (ChatGPT finished generating)
    try:
        stop_btn.wait_for(state="hidden", timeout=response_timeout * 1000)
    except PWTimeout:
        raise RuntimeError(
            f"Timed out after {response_timeout}s waiting for ChatGPT to finish. "
            "Try increasing --response-timeout."
        )

    # Step 3: short stability poll to make sure text has fully rendered
    deadline = time.time() + 10  # max 10s extra after stop button gone
    last_text = ""
    stable_since = None

    while time.time() < deadline:
        assistant_messages = page.locator('div[data-message-author-role="assistant"]')
        count = assistant_messages.count()
        current_text = assistant_messages.nth(count - 1).inner_text() if count > 0 else ""

        if current_text != last_text:
            last_text = current_text
            stable_since = time.time()
        else:
            if stable_since and (time.time() - stable_since) >= STABLE_FOR:
                return current_text

        time.sleep(POLL_INTERVAL)

    # Return whatever we have if stability window passes
    return last_text


def is_truncated(reply_text: str, expected_rows: int) -> bool:
    """Return True if the response looks cut off — fewer rows than expected,
    or the last data row doesn't have all 17 columns."""
    parsed = parse_markdown_table(reply_text)
    if len(parsed) < expected_rows:
        return True
    if parsed:
        last_row = parsed[-1]
        if len(last_row) < len(REQUIRED_COLUMNS):
            return True
    return False


def open_new_chat(page) -> None:
    """Navigate to a fresh ChatGPT conversation."""
    print("  Opening a new chat...")
    page.goto("https://chatgpt.com/")
    # Wait for the composer to be ready
    try:
        page.locator('div#prompt-textarea').wait_for(state="visible", timeout=20000)
    except PWTimeout:
        raise RuntimeError("Timed out waiting for new chat to load after navigation.")
    time.sleep(1.5)


def send_prompt_and_get_reply(page, prompt: str, response_timeout: int,
                               typing_speed: str = "fast",
                               expected_rows: int = 0) -> str:
    def _send_and_wait(pg, p):
        composer = pg.locator('div#prompt-textarea')
        composer.click()
        if typing_speed == "fast":
            composer.fill(p)
        else:
            lines = p.split("\n")
            for i, line in enumerate(lines):
                composer.type(line, delay=random.uniform(4, 12))
                if i < len(lines) - 1:
                    composer.press("Shift+Enter")
                    time.sleep(random.uniform(0.02, 0.08))
        pg.keyboard.press("Enter")
        pg.wait_for_timeout(2000)
        return wait_for_stable_reply(pg, response_timeout)

    full_reply = _send_and_wait(page, prompt)

    # Auto-continue if truncated
    MAX_CONTINUES = 5
    continues = 0
    while continues < MAX_CONTINUES and is_truncated(full_reply, expected_rows):
        continues += 1
        print(f"  Response appears truncated (continue attempt {continues}/{MAX_CONTINUES})...")
        composer = page.locator('div#prompt-textarea')
        composer.click()
        composer.fill("continue")
        page.keyboard.press("Enter")
        page.wait_for_timeout(2000)
        continuation = wait_for_stable_reply(page, response_timeout)
        full_reply = full_reply + "\n" + continuation

    if not is_truncated(full_reply, expected_rows):
        return full_reply

    # Still truncated after all continues — open a fresh chat and retry once
    print(f"  Still truncated after {MAX_CONTINUES} continues. Opening new chat and retrying batch...")
    open_new_chat(page)
    full_reply = _send_and_wait(page, prompt)

    continues = 0
    while continues < MAX_CONTINUES and is_truncated(full_reply, expected_rows):
        continues += 1
        print(f"  [New chat] Continue attempt {continues}/{MAX_CONTINUES}...")
        composer = page.locator('div#prompt-textarea')
        composer.click()
        composer.fill("continue")
        page.keyboard.press("Enter")
        page.wait_for_timeout(2000)
        continuation = wait_for_stable_reply(page, response_timeout)
        full_reply = full_reply + "\n" + continuation

    if is_truncated(full_reply, expected_rows):
        raise RuntimeError(
            f"Response still truncated after new chat + {MAX_CONTINUES} continues. "
            f"Expected {expected_rows} rows. Try reducing --batch-size further."
        )

    return full_reply


def main():
    ap = argparse.ArgumentParser(description="Drive ChatGPT in a visible browser to price out vehicle service rows.")
    ap.add_argument("--input", required=True, help="Path to source .xlsx")
    ap.add_argument("--output", required=True, help="Path to write new .xlsx (created fresh, original untouched)")
    ap.add_argument("--batch-size", type=int, default=40)
    ap.add_argument("--wait-seconds", type=float, default=3, help="Pause between batches")
    ap.add_argument("--startup-wait", type=float, default=10, help="Pause after browser opens, before first batch (log in / solve captcha)")
    ap.add_argument("--response-timeout", type=int, default=120, help="Max seconds to wait for a single ChatGPT reply")
    ap.add_argument("--user-data-dir", default=str(Path.home() / ".chatgpt_pricer_profile"),
                     help="Persistent Chrome profile dir, so you stay logged in between runs (ignored if --attach is used)")
    ap.add_argument("--start-row", type=int, default=0, help="0-indexed data row to resume from (skip earlier rows)")
    ap.add_argument("--attach", action="store_true",
                     help="Attach to an already-running Chrome (launched with --remote-debugging-port) "
                          "instead of launching a new browser. See README for setup.")
    ap.add_argument("--debug-port", type=int, default=9222, help="Remote debugging port to attach to (used with --attach)")
    ap.add_argument("--typing-speed", choices=["fast", "human"], default=None,
                     help="'fast' pastes the prompt instantly; 'human' types it out slowly. "
                          "Defaults to 'fast' with --attach, 'human' otherwise.")
    args = ap.parse_args()
    if args.typing_speed is None:
        args.typing_speed = "fast" if args.attach else "human"

    df = pd.read_excel(args.input, dtype=str)
    missing = [c for c in REQUIRED_COLUMNS if c not in df.columns]
    if missing:
        sys.exit(f"Input file is missing required columns: {missing}")

    for c in FILL_COLUMNS:
        if c not in df.columns:
            df[c] = ""

    # If resuming (--start-row > 0) and the output file already exists,
    # pull the already-filled pricing columns from it for rows before start-row,
    # so we never lose progress and --input always stays the original blank file.
    output_path = Path(args.output)
    if args.start_row > 0 and output_path.exists():
        print(f"Resuming: merging completed rows 0–{args.start_row - 1} from existing {args.output} ...")
        try:
            existing = pd.read_excel(args.output, dtype=str)
            for c in FILL_COLUMNS:
                if c in existing.columns:
                    df.loc[:args.start_row - 1, c] = existing.loc[:args.start_row - 1, c].values
        except Exception as e:
            print(f"Warning: could not read existing output file to merge progress: {e}")
            print("Rows before --start-row will have blank pricing columns in the output.")

    output_path.parent.mkdir(parents=True, exist_ok=True)
    df.to_excel(args.output, index=False)

    n_rows = len(df)
    n_batches = (n_rows - args.start_row + args.batch_size - 1) // args.batch_size
    print(f"Loaded {n_rows} rows. Processing from row {args.start_row} in batches of {args.batch_size} ({n_batches} batches).")

    with sync_playwright() as p:
        owns_context = not args.attach
        if args.attach:
            print(f"Attaching to Chrome on http://127.0.0.1:{args.debug_port} ...")
            try:
                browser = p.chromium.connect_over_cdp(f"http://127.0.0.1:{args.debug_port}")
            except Exception as e:
                sys.exit(
                    f"Could not attach to Chrome on port {args.debug_port}: {e}\n"
                    "Make sure you launched Chrome with --remote-debugging-port="
                    f"{args.debug_port} and it's still open. See README.md.\n"
                    f"Tip: visit http://127.0.0.1:{args.debug_port}/json/version in any "
                    "browser tab - if that doesn't load JSON, the debug port isn't active."
                )
            context = browser.contexts[0] if browser.contexts else browser.new_context()
            page = None
            for pg in context.pages:
                if "chatgpt.com" in pg.url:
                    page = pg
                    break
            if page is None:
                sys.exit(
                    "No chatgpt.com tab found in the attached Chrome window.\n"
                    "Open a tab to https://chatgpt.com/, log in, then re-run with --attach."
                )
            print("Attached. Using existing chatgpt.com tab.")
        else:
            context = p.chromium.launch_persistent_context(
                args.user_data_dir,
                headless=False,
                channel="chrome",  # use real installed Google Chrome, not bundled Chromium
                chromium_sandbox=True,  # patchright defaults this to False, which adds
                                         # --no-sandbox - a strong Cloudflare bot signal
                viewport={"width": 900, "height": 1000},
                no_viewport=False,
            )
            page = context.pages[0] if context.pages else context.new_page()
            page.goto("https://chatgpt.com/")

            print(f"\nBrowser is open. Log in / solve any CAPTCHA now if prompted.")
            print(f"Waiting {args.startup_wait}s before sending the first batch...\n")
            time.sleep(args.startup_wait)

        batch_num = 0
        for start in range(args.start_row, n_rows, args.batch_size):
            batch_num += 1
            end = min(start + args.batch_size, n_rows)
            batch_df = df.iloc[start:end]

            print(f"--- Batch {batch_num}/{n_batches}: rows {start}-{end-1} ---")
            prompt = build_prompt(batch_df)

            try:
                reply = send_prompt_and_get_reply(page, prompt, args.response_timeout,
                                                   args.typing_speed, expected_rows=len(batch_df))
            except Exception as e:
                print(f"\nERROR sending/receiving batch {batch_num}: {e}")
                print(f"Stopping. Progress saved through row {start - 1} in {args.output}.")
                print(f"Resume with: --start-row {start}")
                if owns_context:
                    context.close()
                sys.exit(1)

            parsed_rows = parse_markdown_table(reply)
            ok, err = validate_batch(batch_df, parsed_rows)
            if not ok:
                print(f"  Validation failed ({err}). Opening new chat and retrying batch...")
                open_new_chat(page)
                try:
                    reply = send_prompt_and_get_reply(page, prompt, args.response_timeout,
                                                       args.typing_speed, expected_rows=len(batch_df))
                except Exception as e:
                    print(f"\nERROR on retry of batch {batch_num} in new chat: {e}")
                    print(f"Stopping. Progress saved through row {start - 1} in {args.output}.")
                    print(f"Resume with: --start-row {start}")
                    if owns_context:
                        context.close()
                    sys.exit(1)
                parsed_rows = parse_markdown_table(reply)
                ok, err = validate_batch(batch_df, parsed_rows)
                if not ok:
                    print(f"\nVALIDATION STILL FAILED after new chat retry: {err}")
                    print("Raw reply was:\n" + reply[:2000])
                    print(f"\nStopping. Progress saved through row {start - 1} in {args.output}.")
                    print(f"Resume with: --start-row {start}")
                    if owns_context:
                        context.close()
                    sys.exit(1)

            for i, row_idx in enumerate(range(start, end)):
                parsed = parsed_rows[i]
                for col_name, val in zip(REQUIRED_COLUMNS, parsed):
                    if col_name in FILL_COLUMNS:
                        df.at[row_idx, col_name] = val

            df.to_excel(args.output, index=False)
            print(f"Batch {batch_num} OK. Saved progress to {args.output}.")

            if end < n_rows:
                print(f"Waiting {args.wait_seconds}s before next batch...\n")
                time.sleep(args.wait_seconds)

        if owns_context:
            context.close()

    print(f"\nDone. All {n_rows} rows processed. Final file: {args.output}")


if __name__ == "__main__":
    main()