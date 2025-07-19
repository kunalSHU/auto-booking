const db = require('../db');
const express = require('express');
const router = express.Router();

// POST /api/bookings
router.post('/', async (req, res) => {
  const {
    user_id, vehicle_id, service_id, detailing_id, location_type,
    travel_km, water_supply, electric_supply,
    booking_date, time_slot, total_price, status
  } = req.body;

  const newBooking = await db.one(
    `INSERT INTO "Bookings" (
      user_id, vehicle_id, service_id, detailing_id, location_type,
      travel_km, water_supply, electric_supply,
      booking_date, time_slot, total_price, status, created_at
    ) VALUES (
      $1, $2, $3, $4, $5,
      $6, $7, $8,
      $9, $10, $11, $12, NOW()
    ) RETURNING *`,
    [
      user_id, vehicle_id, service_id, detailing_id, location_type,
      travel_km, water_supply, electric_supply,
      booking_date, time_slot, total_price, status
    ]
  );
  res.status(201).json({ booking: newBooking });
});

// GET /api/bookings/user/:userId
router.get('/user/:userId', async (req, res) => {
  const bookings = await db.multi(
    'SELECT * FROM "Bookings" WHERE user_id = $1 ORDER BY booking_date DESC',
    [req.params.userId]
  );
  res.json({ bookings });
});

module.exports = router;