const express = require('express');
const router = express.Router();
const Redis = require('ioredis');
const dayjs = require('dayjs');
const utc = require('dayjs/plugin/utc');
const timezone = require('dayjs/plugin/timezone');
const { createSchedule, deleteSchedule } = require('../amazon/amazonEventBridgeScheduler');

// Lazy-load client creation or provide an immediate lookup safely
const getRedisClient = () => {
    const key = process.env.REDIS_ACCESS_KEY;
    if (!key) {
        console.error("[REDIS ERROR] CRITICAL: Redis access key is missing from environment variables!");
    }
    return new Redis(`rediss://default:${key}@tight-feline-40242.upstash.io:6379`);
};

// Instantiate the live client 
const client = getRedisClient();

dayjs.extend(utc);
dayjs.extend(timezone);

router.post('/appointment', async (req, res) => {
    const { v4: uuidv4 } = await import('uuid');
    console.log('Storing appointment in cache: ', req.body)

    const appointmentId = uuidv4();
    const dataToPersist = {...req.body, "appointmentId": appointmentId}; // Add a unique appointmentId to the data
    console.log(`Generated appointmentId: ${appointmentId} for email: ${req.body.email}`);
    // Calculate the expiration date and time
    const appointmentDateTime = dayjs.tz(`${req.body.date} ${req.body.time}`, 'America/New_York');
    console.log(`Appointment date and time: ${appointmentDateTime.format()}`);

    // Add 5400 seconds (90 minutes)
    const expiryDateTime = appointmentDateTime.add(5400, 'second');
    console.log(`Appointment date and time AFTER: ${appointmentDateTime.format()}`);
    
    // Get Unix timestamp in seconds for Redis EXPIREAT
    const expiryUnix = expiryDateTime.unix();
    const key = `appointment:lock:${req.body.email}`
    try {
        // Await the result of the get call to check if key exists
        const existingRecord = await client.get(key);
        if (existingRecord) {
            res.status(409).json({ message: "Appointment already exists", data: JSON.parse(existingRecord) });
            return;
        }

        await client.set(key, JSON.stringify(dataToPersist));
        await client.expireat(key, expiryUnix);
        console.log(`Setting cache data for key ${key}`)
        res.status(200).json({ success: true, expiresAt: expiryDateTime.format() });


        // Call the amazon scheduler to create a task 
        console.log(`Calling amazon scheduler to create a task for appointment reminder: ${appointmentDateTime.format()}`)
        await createSchedule(appointmentId, req.body.email, appointmentDateTime.format(), req.body.phone, req.body.name);

    } catch (err) {
        console.log("Error storing in cache: ", err)
        res.status(500).json({ error: "Internal server error" });
    }
});

router.post("/user/appointment", async (req, res) => {
    // Fetch the appointment by email from the cache
    const key = `appointment:lock:${req.body.email}`;
    try {
        // Await the result of the get call to check if key exists
        const existingRecord = await client.get(key);
        if (existingRecord) {
            res.status(200).json({ success: true, appointment: JSON.parse(existingRecord) });
        } else {
            res.status(404).json({ success: false, message: "Appointment not found" });
        }
    } catch (err) {
        console.log("Error getting appointment in cache: ", err)
        res.status(500).json({ error: "Internal server error" });
    }
})

router.delete("/user/appointment", async (req, res) => {
    // Fetch the appointment by email from the cache
    const key = `appointment:lock:${req.body.email}`;
    try {

        const existingRecord = await client.get(key);

        if (!existingRecord) {
            res.status(404).json({ success: false, message: "Appointment not found" });
            return;
        }
        console.log(`Deleting appointment with ID: ${JSON.parse(existingRecord).appointmentId}`);
        await deleteSchedule(JSON.parse(existingRecord).appointmentId);

        // Delete the record from Redis
        await client.del(key);
        res.status(200).json({ success: true, message: "Appointment deleted successfully" });
    } catch (err) {
        console.log("Error deleting appointment in cache: ", err)
        res.status(500).json({ error: "Internal server error" });
    }
})

const storeOtpInCache = async (email, otp) => {
    const key = `otp:lock:${email}`;

    try {
        // Store the OTP in Redis with a 2-minute expiration
        await client.set(key, JSON.stringify({ otp: otp }), 'EX', 120);
        return { success: true, message: "OTP stored successfully" };
    } catch (err) {
        console.log("Error storing OTP in cache: ", err)
        return { success: false, error: "Internal server error" };
    }
}

module.exports = router;
module.exports.storeOtpInCache = storeOtpInCache;