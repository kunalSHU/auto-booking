const db = require('../db');
const express = require('express');
const router = express.Router();

// GET /api/services/list
router.get('/', async (req, res) => {
    // res.json({ services: ['Oil Change', 'Tire Rotation', 'Brakes'] });
    const services = await db.multi('SELECT * FROM "Services"');
    res.json({ services });
});

// GET /api/services/:id - get service by ID
router.get('/:id', async (req, res) => {
    const service = await db.oneOrNone('SELECT * FROM "Services" WHERE service_id = $1', [req.params.id]);
    if (!service) return res.status(404).json({ error: 'Service not found' });
    res.json({ service });
});

// GET /api/services/category/:category - get services by category
router.get('category/:category', async (req, res) => {
    const { category } = req.params;
    try {
        const services = await db.multi(
            'SELECT * FROM "Services" WHERE LOWER(category) = LOWER($1)',
            [category]
        );

        res.json({ services });
    } catch (error) {
        console.error('Error fetching services by category:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;