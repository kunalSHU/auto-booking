const express = require('express');
const router = express.Router();
const db = require('../db');

// GET /api/vehicle/info
router.get('/info', async (req, res) => {
    // res.json({ vehicle: { make: 'Toyota', model: 'Camry', year: 2020 } });
    const vehicles = await db.multi('SELECT * FROM "Vehicles"');
    res.json({vehicles});
});

module.exports = router;