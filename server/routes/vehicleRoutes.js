const express = require('express');
const router = express.Router();
const db = require('../db');

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
      `https://carsapi-7lpja5voja-uc.a.run.app/cars/trims-copy?year=${year}&make=${encodeURIComponent(make)}&model=${encodeURIComponent(model)}`
    );
    const data = await r.json();

    if (!data || !data.trims || data.trims.length === 0) {
      console.warn(`No trims found for year ${year}, make ${make}, model ${model}`);
      console.log('API Response:', JSON.stringify(data, null, 2));
      return res.json([]);
    }

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
      `https://carsapi-7lpja5voja-uc.a.run.app/cars/models?year=${year}&make=${encodeURIComponent(make)}`
    );
    const data = await r.json();

    if (!data || !data.models || data.models.length === 0) {
      console.warn(`No models found for year ${year}, make ${make}`);
      console.log('API Response:', JSON.stringify(data, null, 2));
      return res.json([]);
    }

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

/* POST /api/vehicle - Save vehicle information */
router.post("/", async (req, res, next) => {
  try {
    const { vin, make, model, trim, year } = req.body;

    console.log(req.body);


    if (!vin && (!make || !model || !year || !trim)) {
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


    // Construct the car image URL with proper encoding for special characters and spaces
    const imageUrl = `https://cdn.imagin.studio/getImage?customer=pandahub-ca&make=${encodeURIComponent(make)}&modelFamily=${encodeURIComponent(model)}&modelYear=${year}&trim=${encodeURIComponent(trim)}&angle=28&zoomLevel=30&width=500&countryCode=us&paintdescription=white`;

    res.status(201).json({ vehicle: vehicleDetails, imageUrl: imageUrl });
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