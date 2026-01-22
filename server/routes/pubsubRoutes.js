const express = require('express');
const router = express.Router();
const { PubSub } = require('@google-cloud/pubsub');

// Initialize PubSub client
const pubSubClient = new PubSub();
const topicName = 'email-notification-dev';

// Define your static list of internal emails here
// In a real production app, you might load this from process.env.ADMIN_EMAILS
const INTERNAL_CC_LIST = ['admin@apexautohub.com', 'support@apexautohub.com'];

router.post('/email-notification', async (req, res) => {
    console.log('in email notifcation endpoint')
    console.log(req.body)

    // Send message to pub sub topic here
    try {
        // Securely add the CC list here on the server side
        const notificationPayload = {
            ...req.body,
            ccEmail: INTERNAL_CC_LIST
        };
        const dataBuffer = Buffer.from(JSON.stringify(notificationPayload));
        const messageId = await pubSubClient.topic(topicName).publishMessage({ data: dataBuffer });
        console.log(`Message ${messageId} published.`);
        res.status(200).json({ success: true, message: 'Notification received', messageId });
    } catch (error) {
        console.error(`Error publishing to Pub/Sub: ${error.message}`);
        res.status(500).json({ success: false, error: 'Failed to publish message' });
    }
})

module.exports = router;