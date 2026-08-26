const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config(); // Load environment variables from .env file

const fs = require('fs');
// Dynamically generate the physical credential file if running on Render
if (process.env.GCP_CREDS_BASE64) {
  try {
    const decryptedJsonString = Buffer.from(process.env.GCP_CREDS_BASE64, 'base64').toString('utf8');
    
    // Create a temporary path in Render's storage footprint
    const tempCredsPath = path.join('/tmp', 'gcp-credentials.json');
    
    // Write the actual file out synchronously before anything else runs
    fs.writeFileSync(tempCredsPath, decryptedJsonString);
    
    // Assign it to Google's primary global tracking variable
    process.env.GOOGLE_APPLICATION_CREDENTIALS = tempCredsPath;
    console.log('[GCP AUTH] Successfully injected Google Application Default Credentials via /tmp');
  } catch (error) {
    console.error('[GCP AUTH] Critical error decoding GCP_CREDS_BASE64 string:', error.message);
  }
}

const servicesRoutes = require('./routes/servicesRoutes');
const vehicleRoutes = require('./routes/vehicleRoutes');
const detailingRoutes = require('./routes/detailingRoutes');
const bookingsRoutes = require('./routes/bookingsRoutes');
const paymentsRoutes = require('./routes/paymentsRoutes');
const userRoutes = require('./routes/userRoutes');
const pubsubRoutes = require('./routes/pubsubRoutes');
const redisRoutes = require('./routes/redisRoutes');
const otpRoutes = require('./routes/otpRoutes');
const authRoutes = require('./routes/authRoutes');
const listenForMessages = require('./subscribers/notificationSubscriber');
const { protect } = require('./middleware/authMiddleware');

const errorHandler = require('./middleware/errorHandler');

const app = express();
const port = process.env.PORT || process.env.SERVER_PORT || 4201; 
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
app.use('/api/otp', protect, otpRoutes);
// 1. Serve the static files from the React build directory
app.use(express.static(path.join(__dirname, '../build')));

// 2. Serve index.html for non-API web page requests (MOVE ABOVE 404)
app.get('*any', (req, res, next) => {
  // If the request is trying to hit a broken /api route, let it pass to the 404 handler below
  if (req.path.startsWith('/api')) {
    return next();
  }
  res.sendFile(path.join(__dirname, '../build', 'index.html'));
});

// 404 handler (runs if no route above matches)
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);

  // Start the Pub/Sub worker
  listenForMessages();
});