const db = require('../db');
const express = require('express');
const router = express.Router();
const { getPerplexityEstimate, getPerplexityBulkEstimates } = require('../utils/perplexityEstimator');

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
      setTimeout(() => reject(new Error(`Request timeout after ${timeoutMs}ms`)), timeoutMs)
    ),
  ]);
};

// Helper function to parse price estimate from string like "$45-65"
const parsePriceEstimate = (estimateString) => {
  if (!estimateString) return null;
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
      'SELECT vehicle_id FROM "Vehicles" WHERE make = $1 AND model = $2 AND year = $3 AND (trim = $4 OR ($4 = \'\' AND trim IS NULL))',
      [vehicle.make, vehicle.model, parseInt(vehicle.year, 10), vehicle.trim || '']
    );

    if (existingBySpecs) {
      return existingBySpecs.vehicle_id;
    }

    // Create new vehicle (user_id is NULL for now, can be linked later when user logs in)
    const newVehicle = await db.one(
      'INSERT INTO "Vehicles" (vin_number, make, model, year, trim, created_at) VALUES ($1, $2, $3, $4, $5, CURRENT_TIMESTAMP) RETURNING vehicle_id',
      [vehicle.vin || null, vehicle.make, vehicle.model, parseInt(vehicle.year, 10), vehicle.trim || '']
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

// POST /api/services/estimate - Get price estimate (Bulk filling enabled)
router.post('/estimate', async (req, res) => {
  const { vehicle, serviceTitle } = req.body;

  if (!vehicle || !serviceTitle) {
    return res.status(400).json({ error: 'Vehicle and service title are required' });
  }

  try {
    const vehicleId = await getOrCreateVehicle(vehicle);
    const dbServiceName = serviceNameMap[serviceTitle] || serviceTitle;

    // 1. Fetch all existing estimates for this car to return to frontend
    const existingEstimates = await db.any(`
      SELECT s.name, se.price_min, se.price_max
      FROM "ServiceEstimates" se
      JOIN "Services" s ON se.service_id = s.service_id
      WHERE se.vehicle_id = $1 AND se.region = 'Ontario, Canada'
    `, [vehicleId]);

    const allEstimates = {};
    const reversedMap = Object.entries(serviceNameMap).reduce((acc, [fe, db]) => {
      acc[db] = fe;
      return acc;
    }, {});

    existingEstimates.forEach(e => {
      const frontendName = reversedMap[e.name] || e.name;
      allEstimates[frontendName] = `$${Math.round(e.price_min)}-${Math.round(e.price_max)}`;
    });

    // 2. Identify missing services for proactive bulk fetch
    console.log(`Checking for missing estimates for ${vehicle.year} ${vehicle.make} ${vehicle.model} (${vehicleId})`);
    
    const missingServices = await db.any(`
      SELECT s.service_id, s.name 
      FROM "Services" s
      LEFT JOIN "ServiceEstimates" se ON s.service_id = se.service_id 
        AND se.vehicle_id = $1 
        AND se.region = 'Ontario, Canada'
      WHERE s.service_active = true AND se.estimate_id IS NULL
    `, [vehicleId]);

    // If everything is already estimated, return early with cached data
    if (missingServices.length === 0) {
      console.log('✓ All services already estimated for this vehicle.');
      const requestedEstimate = allEstimates[serviceTitle] || 'Quote';
      return res.json({ 
        estimate: requestedEstimate, 
        allEstimates,
        source: 'database', 
        vehicleId 
      });
    }

    // 3. Single Batch Fetch (Progressive)
    const serviceNames = missingServices.map(s => s.name);
    
    // Process one batch of 25 per request for speed and reliability
    const BATCH_SIZE = 25;
    const batchServices = serviceNames.slice(0, BATCH_SIZE);
    
    console.log(`📦 AI Batch: Processing 25 of ${serviceNames.length} missing services...`);

    const aiResults = await getPerplexityBulkEstimates(
      vehicle.year, vehicle.make, vehicle.model, vehicle.trim, batchServices
    );
      
    if (!aiResults || !Array.isArray(aiResults)) {
      return res.status(500).json({ error: 'Failed to get estimates from AI' });
    }

    // 4. Persist AI results to database
    for (const result of aiResults) {
      const svc = missingServices.find(s => s.name.toLowerCase() === result.service_name.toLowerCase());
      if (svc) {
        try {
          await db.none(`
            INSERT INTO "ServiceEstimates" 
              (service_id, vehicle_id, region, labor_cost, parts_cost, price_min, price_max, total_price, created_at, updated_at)
            VALUES ($1, $2, 'Ontario, Canada', $3, $4, $5, $6, $7, NOW(), NOW())
            ON CONFLICT (vehicle_id, service_id, region) DO UPDATE SET
              labor_cost = EXCLUDED.labor_cost,
              parts_cost = EXCLUDED.parts_cost,
              price_min = EXCLUDED.price_min,
              price_max = EXCLUDED.price_max,
              total_price = EXCLUDED.total_price,
              updated_at = NOW()
            WHERE "ServiceEstimates".manual_checked = false
          `, [
            svc.service_id, vehicleId, 
            result.labor_cost, result.parts_cost, 
            result.price_min, result.price_max, 
            (Number(result.labor_cost) + Number(result.parts_cost))
          ]);
          
          const frontendName = reversedMap[svc.name] || svc.name;
          allEstimates[frontendName] = `$${Math.round(result.price_min)}-${Math.round(result.price_max)}`;
        } catch (dbErr) {
          console.error(`Error saving ${svc.name}:`, dbErr.message);
        }
      }
    }

    const requestedEstimate = allEstimates[serviceTitle] || 'Quote';
    res.json({ 
      estimate: requestedEstimate, 
      allEstimates, 
      source: 'web-search-bulk', 
      vehicleId 
    });

  } catch (error) {
    console.error('Error in bulk estimate route:', error);
    res.status(500).json({ error: 'Failed to process bulk estimates' });
  }
});

// GET /api/services/list - Get all active services with their questions/answers
router.get('/', async (req, res) => {
    try {
        const servicesData = await db.any(`
            SELECT 
                s.service_id, s.category, s.name, s.description, s.service_active,
                q.question_id, q.question_text, q.question_order,
                a.answer_id, a.answer_text, a.is_option, a.answer_order
            FROM "Services" s
            LEFT JOIN "PopupQuestions" q ON s.service_id = q.service_id
            LEFT JOIN "PopupAnswers" a ON q.question_id = a.question_id
            WHERE s.service_active = true
            ORDER BY s.category, s.name, q.question_order, a.answer_order
        `);

        // Group services, questions, and answers
        const servicesMap = {};
        servicesData.forEach(row => {
            if (!servicesMap[row.service_id]) {
                servicesMap[row.service_id] = {
                    id: row.service_id,
                    cat: row.category,
                    name: row.name,
                    desc: row.description,
                    questions: []
                };
            }

            if (row.question_id) {
                let q = servicesMap[row.service_id].questions.find(quest => quest.id === row.question_id);
                if (!q) {
                    q = {
                        id: row.question_id,
                        text: row.question_text,
                        order: row.question_order,
                        type: row.is_option ? 'select' : 'text', // Simplistic heuristic
                        options: []
                    };
                    servicesMap[row.service_id].questions.push(q);
                }

                if (row.answer_id && row.is_option) {
                    q.type = 'select'; // If it has options, it's a select
                    if (!q.options.includes(row.answer_text)) {
                        q.options.push(row.answer_text);
                    }
                } else if (row.answer_id) {
                    q.type = 'text'; // Fallback
                }
            }
        });

        res.json({ services: Object.values(servicesMap) });
    } catch (err) {
        console.error('Error fetching services list:', err);
        res.status(500).json({ error: 'Failed to fetch services' });
    }
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