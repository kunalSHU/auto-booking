const express = require('express');
const router = express.Router();
const Redis = require('ioredis');
const crypto = require('crypto');
const { sendEmail } = require('../subscribers/notificationSubscriber');
const {storeOtpInCache} = require('./redisRoutes');

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

router.post('/generate', async (req, res) => {

    // Generate a random 6-digit OTP
    const otp = crypto.randomInt(100000, 999999).toString();
    const payload = {
        subject: "Your OTP",
        message: `Your OTP is: ${otp}`,
        pii: {
            toEmail: req.body.email
        }
    };

    sendEmail(payload); // Assuming the email is sent in the request body
    await storeOtpInCache(req.body.email, otp); // Store the OTP in Redis with a 2-minute expiration

    res.status(200).json({ message: "OTP generated successfully" });
})

router.post('/verify', async (req, res) => {
    const { email, otp } = req.body;
    const key = `otp:lock:${email}`;

    try {
        const cachedData = await client.get(key);
        if (!cachedData) {
            return res.status(400).json({ success: false, message: "OTP expired or not found" });
        }

        const { otp: cachedOtp } = JSON.parse(cachedData);

        if (cachedOtp === otp) {
            // OTP is valid, delete it from cache
            await client.del(key);
            return res.status(200).json({ success: true, message: "OTP verified successfully" });
        } else {
            return res.status(400).json({ success: false, message: "Invalid OTP" });
        }
    } catch (err) {
        console.log("Error verifying OTP in cache: ", err)
        res.status(500).json({ error: "Internal server error" });
    }
});

module.exports = router;