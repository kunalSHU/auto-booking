/**
 * Mock Price Estimator - Returns random realistic prices for testing
 * No API calls, no rate limits - perfect for testing batch processing and frontend
 */

const fs = require('fs');
const path = require('path');

// Ensure logs directory exists
const logsDir = path.join(__dirname, '..', 'logs', 'mock');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

// Helper function to create timestamped log file
const getLogFile = () => {
  const date = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
  return path.join(logsDir, `mock-estimates-${date}.log`);
};

// Helper function to log data
const logToFile = (label, data) => {
  const timestamp = new Date().toISOString();
  const logFile = getLogFile();
  const logEntry = `\n[${timestamp}] ${label}\n${typeof data === 'string' ? data : JSON.stringify(data, null, 2)}\n${'='.repeat(80)}`;

  try {
    fs.appendFileSync(logFile, logEntry);
  } catch (err) {
    console.error('Failed to write to log file:', err.message);
  }
};

/**
 * Generate realistic random prices for automotive services
 */
const generateRandomPrice = (serviceName) => {
  // Service name patterns and their typical price ranges
  const patterns = {
    'oil': { laborMin: 40, laborMax: 80, partsMin: 20, partsMax: 60 },
    'tire': { laborMin: 30, laborMax: 60, partsMin: 0, partsMax: 100 },
    'brake': { laborMin: 100, laborMax: 300, partsMin: 100, partsMax: 400 },
    'filter': { laborMin: 20, laborMax: 50, partsMin: 15, partsMax: 60 },
    'battery': { laborMin: 0, laborMax: 50, partsMin: 100, partsMax: 250 },
    'fluid': { laborMin: 20, laborMax: 60, partsMin: 30, partsMax: 100 },
    'inspection': { laborMin: 50, laborMax: 150, partsMin: 0, partsMax: 50 },
    'alignment': { laborMin: 60, laborMax: 150, partsMin: 0, partsMax: 50 },
    'diagnostic': { laborMin: 80, laborMax: 200, partsMin: 0, partsMax: 0 },
    'km': { laborMin: 50, laborMax: 300, partsMin: 50, partsMax: 500 }, // maintenance intervals
    'wash': { laborMin: 15, laborMax: 50, partsMin: 0, partsMax: 20 },
    'conditioning': { laborMin: 50, laborMax: 150, partsMin: 20, partsMax: 100 },
  };

  // Find matching pattern from service name
  let selected = { laborMin: 50, laborMax: 150, partsMin: 30, partsMax: 100 }; // default

  const lowerName = serviceName.toLowerCase();
  for (const [key, range] of Object.entries(patterns)) {
    if (lowerName.includes(key)) {
      selected = range;
      break;
    }
  }

  // Generate random values
  const labor = Math.floor(Math.random() * (selected.laborMax - selected.laborMin + 1) + selected.laborMin);
  const parts = Math.floor(Math.random() * (selected.partsMax - selected.partsMin + 1) + selected.partsMin);
  const priceMin = labor + parts;
  const priceMax = Math.floor(priceMin * (1 + Math.random() * 0.3)); // 0-30% markup

  return {
    service_name: serviceName,
    labor_cost: labor,
    parts_cost: parts,
    price_min: priceMin,
    price_max: priceMax,
  };
};

/**
 * Get mock bulk price estimates for multiple services
 * Generates random realistic prices instantly (no API calls)
 * @returns Array of objects: { service_name, labor_cost, parts_cost, price_min, price_max }
 */
const getMockBulkEstimates = async (year, make, model, trim, services) => {
  try {
    const serviceList = services.join(', ');
    const logData = `Vehicle: ${year} ${make} ${model} ${trim || 'N/A'}\n\nServices (${services.length}): ${serviceList}`;

    logToFile(`MOCK REQUEST FOR ${services.length} SERVICES`, logData);

    console.log(`📝 [MOCK] Generating estimates for ${services.length} services...`);

    // Simulate a tiny delay to feel realistic
    await new Promise(r => setTimeout(r, Math.random() * 200 + 100));

    // Generate random prices for each service
    const results = services.map(serviceName => generateRandomPrice(serviceName));

    logToFile(`MOCK RESPONSE - GENERATED ${results.length} ESTIMATES`, results);
    console.log(`✓ [MOCK] Successfully generated ${results.length} random estimates.`);

    return results;
  } catch (error) {
    const errorMsg = `Error in getMockBulkEstimates: ${error.message}`;
    console.error('❌', errorMsg);
    logToFile('ERROR', errorMsg);
    return null;
  }
};

module.exports = {
  getMockBulkEstimates,
};
