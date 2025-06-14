const express = require('express');
const cors = require('cors');

const servicesRoutes = require('./routes/servicesRoutes');
const vehicleRoutes = require('./routes/vehicleRoutes');

const app = express();
const port = process.env.PORT || 4201;

app.use(cors());
app.use(express.json()); // Allows for POST/PUT parsing

app.use('/api/services', servicesRoutes);         // Handles GET /api/services/list
app.use('/api/vehicle', vehicleRoutes);           // Handles GET /api/vehicle/info

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});