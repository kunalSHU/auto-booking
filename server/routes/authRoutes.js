const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();

/**
 * @route   GET /api/auth/session
 * @desc    Generate a session token for an anonymous user.
 * @access  Public
 */
router.get('/session', async (req, res) => {
    try {
        const { v4: uuidv4 } = await import('uuid');
        const JWT_SECRET = process.env.JWT_SECRET;

        if (!JWT_SECRET) {
            console.error("JWT_SECRET is not defined in environment variables.");
            return res.status(500).json({ error: "Server configuration error." });
        }

        // Create a payload for the token.
        const payload = {
            type: 'anonymous-session',
            sid: uuidv4(), // Session ID
        };

        // Sign the token with a 24-hour expiration.
        const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '24h' });

        res.json({ token });
    } catch (error) {
        console.error("Error generating session token:", error);
        res.status(500).json({ error: "Failed to generate session token." });
    }
});

module.exports = router;