const db = require('../db');
const express = require('express');
const router = express.Router();
const errorHandler = require('../middleware/errorHandler');

// POST /api/payments
router.post('/', async (req, res, next) => {
    const { booking_id, amount, payment_method, payment_status, transaction_id } = req.body;

    /* Connect with Stripe - If success then insert record into db otherwise return failure */

    try {
        const newPayment = await db.one(
            `INSERT INTO "Payments" (
                booking_id, amount, payment_method, payment_status, transaction_id, created_at
            ) VALUES ($1, $2, $3::payment_method, $4::payment_status, $5, NOW())
            RETURNING *`,
            [booking_id, amount, payment_method, payment_status, transaction_id]
        );


        res.status(201).json({ payment: newPayment });
    } catch (err) {
        next(err)
    }
});

// GET /api/payments/:bookingId
router.get('/:bookingId', async (req, res) => {
    const payment = await db.oneOrNone(
        'SELECT * FROM "Payments" WHERE booking_id = $1',
        [req.params.bookingId]
    );
    res.json({ payment });
});

module.exports = router;