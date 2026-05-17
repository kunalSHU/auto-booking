#!/usr/bin/env node

/**
 * Overnight Batch Estimation Script
 *
 * Usage: node estimate_services_overnight.js [--make=Acura] [--limit=1]
 *
 * Processes one make per run to gradually estimate prices for all vehicles
 * Only estimates missing services and skips vehicles with existing estimates
 */

const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });

const db = require('../db');
const { estimateForVehicleOvernight } = require('../utils/estimationService');

// Configuration
const CONFIG = {
  VEHICLES_PER_RUN: parseInt(process.env.VEHICLES_PER_RUN || '1', 10),
  REGION: 'Ontario, Canada',
};

// Parse command line arguments
function parseArgs() {
  const args = {
    make: null,
    limit: CONFIG.VEHICLES_PER_RUN,
  };

  process.argv.slice(2).forEach(arg => {
    if (arg.startsWith('--make=')) {
      args.make = arg.split('=')[1];
    }
    if (arg.startsWith('--limit=')) {
      args.limit = parseInt(arg.split('=')[1], 10);
    }
  });

  return args;
}

/**
 * Get next batch of vehicles to estimate
 * Prioritizes vehicles with fewest existing estimates
 */
async function getVehiclesToProcess(limitCount, makeFilter = null) {
  try {
    let query = `
      SELECT
        v.vehicle_id,
        v.year,
        v.make,
        v.model,
        COALESCE(v.trim, '') as trim,
        COUNT(se.estimate_id) as estimate_count,
        (SELECT COUNT(*) FROM "Services" WHERE service_active = true) as total_services
      FROM "Vehicles" v
      LEFT JOIN "ServiceEstimates" se ON v.vehicle_id = se.vehicle_id AND se.region = $1
      WHERE v.year >= 2020
    `;

    const params = [CONFIG.REGION];

    if (makeFilter) {
      query += ` AND LOWER(v.make) = LOWER($${params.length + 1})`;
      params.push(makeFilter);
    }

    query += `
      GROUP BY v.vehicle_id, v.year, v.make, v.model, v.trim
      HAVING COUNT(se.estimate_id) < (SELECT COUNT(*) FROM "Services" WHERE service_active = true)
      ORDER BY estimate_count ASC, v.year DESC, v.make ASC, v.model ASC, v.trim ASC
      LIMIT $${params.length + 1}
    `;
    params.push(limitCount);

    const vehicles = await db.any(query, params);
    return vehicles;
  } catch (err) {
    console.error(`❌ Error getting vehicles: ${err.message}`);
    throw err;
  }
}

/**
 * Process a single vehicle
 */
async function processVehicle(vehicle, index, totalVehicles) {
  const displayName = `${vehicle.year} ${vehicle.make} ${vehicle.model} ${vehicle.trim}`;
  console.log(`\n${'='.repeat(80)}`);
  console.log(`[${index}/${totalVehicles}] Processing: ${displayName}`);
  console.log(`Current Estimates: ${vehicle.estimate_count}/${vehicle.total_services}`);
  console.log(`${'='.repeat(80)}`);

  try {
    const result = await estimateForVehicleOvernight(
      vehicle.vehicle_id,
      vehicle.year,
      vehicle.make,
      vehicle.model,
      vehicle.trim
    );

    console.log(`✅ Complete: ${result.saved}/${result.processed} estimates saved`);
    return { success: true, vehicle: vehicle.vehicle_id, saved: result.saved };
  } catch (err) {
    console.error(`❌ Failed: ${err.message}`);
    return { success: false, vehicle: vehicle.vehicle_id, error: err.message };
  }
}

/**
 * Main execution
 */
async function main() {
  const startTime = new Date();
  console.log(`\n🌙 Overnight Batch Estimation Script`);
  console.log(`Started: ${startTime.toISOString()}`);
  console.log(`Region: ${CONFIG.REGION}`);

  try {
    const args = parseArgs();

    console.log(`\n📋 Configuration:`);
    console.log(`  Vehicles per run: ${args.limit}`);
    if (args.make) console.log(`  Make filter: ${args.make}`);

    // Get vehicles to process
    console.log(`\n🔍 Finding vehicles to process...`);
    const vehicles = await getVehiclesToProcess(args.limit, args.make);

    if (vehicles.length === 0) {
      console.log(`ℹ️  No vehicles found needing estimation`);
      process.exit(0);
    }

    console.log(`\n✅ Found ${vehicles.length} vehicles to process`);

    // Process each vehicle
    const results = [];
    for (let i = 0; i < vehicles.length; i++) {
      const result = await processVehicle(vehicles[i], i + 1, vehicles.length);
      results.push(result);

      // Rate limiting between vehicles - longer delay to respect API limits
      if (i < vehicles.length - 1) {
        const delaySeconds = 5 + Math.random() * 5; // 5-10 seconds with randomness
        console.log(`\n⏳ Rate limiting: waiting ${delaySeconds.toFixed(1)}s before next vehicle...`);
        await new Promise(r => setTimeout(r, delaySeconds * 1000));
      }
    }

    // Summary
    const successful = results.filter(r => r.success);
    const totalSaved = results.reduce((sum, r) => sum + (r.saved || 0), 0);

    console.log(`\n${'='.repeat(80)}`);
    console.log(`📊 SUMMARY`);
    console.log(`${'='.repeat(80)}`);
    console.log(`Vehicles Processed: ${results.length}`);
    console.log(`Successful: ${successful.length}`);
    console.log(`Failed: ${results.length - successful.length}`);
    console.log(`Total Estimates Saved: ${totalSaved}`);
    console.log(`Duration: ${Math.round((new Date() - startTime) / 1000)}s`);

    if (results.length - successful.length > 0) {
      console.log(`\n⚠️  Failed vehicles:`);
      results
        .filter(r => !r.success)
        .forEach(r => console.log(`  - Vehicle ${r.vehicle}: ${r.error}`));
    }

    console.log(`\n✅ Overnight batch complete!`);
    process.exit(0);
  } catch (err) {
    console.error(`\n❌ Fatal error: ${err.message}`);
    console.error(err.stack);
    process.exit(1);
  }
}

main();
