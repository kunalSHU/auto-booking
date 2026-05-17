/**
 * Centralized Estimation Service
 * Handles batching, AI calls, database operations, and logging
 * Used by both real-time and overnight estimation flows
 */

const db = require('../db');
const { getGeminiBulkEstimates } = require('./geminiEstimator');
const { getMockBulkEstimates } = require('./mockEstimator');

// Track concurrent estimation jobs per vehicle to prevent duplicate requests
// Key: vehicleId, Value: Promise of the estimation job
const activeEstimationJobs = new Map();

// Track rate limiting to add longer cooldowns after 429 errors
let lastRateLimitTime = null;
const RATE_LIMIT_COOLDOWN_MS = 1000; // 2 seconds cooldown after hitting 429

const CONFIG = {
  BATCH_SIZE: 10,  // Reduced to 10 for Gemini free tier (5 requests/minute) - allows ~2 mins per vehicle
  MARGIN: 10,
  REGION: 'Ontario, Canada',
  MAX_RETRIES: 1,
  RETRY_DELAY_MS: 15000, // 15 seconds between batches (5 requests/minute = 1 every 12s)
};

/**
 * Log estimation attempt for auditing
 */
async function logEstimation(vehicleId, serviceId, method, batchNum, totalBatches, status, errorMessage = null, retryCount = 0) {
  try {
    await db.none(
      `INSERT INTO "EstimationLogs" (vehicle_id, service_id, estimation_method, batch_number, total_batches, status, error_message, retry_count, created_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW())`,
      [vehicleId, serviceId, method, batchNum, totalBatches, status, errorMessage, retryCount]
    );
  } catch (err) {
    console.error(`Failed to log estimation: ${err.message}`);
  }
}

/**
 * Get next batch of missing services for a vehicle (fresh query each time)
 * This prevents skipped services by fetching fresh from DB each call
 * Returns array of {service_id, name} - limited to BATCH_SIZE
 */
async function getNextMissingServicesBatch(vehicleId) {
  try {
    const missing = await db.any(
      `SELECT s.service_id, s.name
       FROM "Services" s
       WHERE s.service_active = true
         AND s.service_id NOT IN (
           SELECT se.service_id
           FROM "ServiceEstimates" se
           WHERE se.vehicle_id = $1 AND se.region = $2
         )
       ORDER BY s.service_id ASC
       LIMIT $3`,
      [vehicleId, CONFIG.REGION, CONFIG.BATCH_SIZE]
    );
    return missing;
  } catch (err) {
    console.error(`Error getting next missing services: ${err.message}`);
    throw err;
  }
}

/**
 * Batch services intelligently
 * If <= 35 (BATCH_SIZE + MARGIN): 1 batch
 * If > 35: ceil(count / BATCH_SIZE) batches
 */
function createBatches(services) {
  const threshold = CONFIG.BATCH_SIZE + CONFIG.MARGIN;

  if (services.length <= threshold) {
    return [services];
  }

  const batchCount = Math.ceil(services.length / CONFIG.BATCH_SIZE);
  const batches = [];

  for (let i = 0; i < batchCount; i++) {
    const start = i * CONFIG.BATCH_SIZE;
    const end = Math.min(start + CONFIG.BATCH_SIZE, services.length);
    batches.push(services.slice(start, end));
  }

  return batches;
}

/**
 * Call AI to estimate prices for a batch of services
 * Includes retry logic and rate limit cooldown handling
 */
async function estimateWithAI(year, make, model, trim, serviceNames, batchNum, totalBatches, vehicleId, method) {
  // Check if we're in rate limit cooldown
  if (lastRateLimitTime) {
    const timeSinceLimit = Date.now() - lastRateLimitTime;
    if (timeSinceLimit < RATE_LIMIT_COOLDOWN_MS) {
      const remainingWait = RATE_LIMIT_COOLDOWN_MS - timeSinceLimit;
      console.log(`⏳ [${method}] Rate limit cooldown active. Waiting ${Math.ceil(remainingWait / 1000)}s more...`);
      await new Promise(r => setTimeout(r, remainingWait));
      lastRateLimitTime = null; // Reset after cooldown
    }
  }

  let retryCount = 0;

  while (retryCount <= CONFIG.MAX_RETRIES) {
    try {
      console.log(`📡 [${method}] Batch ${batchNum}/${totalBatches}: Requesting AI estimates for ${serviceNames.length} services (Attempt ${retryCount + 1})`);

      const results = await getMockBulkEstimates(year, make, model, trim, serviceNames);

      if (!results || !Array.isArray(results) || results.length === 0) {
        throw new Error('AI returned no results');
      }

      console.log(`✅ [${method}] Batch ${batchNum}/${totalBatches}: Received ${results.length} estimates`);

      // Log success
      await logEstimation(vehicleId, null, method, batchNum, totalBatches, 'completed', null, retryCount);

      return results;
    } catch (err) {
      const errorMsg = err.message || '';
      const isRateLimit = errorMsg.includes('429') || errorMsg.includes('quota') || errorMsg.includes('Rate limited');

      if (isRateLimit) {
        // Record rate limit hit for cooldown
        lastRateLimitTime = Date.now();
        console.error(`❌ [${method}] Batch ${batchNum}/${totalBatches}: RATE LIMITED (429) - activating ${RATE_LIMIT_COOLDOWN_MS / 1000}s cooldown`);

        // Log final failure on rate limit (don't retry)
        await logEstimation(vehicleId, null, method, batchNum, totalBatches, 'failed', 'Rate limited (429)', retryCount);
        return null;
      }

      retryCount++;
      console.error(`❌ [${method}] Batch ${batchNum}/${totalBatches}: Attempt ${retryCount} failed - ${err.message}`);

      if (retryCount > CONFIG.MAX_RETRIES) {
        // Log final failure
        await logEstimation(vehicleId, null, method, batchNum, totalBatches, 'failed', err.message, retryCount);
        return null; // Return null to signal failure
      }

      // Wait before retrying
      await new Promise(r => setTimeout(r, CONFIG.RETRY_DELAY_MS));
    }
  }
}

/**
 * Save estimates to database
 * Returns count of successfully saved estimates
 */
async function saveEstimates(vehicleId, serviceMap, aiResults, method) {
  let savedCount = 0;

  for (const result of aiResults) {
    try {
      const serviceName = result.service_name.toLowerCase();
      const serviceId = serviceMap[serviceName];

      if (!serviceId) {
        console.warn(`⚠️  Service not found: ${result.service_name}`);
        continue;
      }

      const laborCost = parseFloat(result.labor_cost) || 0;
      const partsCost = parseFloat(result.parts_cost) || 0;
      const priceMin = parseFloat(result.price_min) || 0;
      const priceMax = parseFloat(result.price_max) || 0;
      const totalPrice = laborCost + partsCost;

      await db.none(
        `INSERT INTO "ServiceEstimates"
          (service_id, vehicle_id, region, estimation_status, estimation_method, labor_cost, parts_cost, price_min, price_max, total_price, created_at, updated_at)
         VALUES ($1, $2, $3, 'completed', $4, $5, $6, $7, $8, $9, NOW(), NOW())
         ON CONFLICT (vehicle_id, service_id, region) DO UPDATE SET
           estimation_status = EXCLUDED.estimation_status,
           estimation_method = EXCLUDED.estimation_method,
           labor_cost = EXCLUDED.labor_cost,
           parts_cost = EXCLUDED.parts_cost,
           price_min = EXCLUDED.price_min,
           price_max = EXCLUDED.price_max,
           total_price = EXCLUDED.total_price,
           updated_at = NOW()
         WHERE "ServiceEstimates".manual_checked = false`,
        [serviceId, vehicleId, CONFIG.REGION, method, laborCost, partsCost, priceMin, priceMax, totalPrice]
      );

      savedCount++;
    } catch (err) {
      console.error(`Error saving estimate for ${result.service_name}: ${err.message}`);
    }
  }

  return savedCount;
}

/**
 * Get all estimates for a vehicle (for displaying to user)
 */
async function getVehicleEstimates(vehicleId) {
  try {
    const estimates = await db.any(
      `SELECT s.name, se.price_min, se.price_max, se.total_price, se.estimation_status
       FROM "ServiceEstimates" se
       JOIN "Services" s ON se.service_id = s.service_id
       WHERE se.vehicle_id = $1 AND se.region = $2
       ORDER BY s.name ASC`,
      [vehicleId, CONFIG.REGION]
    );

    const result = {};
    estimates.forEach(e => {
      result[e.name] = {
        min: e.price_min,
        max: e.price_max,
        total: e.total_price,
        status: e.estimation_status,
      };
    });

    return result;
  } catch (err) {
    console.error(`Error getting vehicle estimates: ${err.message}`);
    throw err;
  }
}

/**
 * Main real-time estimation flow
 * Called from /api/services/estimate endpoint
 *
 * Prevents concurrent duplicate jobs: if a job for this vehicle is already running,
 * subsequent requests will wait for it to complete instead of starting a new one.
 *
 * Fetches fresh batches each time to prevent skipped services.
 */
async function estimateForVehicleRealtime(vehicleId, year, make, model, trim) {
  // Check if a job is already running for this vehicle
  if (activeEstimationJobs.has(vehicleId)) {
    console.log(`⏳ [REALTIME] Job already running for vehicle ${vehicleId}, waiting for existing job...`);
    return await activeEstimationJobs.get(vehicleId);
  }

  // Create the estimation job
  const jobPromise = (async () => {
    try {
      console.log(`🚀 [REALTIME] Starting estimation for vehicle ${vehicleId} (${year} ${make} ${model} ${trim})`);

      const newEstimates = [];
      let batchNum = 0;
      let totalProcessed = 0;

      // Keep fetching next batch until none left
      while (true) {
        // Fetch fresh batch from DB
        const batch = await getNextMissingServicesBatch(vehicleId);

        if (batch.length === 0) {
          console.log(`✅ [REALTIME] All services estimated for vehicle ${vehicleId}`);
          break;
        }

        batchNum++;
        totalProcessed += batch.length;
        console.log(`📋 [REALTIME] Batch ${batchNum}: Found ${batch.length} missing services (total processed: ${totalProcessed})`);

        // Create service name to ID map for this batch
        const serviceMap = {};
        batch.forEach(s => {
          serviceMap[s.name.toLowerCase()] = s.service_id;
        });

        const serviceNames = batch.map(s => s.name);
        const aiResults = await estimateWithAI(year, make, model, trim, serviceNames, batchNum, '?', vehicleId, 'realtime');

        if (aiResults) {
          const savedCount = await saveEstimates(vehicleId, serviceMap, aiResults, 'realtime');
          newEstimates.push(...aiResults);
          console.log(`💾 [REALTIME] Batch ${batchNum}: Saved ${savedCount}/${batch.length} estimates`);
        } else {
          console.error(`⚠️  [REALTIME] Batch ${batchNum}: Failed to get AI results, skipping batch`);
        }

        // Rate limiting between batches (short delay)
        await new Promise(r => setTimeout(r, 1000));
      }

      const estimates = await getVehicleEstimates(vehicleId);
      console.log(`✅ [REALTIME] Estimation complete for vehicle ${vehicleId}. Processed ${totalProcessed} services in ${batchNum} batch(es)`);

      return { estimates, newEstimates };
    } catch (err) {
      console.error(`❌ [REALTIME] Error in realtime estimation: ${err.message}`);
      throw err;
    } finally {
      // Clean up the job tracker when done
      activeEstimationJobs.delete(vehicleId);
    }
  })();

  // Store the job promise so concurrent requests can await it
  activeEstimationJobs.set(vehicleId, jobPromise);

  return jobPromise;
}

/**
 * Main overnight estimation flow
 * Called from estimate_services.sh
 */
async function estimateForVehicleOvernight(vehicleId, year, make, model, trim) {
  try {
    console.log(`🌙 [OVERNIGHT] Starting estimation for vehicle ${vehicleId} (${year} ${make} ${model} ${trim})`);

    let batchNum = 0;
    let totalSaved = 0;

    // Keep fetching next batch until none left
    while (true) {
      // Fetch fresh batch from DB
      const batch = await getNextMissingServicesBatch(vehicleId);

      if (batch.length === 0) {
        console.log(`✅ [OVERNIGHT] All services estimated for vehicle ${vehicleId}`);
        break;
      }

      batchNum++;
      console.log(`📋 [OVERNIGHT] Batch ${batchNum}: Found ${batch.length} missing services`);

      // Create service name to ID map for this batch
      const serviceMap = {};
      batch.forEach(s => {
        serviceMap[s.name.toLowerCase()] = s.service_id;
      });

      const serviceNames = batch.map(s => s.name);
      const aiResults = await estimateWithAI(year, make, model, trim, serviceNames, batchNum, '?', vehicleId, 'overnight');

      if (aiResults) {
        const savedCount = await saveEstimates(vehicleId, serviceMap, aiResults, 'overnight');
        totalSaved += savedCount;
        console.log(`💾 [OVERNIGHT] Batch ${batchNum}: Saved ${savedCount}/${batch.length} estimates`);
      } else {
        console.error(`⚠️  [OVERNIGHT] Batch ${batchNum}: Failed to get AI results, skipping batch`);
      }

      // Rate limiting between batches
      await new Promise(r => setTimeout(r, 1000));
    }

    console.log(`✅ [OVERNIGHT] Estimation complete for vehicle ${vehicleId}. Saved ${totalSaved} estimates in ${batchNum} batch(es)`);
    return { processed: totalSaved, saved: totalSaved };
  } catch (err) {
    console.error(`❌ [OVERNIGHT] Error in overnight estimation: ${err.message}`);
    throw err;
  }
}

module.exports = {
  estimateForVehicleRealtime,
  estimateForVehicleOvernight,
  getVehicleEstimates,
  CONFIG,
};
