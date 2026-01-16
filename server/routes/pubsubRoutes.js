const express = require('express');
const router = express.Router();
const { PubSub } = require('@google-cloud/pubsub');

// Initialize PubSub client
const pubSubClient = new PubSub();
const topicName = 'email-notification-dev';

router.post('/email-notification', async (req, res) => {
    console.log('in email notifcation endpoint')
    console.log(req.body)

    // Send message to pub sub topic here
    try {
        const dataBuffer = Buffer.from(JSON.stringify(req.body));
        const messageId = await pubSubClient.topic(topicName).publishMessage({ data: dataBuffer });
        console.log(`Message ${messageId} published.`);
        res.status(200).json({ success: true, message: 'Notification received', messageId });
    } catch (error) {
        console.error(`Error publishing to Pub/Sub: ${error.message}`);
        res.status(500).json({ success: false, error: 'Failed to publish message' });
    }
})

module.exports = router;