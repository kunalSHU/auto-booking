const db = require('../db');
const express = require('express');
const router = express.Router();

// GET /api/detailing-options
router.get('/', async (req, res) => {
    const options = await db.multi('SELECT * FROM "DetailingOptions"');
    res.json({ options });
});

module.exports = router;