const db = require('../db');
const express = require('express');
const router = express.Router();
const { estimateForVehicleRealtime } = require('../utils/estimationService');

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

    console.log('✅ New vehicle created with ID:', newVehicle.vehicle_id);
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

// POST /api/services/estimate - Get price estimates (real-time estimation)
// Checks for missing estimates and triggers AI estimation for only those services
router.post('/estimate', async (req, res) => {
  const { vehicle } = req.body;

  if (!vehicle) {
    return res.status(400).json({ error: 'Vehicle information is required' });
  }

  try {
    // Step 1: Get or create vehicle
    console.log(`🔍 Looking up vehicle: ${vehicle.year} ${vehicle.make} ${vehicle.model} ${vehicle.trim}`);
    const vehicleId = await getOrCreateVehicle(vehicle);
    console.log(`✅ Vehicle ID: ${vehicleId}`);

    // Step 2: Start estimation (runs in background for missing services)
    const { estimates } = await estimateForVehicleRealtime(
      vehicleId,
      vehicle.year,
      vehicle.make,
      vehicle.model,
      vehicle.trim || ''
    );

    // Step 3: Format response
    const formattedEstimates = {};
    for (const [serviceName, data] of Object.entries(estimates)) {
      formattedEstimates[serviceName] = `$${Math.round(data.min)}-${Math.round(data.max)}`;
    }

    res.json({
      vehicleId,
      estimates: formattedEstimates,
      source: 'real-time-estimation',
    });
  } catch (error) {
    console.error('❌ Error in estimate endpoint:', error);
    res.status(500).json({ error: 'Failed to process estimates' });
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