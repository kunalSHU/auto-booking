const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const { sendEmail } = require('../subscribers/notificationSubscriber');
const {storeOtpInCache} = require('./redisRoutes');

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

module.exports = router;