const express = require('express');
const router = express.Router();
const db = require('../db');
const { spawn } = require('child_process');
const path = require('path');

let fetch;

(async () => {
  const module = await import('node-fetch');
  fetch = module.default;
})();

router.get("/", async (req, res) => {
  const { year, make, model } = req.query;

  console.log("--->" + year );
  console.log("--->" + make );
  console.log("--->" + model );


  if (!year) {
    return res.status(400).json({ error: "year is required" });
  }

  if (year) {
    console.log("make found: " + year);
  }

  // STEP 3: YEAR + MAKE + MODELS -> TRIMS
  if (make && model) {
    const r = await fetch(
      `https://carsapi-7lpja5voja-uc.a.run.app/cars/trims-copy?year=${year}&make=${make}&model=${model}`
    );
    const data = await r.json();

    const result = data.trims.map(t => ({
      make: t.make,
      model: t.model,
      model_trim: t,
      model_year: Number(t.model_year),
    }));

    return res.json(result);
  }

  // STEP 2: YEAR + MAKE -> MODELS
  if (make) {
    const r = await fetch(
      `https://carsapi-7lpja5voja-uc.a.run.app/cars/models?year=${year}&make=${make}`
    );
    const data = await r.json();

    const result = data.models.map(t => ({
      make: t.make,
      model: t,
      model_trim: null,
      model_year: Number(t.model_year),
    }));

    return res.json(result);
  }

  // STEP 1: YEAR ONLY -> MAKES
  if (year) {
    const r = await fetch(
      `https://carsapi-7lpja5voja-uc.a.run.app/cars/makes?year=${year}`
    );

    const data = await r.json();

    console.log("API Response:", JSON.stringify(data, null, 2));

    if (!data || !data.makes || data.makes.length === 0) {
      console.warn(`No makes found for year ${year}. API may not support this year yet.`);
      return res.json([]);
    }

    const result = data.makes.map(m => ({
      make: m,
      model: null,
      model_trim: null,
      model_year: Number(year),
    }));

    return res.json(result);
  }

});

/* Get car by VIN */
router.get("/vin", async (req, res) => {
  const { vin } = req.params;

  const r = await fetch(
    `https://vpic.nhtsa.dot.gov/api/vehicles/decodevinvalues/${vin}?format=json`
  );
  const data = await r.json();

  return res.json(data);
});

/* POST /api/vehicle/scan-vin - OCR endpoint to scan VIN from image */
router.post("/scan-vin", async (req, res, next) => {
  try {
    const { image } = req.body;

    if (!image) {
      return res.status(400).json({ error: "Image is required" });
    }

    // Call Python OCR script
    const pythonScript = path.join(__dirname, '../utils/ocr.py');
    const pythonCommand = process.platform === 'win32' ? 'python' : 'python3';

    const pythonProcess = spawn(pythonCommand, [pythonScript], {
      timeout: 60000, // 60 second timeout (models already downloaded at server startup)
      shell: process.platform === 'win32'
    });

    let output = '';
    let errorOutput = '';
    let responseHandled = false;

    pythonProcess.on('error', (error) => {
      console.error(`Failed to spawn ${pythonCommand} process:`, error.message);
      if (!responseHandled) {
        responseHandled = true;
        res.status(500).json({
          error: 'Python OCR not available',
          details: `Make sure Python 3 is installed. Run: pip install easyocr pillow`
        });
      }
    });

    pythonProcess.stdout.on('data', (data) => {
      output += data.toString();
    });

    pythonProcess.stderr.on('data', (data) => {
      errorOutput += data.toString();
    });

    pythonProcess.on('close', (code) => {
      if (responseHandled) return;
      responseHandled = true;

      if (code !== 0) {
        console.error('Python OCR Error (exit code ' + code + '):', errorOutput);
        return res.status(500).json({
          error: 'Failed to process image',
          details: errorOutput || 'Python process exited with code ' + code
        });
      }

      try {
        if (!output) {
          return res.status(500).json({
            error: 'No output from OCR process'
          });
        }
        const result = JSON.parse(output);
        res.json(result);
      } catch (parseError) {
        console.error('Failed to parse Python output:', output);
        res.status(500).json({
          error: 'Failed to parse OCR result',
          details: output
        });
      }
    });

    pythonProcess.stdin.on('error', (error) => {
      console.error('stdin error:', error.message);
      if (!responseHandled) {
        responseHandled = true;
        res.status(500).json({
          error: 'Failed to send data to OCR process',
          details: error.message
        });
      }
    });

    // Write image and close stdin
    pythonProcess.stdin.write(image);
    pythonProcess.stdin.end();
  } catch (err) {
    next(err);
  }
});

/* POST /api/vehicle - Save vehicle information */
router.post("/", async (req, res, next) => {
  try {
    const { vin, make, model, year } = req.body;

    if (!vin && (!make || !model || !year)) {
      return res.status(400).json({ error: "Either VIN or make/model/year is required" });
    }

    // If VIN provided, decode it to get vehicle details
    let vehicleDetails = { make, model, year };
    if (vin) {
      try {
        const vinResponse = await fetch(`https://vpic.nhtsa.dot.gov/api/vehicles/decodevinvalues/${vin}?format=json`);
        const vinData = await vinResponse.json();

        if (vinData && vinData.Results && vinData.Results.length > 0) {
          vehicleDetails = {
            vin: vin,
            make: vinData.Results[0].Make || make,
            model: vinData.Results[0].Model || model,
            year: vinData.Results[0].ModelYear || year,
            ...vinData.Results[0]
          };
        }
      } catch (vinErr) {
        console.warn('Failed to decode VIN from NHTSA API:', vinErr.message);
      }
    }

    res.status(201).json({ vehicle: vehicleDetails });
  } catch (err) {
    next(err);
  }
});
router.put('/:id', async (req, res, next) => {
    try {
        const { make, model, year } = req.body;
        const updated = await db.one(
            `UPDATE "Vehicles" SET make = $1, model = $2, year = $3
            WHERE vehicle_id = $4 RETURNING *`,
            [make, model, year, req.params.id]
        );
        res.status(201).json({ vehicle: updated });
    } catch (err) {
        next(err);
    }
});

/* DELETE /api/vehicles/:id */
router.delete('/:id', async (req, res, next) => {
    try {
        await db.none('DELETE FROM "Vehicles" WHERE vehicle_id = $1', [req.params.id]);
        res.status(204).send(); // 204 - request sucess has no body
    } catch (err) {
        next(err);
    }
});

module.exports = router;