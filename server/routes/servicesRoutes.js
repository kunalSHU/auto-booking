const db = require('../db');
const express = require('express');
const router = express.Router();

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

// POST /api/services/estimate - Get AI estimate for a service
router.post('/estimate', async (req, res) => {
  const { vehicle, serviceTitle } = req.body;

  if (!vehicle || !serviceTitle) {
    return res.status(400).json({ error: 'Vehicle and service title are required' });
  }

  try {
    // Get or create vehicle and get vehicle_id
    const vehicleId = await getOrCreateVehicle(vehicle);

    // Check if estimate already exists in database using vehicle_id
    const existingEstimate = await db.oneOrNone(
      'SELECT * FROM "ServiceEstimates" WHERE service_id = $1 AND vehicle_id = $2',
      [serviceTitle, vehicleId]
    );

    if (existingEstimate) {
      const estimate = `$${existingEstimate.price_min}-${existingEstimate.price_max}`;
      console.log('Estimate found in database:', estimate);
      return res.json({ estimate, source: 'database', vehicleId });
    }

    // Get estimate from AI if not in database
    const apiKey = process.env.openai_key;
    if (!apiKey) {
      return res.status(500).json({ error: 'API key not configured' });
    }

    const prompt = `You are an automotive service pricing expert. Provide a realistic cost estimate for the following service in city of Mississauga, Ontario Canada.
Service: ${serviceTitle}
Vehicle: ${vehicle.year} ${vehicle.make} ${vehicle.model} ${vehicle.trim || ''}

Provide ONLY a price range in the format "$XX-YY" (e.g., "$45-65"). Nothing else. Just the price range.`;

    console.log('AI Prompt:', prompt);

    const response = await fetchWithTimeout(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          // model: 'meta-llama/llama-3.3-70b-instruct:free',
          // model: 'openai/gpt-oss-120b:free',
          model: 'deepseek/deepseek-r1-0528:free',
          // model: 'z-ai/glm-4.5-air:free',
          // model: 'openai/gpt-oss-20b:free',
          messages: [
            {
              role: 'user',
              content: prompt,
            },
          ],
        }),
      },
      30000 // 30 second timeout for AI API
    );

    if (!response.ok) {
      const errorData = await response.text();
      console.error('OpenRouter API error:', errorData);
      return res.status(response.status).json({ error: 'Failed to get estimate from AI' });
    }

    const data = await response.json();
    const estimate = data.choices?.[0]?.message?.content?.trim();

    if (!estimate) {
      return res.status(500).json({ error: 'No estimate generated' });
    }

    // Parse and save estimate to database using vehicle_id
    const parsedPrice = parsePriceEstimate(estimate);
    if (parsedPrice) {
      try {
        await db.none(
          'INSERT INTO "ServiceEstimates" (service_id, vehicle_id, price_min, price_max, created_at, updated_at) VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)',
          [serviceTitle, vehicleId, parsedPrice.price_min, parsedPrice.price_max]
        );
        console.log('Estimate saved to database:', estimate);
      } catch (dbError) {
        console.error('Error saving estimate to database:', dbError);
        // Continue anyway, still return the estimate
      }
    }

    res.json({ estimate, source: 'ai', vehicleId });
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