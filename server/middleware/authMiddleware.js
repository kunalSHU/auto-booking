const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET;

/**
 * Middleware to protect routes by verifying a JWT.
 * It checks for a 'Bearer' token in the Authorization header.
 */
const protect = (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // Extract token from "Bearer <token>"
            token = req.headers.authorization.split(' ')[1];

            // Verify the token using the secret
            jwt.verify(token, JWT_SECRET);

            // Token is valid, proceed to the actual route handler
            next();
        } catch (error) {
            return res.status(401).json({ error: 'Not authorized, token failed' });
        }
    }

    if (!token) {
        return res.status(401).json({ error: 'Not authorized, no token provided' });
    }
};

module.exports = { protect };