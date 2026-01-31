#!/usr/bin/env python3
"""
OCR Initialization - Downloads and caches EasyOCR models at server startup
This runs once and exits, allowing the Node.js process to detect when models are ready.
"""

import sys
import json

try:
    import easyocr
except ImportError:
    print(json.dumps({"error": "easyocr not installed. Run: pip install easyocr pillow"}), file=sys.stderr)
    sys.exit(1)

try:
    print("Starting EasyOCR model download. This may take a few minutes on first run...", file=sys.stderr)
    sys.stderr.flush()

    # Initialize reader - this downloads and caches models
    reader = easyocr.Reader(['en'], gpu=False, verbose=False)

    print("OCR models downloaded and cached successfully!", file=sys.stderr)
    sys.stderr.flush()

    # Return success
    sys.stdout.write(json.dumps({"success": True, "message": "OCR initialized"}) + "\n")
    sys.stdout.flush()
    sys.exit(0)

except Exception as e:
    error_msg = f"Failed to initialize OCR: {str(e)}"
    print(error_msg, file=sys.stderr)
    sys.stderr.flush()
    sys.stdout.write(json.dumps({"success": False, "error": error_msg}) + "\n")
    sys.stdout.flush()
    sys.exit(1)
