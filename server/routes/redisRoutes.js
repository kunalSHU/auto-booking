const express = require('express');
const router = express.Router();
const Redis = require('ioredis');
const dayjs = require('dayjs');

const client = new Redis("rediss://default:123@tight-feline-40242.upstash.io:6379");

router.post('/appointment', async (req, res) => {
    console.log('Storing appointment in cache: ', req.body)
    
    // Calculate the expiration date and time
    const appointmentDateTime = dayjs(`${req.body.date} ${req.body.time}`);
    
    // Add 5400 seconds (90 minutes)
    const expiryDateTime = appointmentDateTime.add(5400, 'second');
    
    // Get Unix timestamp in seconds for Redis EXPIREAT
    const expiryUnix = expiryDateTime.unix();
    const key = `appointment:lock:${req.body.email}`
    try {
        // Await the result of the get call to check if key exists
        const existingRecord = await client.get(key);
        if (existingRecord) {
            res.status(409).json({ message: "Appointment already exists" });
            return;
        }

        await client.set(key, req.body);
        await client.set(key, JSON.stringify(req.body));
        await client.expireat(key, expiryUnix);
        console.log(`Setting cache data for key ${key}`)
        res.status(200).json({ success: true, expiresAt: expiryDateTime.format() });
    } catch (err) {
        console.log("Error storing in cache: ", err)
        res.status(500).json({ error: "Internal server error" });
    }
    client.close();
});

module.exports = router;