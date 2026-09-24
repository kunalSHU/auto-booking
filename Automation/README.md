# ChatGPT Vehicle Pricing Automator

Drives a real, visible Chrome browser to chatgpt.com, sends it batches of
rows from your Excel file, and writes the returned pricing estimates back
into a new spreadsheet. You watch it happen and can solve any CAPTCHA/login
prompts by hand.

## 1. Setup (one-time)

You need Python 3.9+ installed.

```bash
# 1. Create a folder and put chatgpt_pricer.py + requirements.txt in it,
#    then open a terminal in that folder.

# 2. (Recommended) create a virtual environment
python3 -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate

# 3. Install Python dependencies
pip install -r requirements.txt

# 4. Install the actual browser patchright will drive (real Chrome, not
#    Playwright's bundled Chromium — this matters for avoiding bot detection)
patchright install chrome
```

That's it — setup is done. You only need to repeat this if you set up on a
new machine.

**Why patchright instead of plain Playwright?** chatgpt.com runs Cloudflare
Turnstile bot detection that flags standard Playwright/Chromium sessions
(via low-level devtools-protocol fingerprints), often causing a 403 right
after you pass the "verify you are human" check. `patchright` is a drop-in
fork of Playwright that patches those specific fingerprints and, combined
with running real installed Chrome (`channel="chrome"`) and human-paced
typing (already built into the script), significantly reduces — but does
not guarantee — those 403s/challenges. This is adversarial, actively
maintained bot detection, so occasional blocks are still possible.

## 2. Running it — Attach mode (recommended)

Cloudflare's bot detection on chatgpt.com is much harder to satisfy with a
freshly-launched automated browser, even a well-disguised one. The reliable
workaround is: **you** open your real, everyday Chrome and log in normally,
and the script just attaches to that already-open tab to type/read — no
automated launch, no fresh fingerprint, nothing for Cloudflare to flag.

### One-time per session: launch Chrome with remote debugging enabled

Fully close all Chrome windows first, then launch it with one extra flag.

**Windows (PowerShell or Command Prompt):**
```
"C:\Program Files\Google\Chrome\Application\chrome.exe" --remote-debugging-port=9222
```

**macOS:**
```bash
/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome --remote-debugging-port=9222
```

**Linux:**
```bash
google-chrome --remote-debugging-port=9222
```

This opens Chrome completely normally — it's still "your" browser, your
profile, your extensions. Now:

1. Navigate to `https://chatgpt.com/` in that window and log in as you
   always would, exactly like any normal day of browsing. Solve any
   captcha/verification the same way you normally would. Stay on that tab.
2. Leave that Chrome window open.
3. In your terminal, run the script with `--attach`:
   ```bash
   python chatgpt_pricer.py --input cars.xlsx --output cars_priced.xlsx --attach
   ```
4. The script connects to your already-running Chrome, finds the
   chatgpt.com tab, and starts feeding it batches — you'll watch it type and
   read replies in the same window you were just using.
5. The script will **not** close this Chrome window when it's done or if it
   stops on an error — it's your browser, not its own.

If you ever need a different debugging port (e.g. 9222 is in use), launch
Chrome with `--remote-debugging-port=9333` (or any free port) and pass
`--debug-port 9333` to the script.

## 3. Running it — Launch mode (fallback)

If you'd rather have the script launch and own its own browser window
(separate profile, separate from your daily browsing), drop `--attach`:

```bash
python chatgpt_pricer.py --input cars.xlsx --output cars_priced.xlsx
```

This is more likely to run into Cloudflare challenges/403s than Attach mode,
since it's a freshly-launched automated session. Use Attach mode if at all
possible.

This will:
1. Open a visible Chrome window and go to chatgpt.com.
2. Pause for `--startup-wait` seconds (default 20) so you can log in or
   solve a CAPTCHA if asked.
3. Send your rows to ChatGPT in batches (default 30 rows/batch), reading
   each reply, validating it, and writing results into `cars_priced.xlsx`
   after every batch (so you never lose progress).
4. Wait `--wait-seconds` (default 30) between batches.
5. **Stop immediately** if a reply doesn't match what was sent (wrong row
   count, changed service name, mismatched IDs, etc.), telling you exactly
   which row to resume from.

Arrange your windows however you like — e.g. Excel/the script's terminal on
one side, the Chrome window on the other — so you can watch it work and
intervene if needed.

### Useful flags

| Flag | Default | Purpose |
|---|---|---|
| `--batch-size` | 30 | Rows sent per ChatGPT message |
| `--wait-seconds` | 30 | Pause between batches |
| `--startup-wait` | 20 | Pause after launch before first batch (login/captcha) |
| `--response-timeout` | 120 | Max seconds to wait for one reply to finish generating |
| `--start-row` | 0 | Resume from a specific row (0-indexed) after a stop |
| `--user-data-dir` | `~/.chatgpt_pricer_profile` | Persistent Chrome profile — keeps you logged in between runs (Launch mode only) |
| `--attach` | off | Attach to your already-open, already-logged-in Chrome instead of launching a new one (recommended) |
| `--debug-port` | 9222 | Remote debugging port to attach to (must match what you launched Chrome with) |

### Example: resuming after a stop

If the script stops at, say, row 90 due to a validation error:

```bash
python chatgpt_pricer.py --input cars.xlsx --output cars_priced.xlsx --start-row 90
```

(Point `--output` at the same partially-filled file, or a new one — your
choice. Rows before `--start-row` are simply left as-is from whatever you
loaded with `--input`, so if you resume into `cars_priced.xlsx` itself, the
already-completed rows stay intact.)

## 3. How matching/validation works

For every batch, the script checks that ChatGPT's reply:
- has the same number of rows as were sent,
- has all 17 columns per row,
- preserves `vehicle_id` and `service_id` in order,
- did **not** alter `service_name`.

If any of these fail, the script stops the whole run (per your request) and
prints the raw reply so you can see what went wrong, rather than silently
writing bad data.

## 4. Notes / things you may need to adjust

- **Selectors may go stale.** ChatGPT's web UI changes over time. The
  script looks for the prompt box (`div#prompt-textarea`), the
  stop-generating button, and assistant message bubbles
  (`div[data-message-author-role="assistant"]`). If OpenAI changes their
  HTML, these selectors may need updating — open an issue/ping for a fix.
- **First run requires login.** Since the browser profile persists in
  `--user-data-dir`, you should only need to log in once; subsequent runs
  will already be authenticated (still leave some `--startup-wait` buffer
  in case of occasional re-verification prompts).
- **Terms of Service**: automating the consumer chatgpt.com web interface
  (as opposed to OpenAI's official API) isn't something OpenAI supports for
  programmatic use, and accounts can be flagged/limited for automated
  behavior. This script exists because you've chosen to do it this way
  deliberately (manual captcha handling, conservative pacing, etc.) — keep
  batch sizes and wait times reasonable and keep an eye on your account.
