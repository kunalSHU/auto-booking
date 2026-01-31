# OCR Setup Guide

This guide explains how to set up the VIN scanning feature using EasyOCR.

## Installation

### 1. Install Python Dependencies

Make sure you have Python 3.7+ installed. Then run:

```bash
pip install easyocr pillow
```

On Windows, if `pip` is not in your PATH:
```bash
python -m pip install easyocr pillow
```

### 2. First Run (Model Download)

The **first time** you start the server, EasyOCR will download the OCR models (approximately 200MB). This process:
- Takes **1-10 minutes** depending on your internet connection
- Happens **automatically** at server startup
- Only needs to happen **once** - models are cached locally
- Logs progress to the console

When the server starts, you should see:
```
[SERVER] Initializing EasyOCR... This may take 1-10 minutes on first run.
[OCR] Starting EasyOCR model download...
[OCR] Initialization complete! Models are ready.
```

### 3. How It Works

1. **Server Startup** → OCR models are downloaded and cached in `~/.EasyOCR/model_zoo/`
2. **User Scans VIN** → Image sent to `POST /api/vehicle/scan-vin` endpoint
3. **Python Process** → OCR extracts text from image (now completes in <1 second since models are cached)
4. **VIN Extraction** → Searches for 17-character VIN pattern in extracted text
5. **Response** → Returns extracted VIN or error message to frontend

### 4. Troubleshooting

**Issue: "Python OCR not available"**
- Make sure Python 3 is installed: `python --version` or `python3 --version`
- Install EasyOCR: `pip install easyocr pillow`

**Issue: "write EOF" or "stdin error" on Windows**
- Make sure Python is in your PATH
- Try running `python -m pip list` to verify installation works

**Issue: Slow first run (takes 10+ minutes)**
- This is normal! EasyOCR is downloading ~200MB of ML models
- Check your internet connection
- Be patient - it only happens once
- Subsequent runs will be fast (<1 second)

**Issue: Models downloaded to wrong location**
- EasyOCR stores models in: `~/.EasyOCR/model_zoo/`
- To reset: delete this directory and restart the server

### 5. Performance

- **First Request**: ~0.1-1 second (models already cached)
- **Subsequent Requests**: ~0.1-0.5 second
- **Model Download (one-time)**: 1-10 minutes (depending on internet)

## API Endpoints

### Scan VIN from Image

**Request:**
```
POST /api/vehicle/scan-vin
Content-Type: application/json

{
  "image": "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEA..."
}
```

**Success Response:**
```json
{
  "success": true,
  "vin": "1HGCM82633A004352",
  "confidence": 0.95,
  "full_text": "1HGCM82633A004352"
}
```

**Error Response:**
```json
{
  "success": false,
  "error": "No valid VIN found in image",
  "full_text": "extracted text from image"
}
```

### Save Vehicle Information

**Request:**
```
POST /api/vehicle
Content-Type: application/json

{
  "vin": "1HGCM82633A004352",
  "make": "Honda",
  "model": "Accord",
  "year": 2016
}
```

**Response:**
```json
{
  "vehicle": {
    "vin": "1HGCM82633A004352",
    "make": "Honda",
    "model": "Accord",
    "year": 2016,
    "Make": "HONDA",
    "Model": "ACCORD",
    "ModelYear": "2016"
  }
}
```

## Architecture

```
Frontend (React)
    ↓
User clicks camera icon in VIN field
    ↓
navigator.mediaDevices.getUserMedia() - get camera access
    ↓
Capture frame to canvas
    ↓
Convert to base64 JPEG
    ↓
POST /api/vehicle/scan-vin with image
    ↓
Express Backend (Node.js)
    ↓
Spawn Python process (ocr.py)
    ↓
Python OCR Process
    ↓
EasyOCR reads image
    ↓
Extract text, search for VIN pattern
    ↓
Return JSON result
    ↓
Backend sends to frontend
    ↓
Frontend populates VIN input field
```

## Advanced Configuration

To use GPU (much faster):
1. Install CUDA and cuDNN
2. In `server/utils/ocrInit.py`, change:
   ```python
   reader = easyocr.Reader(['en'], gpu=True)
   ```
3. Restart server

To scan other languages, in `server/utils/ocrInit.py`:
```python
reader = easyocr.Reader(['en', 'es', 'fr'], gpu=False)  # English, Spanish, French
```


If EasyOCR is not found, make sure you ran the pip install command above.
