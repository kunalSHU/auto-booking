const express = require('express');
const cors = require('cors');

const servicesRoutes = require('./routes/servicesRoutes');
const vehicleRoutes = require('./routes/vehicleRoutes');
const detailingRoutes = require('./routes/detailingRoutes');
const bookingsRoutes = require('./routes/bookingsRoutes');
const paymentsRoutes = require('./routes/paymentsRoutes');
const userRoutes = require('./routes/userRoutes');
const pubsubRoutes = require('./routes/pubsubRoutes');
const listenForMessages = require('./subscribers/emailSubscriber');
const { initializeOCR } = require('./utils/ocrService');

const errorHandler = require('./middleware/errorHandler');

const app = express();
const port = process.env.PORT || 4201;
const router = express.Router();

app.use(cors());
app.use(express.json()); // Allows for POST/PUT parsing

/* API routes */
app.use('/api/services', servicesRoutes);         // Handles GET /api/services/
app.use('/api/vehicle', vehicleRoutes);           // Handles GET /api/vehicle/
app.use('/api/detailing', detailingRoutes);       // Handles GET /api/detailing/
app.use('/api/bookings', bookingsRoutes);         // Handles GET /api/bookings/
app.use('/api/payments', paymentsRoutes);         // Handles GET /api/payments/
app.use('/api/users', userRoutes);                // Handles GET /api/users/
app.use('/api/pubsub', pubsubRoutes)
app.use('/api', router)

// For testing, temporary
router.get('/test', (req, res) => {
    res.json({message: "Hello World"});
});

// 404 handler (runs if no route above matches)
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// Centralized error-handling middleware (last)
app.use(errorHandler);

app.listen(port, async () => {
  console.log(`Server is listening on port ${port}`);
  
  // Start the Pub/Sub worker
  listenForMessages();

  // Initialize OCR service (downloads models on first run)
  try {
    await initializeOCR();
    console.log('[SERVER] OCR service initialized successfully');
  } catch (err) {
    console.warn('[SERVER] OCR service initialization failed:', err.message);
    console.warn('[SERVER] VIN scanning will not be available');
  }
});