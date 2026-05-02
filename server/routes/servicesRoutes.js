const db = require('../db');
const express = require('express');
const router = express.Router();
const { getPerplexityEstimate } = require('../utils/perplexityEstimator');

// Import fetch (works with both old and new node-fetch versions)
let fetch;
try {
  const nodeFetch = require('node-fetch');
  fetch = nodeFetch.default || nodeFetch;
} catch (error) {
  // Fallback to global fetch if available (Node 18+)
  fetch = global.fetch;
}

// Helper function for API calls with timeout
const fetchWithTimeout = (url, options = {}, timeoutMs = 10000) => {
  return Promise.race([
    fetch(url, options),
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Request timeout')), timeoutMs)
    ),
  ]);
};

// Helper function to parse price estimate from string like "$45-65"
const parsePriceEstimate = (estimateString) => {
  const match = estimateString.match(/\$(\d+)-(\d+)/);
  if (match) {
    return {
      price_min: parseInt(match[1], 10),
      price_max: parseInt(match[2], 10),
    };
  }
  return null;
};

// Helper function to get or create a vehicle and return vehicle_id
const getOrCreateVehicle = async (vehicle) => {
  try {
    // Try to find vehicle by VIN if provided
    if (vehicle.vin) {
      const existingByVin = await db.oneOrNone(
        'SELECT vehicle_id FROM "Vehicles" WHERE vin_number = $1',
        [vehicle.vin]
      );
      if (existingByVin) {
        return existingByVin.vehicle_id;
      }
    }

    // Try to find vehicle by make, model, year, and trim
    const existingBySpecs = await db.oneOrNone(
      'SELECT vehicle_id FROM "Vehicles" WHERE make = $1 AND model = $2 AND year = $3 AND trim = $4',
      [vehicle.make, vehicle.model, parseInt(vehicle.year, 10), vehicle.trim || null]
    );

    if (existingBySpecs) {
      return existingBySpecs.vehicle_id;
    }

    // Create new vehicle (user_id is NULL for now, can be linked later when user logs in)
    const newVehicle = await db.one(
      'INSERT INTO "Vehicles" (vin_number, make, model, year, trim, created_at) VALUES ($1, $2, $3, $4, $5, CURRENT_TIMESTAMP) RETURNING vehicle_id',
      [vehicle.vin || null, vehicle.make, vehicle.model, parseInt(vehicle.year, 10), vehicle.trim || null]
    );

    console.log('New vehicle created with ID:', newVehicle.vehicle_id);
    return newVehicle.vehicle_id;
  } catch (error) {
    console.error('Error in getOrCreateVehicle:', error);
    throw error;
  }
};

// Service name mapping: frontend display names to database service names
const serviceNameMap = {
  'Oil & Filter Change': 'Oil Change',
  'Tire Rotation': 'Tire Rotation',
  'Fluid Top-up': 'Power Steering Fluid Top-Up',
  'Battery Check & Service': 'Battery Replacement',
  'Air Filter Replacement': 'Air Filter Replacement',
  'Computer Diagnostic Scan': 'Computer Diagnostic Scan',
  'Brake Inspection': 'Brake Service',
  'Engine Inspection': 'Engine Inspection',
  'Transmission Check': 'Transmission Fluid Change',
  'Suspension Inspection': 'Suspension Inspection',
  'Engine Performance Tuning': 'Engine Performance Tuning',
  'Suspension Upgrade': 'Suspension Upgrade',
  'Brake System Upgrade': 'Brake System Upgrade',
  'Exhaust System Upgrade': 'Exhaust System Upgrade',
  'Fuel System Cleaning': 'Fuel System Cleaning',
  'Custom Wheels Installation': 'Custom Wheels Installation',
  'Body Kit Installation': 'Body Kit Installation',
  'Window Tint Application': 'Window Tint Application',
  'Custom Paint Service': 'Custom Paint Service',
  'Interior Customization': 'Interior Customization',
  'Basic Wash & Dry': 'Basic Wash & Dry',
  'Undercarriage Wash': 'Undercarriage Wash',
  'Carpet & Mat Cleaning': 'Carpet & Mat Cleaning',
  'Seat Conditioning': 'Seat Conditioning',
};

// POST /api/services/estimate - Get price estimate using Groq
router.post('/estimate', async (req, res) => {
  const { vehicle, serviceTitle } = req.body;

  if (!vehicle || !serviceTitle) {
    return res.status(400).json({ error: 'Vehicle and service title are required' });
  }

  try {
    // Get or create vehicle and get vehicle_id
    const vehicleId = await getOrCreateVehicle(vehicle);

    // Map frontend service name to database service name
    const dbServiceName = serviceNameMap[serviceTitle] || serviceTitle;

    console.log(`Getting estimate for ${vehicle.year} ${vehicle.make} ${vehicle.model} - ${dbServiceName}`);

    // Look up service_id by service name
    const service = await db.oneOrNone(
      'SELECT service_id FROM "Services" WHERE name = $1',
      [dbServiceName]
    );

    if (!service) {
      return res.status(404).json({ error: `Service "${serviceTitle}" not found in database` });
    }

    const serviceId = service.service_id;
    console.log(`✓ Found service ID ${serviceId} for "${serviceTitle}"`);

    // Check if estimate already exists in database using service_id and vehicle_id
    const existingEstimate = await db.oneOrNone(
      'SELECT * FROM "ServiceEstimates" WHERE service_id = $1 AND vehicle_id = $2',
      [serviceId, vehicleId]
    );

    if (existingEstimate) {
      const estimate = `$${existingEstimate.price_min}-${existingEstimate.price_max}`;
      console.log('✓ Estimate found in database:', estimate);
      return res.json({ estimate, source: 'database', vehicleId });
    }

    // Get estimate from Perplexity (performs web search)
    const estimate = await getPerplexityEstimate(
      vehicle.year,
      vehicle.make,
      vehicle.model,
      vehicle.trim,
      serviceTitle
    );

    if (!estimate) {
      return res.status(500).json({ error: 'Failed to get estimate from Perplexity' });
    }

    // Parse and save estimate to database using service_id and vehicle_id
    const parsedPrice = parsePriceEstimate(estimate);
    if (parsedPrice) {
      try {
        await db.none(
          'INSERT INTO "ServiceEstimates" (service_id, vehicle_id, price_min, price_max, created_at, updated_at) VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)',
          [serviceId, vehicleId, parsedPrice.price_min, parsedPrice.price_max]
        );
        console.log('✓ Estimate saved to database:', estimate);
      } catch (dbError) {
        console.error('❌ Error saving estimate to database:', dbError);
        // Continue anyway, still return the estimate
      }
    }

    res.json({ estimate, source: 'web-search', vehicleId });
  } catch (error) {
    console.error('Error getting estimate:', error);
    res.status(500).json({ error: 'Failed to get service estimate' });
  }
});

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
router.get('category/:category', async (req, res, next) => {
    const { category } = req.params;
    try {
        const services = await db.multi(
            'SELECT * FROM "Services" WHERE LOWER(category) = LOWER($1)',
            [category]
        );

        res.json({ services });
    } catch (err) {
        next(err);
    }
});

module.exports = router;

/* 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 */