const express = require('express');
const router = express.Router();
const db = require('../db');

// GET /api/users
router.get('/', async (req, res) => {
    const users = await db.multi('SELECT * FROM "Users" ORDER BY created_at DESC');
    res.json({ users });
});

// GET /api/users/:id
router.get('/:id', async (req, res) => {
    const user = await db.oneOrNone('SELECT * FROM "Users" WHERE user_id = $1', [req.params.id]);
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json({ user });
});

// POST /api/users
router.post('/', async (req, res) => {
    const { user_id, name, email, phone, address } = req.body;

    try {
        const newUser = await db.one(
            `INSERT INTO "Users" (user_id, name, email, phone, address, created_at)
            VALUES ($1, $2, $3, $4, $5, NOW())
            RETURNING *`,
            [user_id, name, email, phone, address]
        );
        res.status(201).json({ user: newUser });
    } catch (error) {

        if (error.code === '23505') { // Unique constraint violation
            return res.status(400).json({ error: 'User ID or email already exists' });
        }
        res.status(500).json({ error: 'Internal server error' });
    }
});

// PUT /api/users/:id
router.put('/:id', async (req, res, next) => {
    const { name, email, phone, address } = req.body;

    try {
        const updatedUser = await db.oneOrNone(
            `UPDATE "Users"
            SET name = $1, email = $2, phone = $3, address = $4
            WHERE user_id = $5
            RETURNING *`,
            [name, email, phone, address, req.params.id]
        );
        if (!updatedUser) return res.status(404).json({ error: 'User not found' });
        res.json({ user: updatedUser });
    } catch (err) {
        next(err);
    }
});

// DELETE /api/users/:id
router.delete('/:id', async (req, res, next) => {
    try {
        const result = await db.result('DELETE FROM "Users" WHERE user_id = $1', [req.params.id]);
        if (result.rowCount === 0) return res.status(404).json({ error: 'User not found' });
        res.status(204).send();
    } catch (err) {
        next(err);
    }
});

module.exports = router;
