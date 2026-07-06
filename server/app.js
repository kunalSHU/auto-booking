const express = require('express');
const cors = require('cors');
require('dotenv').config(); // Load environment variables from .env file

const servicesRoutes = require('./routes/servicesRoutes');
const vehicleRoutes = require('./routes/vehicleRoutes');
const detailingRoutes = require('./routes/detailingRoutes');
const bookingsRoutes = require('./routes/bookingsRoutes');
const paymentsRoutes = require('./routes/paymentsRoutes');
const userRoutes = require('./routes/userRoutes');
const pubsubRoutes = require('./routes/pubsubRoutes');
const redisRoutes = require('./routes/redisRoutes');
const authRoutes = require('./routes/authRoutes');
const listenForMessages = require('./subscribers/notificationSubscriber');
const { protect } = require('./middleware/authMiddleware');

const errorHandler = require('./middleware/errorHandler');

const app = express();
const port = process.env.SERVER_PORT || 4201;
const router = express.Router();

app.use(cors());
app.use(express.json()); // Allows for POST/PUT parsing

/* Public API routes */
// The auth route must be public so the frontend can get a session token.
app.use('/api/auth', authRoutes);

/* Protected API routes */
// The 'protect' middleware will now run for all routes defined after this line.
app.use('/api', protect, router);
app.use('/api/services', protect, servicesRoutes);
app.use('/api/vehicle', protect, vehicleRoutes);
app.use('/api/detailing', protect, detailingRoutes);
app.use('/api/bookings', protect, bookingsRoutes);
app.use('/api/payments', protect, paymentsRoutes);
app.use('/api/users', protect, userRoutes);
app.use('/api/pubsub', protect, pubsubRoutes);
app.use('/api/redis', protect, redisRoutes);

// 404 handler (runs if no route above matches)
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// Centralized error-handling middleware (last)
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);

  // Start the Pub/Sub worker
  listenForMessages();
});