const db = require('../db');
const express = require('express');
const router = express.Router();

// GET /api/services/list
router.get('/list', async (req, res) => {
    // res.json({ services: ['Oil Change', 'Tire Rotation', 'Brakes'] });
    const services = await db.multi('SELECT * FROM "Services"');
    res.json({services});
});

module.exports = router;