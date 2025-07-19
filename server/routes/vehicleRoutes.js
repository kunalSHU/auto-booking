const express = require('express');
const router = express.Router();
const db = require('../db');

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
        const newVehicle = await db.one(
            `INSERT INTO "Vehicles" (user_id, vin_number, make, model, year, created_at)
            VALUES ($1, $2, $3, $4, $5, NOW()) RETURNING *`,
            [user_id, vin_number, make, model, year]
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