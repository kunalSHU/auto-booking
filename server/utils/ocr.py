#!/usr/bin/env python3
"""
OCR module for extracting VIN numbers from images using EasyOCR
"""

import sys
import json
import base64
import re
from io import BytesIO
from PIL import Image

try:
    import easyocr
except ImportError:
    error_msg = json.dumps({"error": "easyocr not installed. Run: pip install easyocr pillow"})
    sys.stdout.write(error_msg + "\n")
    sys.stdout.flush()
    sys.exit(1)

# Initialize reader once (for performance)
try:
    reader = easyocr.Reader(['en'], gpu=False)
except Exception as e:
    error_msg = json.dumps({"error": f"Failed to initialize OCR reader: {str(e)}"})
    sys.stdout.write(error_msg + "\n")
    sys.stdout.flush()
    sys.exit(1)

def extract_vin_from_image(image_base64):
    """
    Extract VIN number from base64 encoded image

    Args:
        image_base64: Base64 encoded image string

    Returns:
        Dictionary with extracted VIN or error message
    """
    try:
        # Decode base64 image
        image_data = base64.b64decode(image_base64)
        image = Image.open(BytesIO(image_data))

        # Convert to RGB if needed
        if image.mode != 'RGB':
            image = image.convert('RGB')

        # Run OCR
        results = reader.readtext(image)

        # Combine all text
        full_text = ' '.join([text[1] for text in results])

        # Look for VIN pattern (17 characters, alphanumeric, excluding I, O, Q)
        vin_pattern = r'[A-HJ-NPR-Z0-9]{17}'
        vin_matches = re.findall(vin_pattern, full_text.upper())

        if vin_matches:
            vin = vin_matches[0]
            return {
                "success": True,
                "vin": vin,
                "confidence": results[0][2] if results else 0,
                "full_text": full_text
            }
        else:
            return {
                "success": False,
                "error": "No valid VIN found in image",
                "full_text": full_text
            }

    except Exception as e:
        return {
            "success": False,
            "error": str(e)
        }

if __name__ == "__main__":
    try:
        # Read base64 image from stdin
        image_base64 = sys.stdin.read().strip()

        if not image_base64:
            result = {"error": "No image data received"}
        else:
            result = extract_vin_from_image(image_base64)

        # Write JSON output
        output = json.dumps(result)
        sys.stdout.write(output + "\n")
        sys.stdout.flush()
    except Exception as e:
        error_result = {"error": f"Fatal error: {str(e)}"}
        sys.stdout.write(json.dumps(error_result) + "\n")
        sys.stdout.flush()
        sys.exit(1)
