const express = require('express');
const router = express.Router();
const db = require('../db');
const fetch = require('node-fetch');

/* GET /api/vehicle/ */
router.get('/', async (req, res) => {
    // res.json({ vehicle: { make: 'Toyota', model: 'Camry', year: 2020 } });
    const vehicles = await db.multi('SELECT * FROM "Vehicles"');
    res.json({ vehicles });
});

/* GET /api/vehicles/:id - get vehicle by ID */
router.get('/:id', async (req, res) => {
    const vehicle = await db.oneOrNone('SELECT * FROM "Vehicles" WHERE vehicle_id = $1', [req.params.id]);
    res.json({ vehicle });
});

/* GET /api/vehicles/user/:userId - get all vehicles for a user */
router.get('/user/:userId', async (req, res) => {
    const vehicles = await db.multi('SELECT * FROM "Vehicles" WHERE user_id = $1', [req.params.userId]);
    res.json({ vehicles });
});

/* POST /api/vehicles - create new vehicle */
router.post('/', async (req, res, next) => {
  try {
    const { user_id, vin_number, make, model, year } = req.body;
    let vehicleDetails;

    if (vin_number && vin_number.trim() !== '') {
      // Fetch vehicle info by VIN
      const vinResponse = await fetch(`https://vpic.nhtsa.dot.gov/api/vehicles/decodevinvalues/${vin_number}?format=json`);
      const vinData = await vinResponse.json();

      if (!vinData || !vinData.Results || vinData.Results.length === 0) {
        return res.status(400).json({ error: 'Invalid VIN' });
      }

      // You can pick relevant fields from vinData.Results[0] as needed
      vehicleDetails = vinData.Results[0];
    } else {
      // Search by make, model, year using vPIC API
      // Unfortunately, this API does not have a direct model/year search endpoint;
      // so may have query models for make and filter which vehicle it is:
      const modelResponse = await fetch(`https://vpic.nhtsa.dot.gov/api/vehicles/getmodelsformakeyear/make/${make}/modelyear/${year}?format=json`);
      const modelData = await modelResponse.json();

      if (!modelData || !modelData.Results || modelData.Results.length === 0) {
        return res.status(400).json({ error: 'No matching vehicles found for make and year' });
      }

      const foundModel = modelData.Results.find(m => m.Model_Name.toLowerCase().includes(model.toLowerCase()));

      if (!foundModel) {
        return res.status(400).json({ error: 'Model not found for given make and year' });
      }

      // Construct vehicleDetails from foundModel or just save make/model/year from user input
      vehicleDetails = {
        Make: make,
        Model: model,
        ModelYear: year,
        // can add other details here that are necessary like engine type etc... ex: foundModel.engine
      };
    }

    // Now insert into your database using vehicleDetails or original user's info
    const newVehicle = await db.one(
      `INSERT INTO "Vehicles" (user_id, vin_number, make, model, year, created_at)
      VALUES ($1, $2, $3, $4, $5, NOW()) RETURNING *`,
      [
        user_id,
        vin_number || null,
        vehicleDetails.Make || make,
        vehicleDetails.Model || model,
        vehicleDetails.ModelYear || year,
      ]
    );

    res.status(201).json({ vehicle: newVehicle });
  } catch (err) {
    next(err);
  }
});

/* PUT /api/vehicles/:id - update vehicle */
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