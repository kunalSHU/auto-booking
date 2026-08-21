const express = require('express');
const router = express.Router();
const { PubSub } = require('@google-cloud/pubsub');

let pubsubOptions = {
  projectId: process.env.GCP_PROJECT_ID || 'auto-booking-461719'
};

// If running in production on Render, decode the Base64 environment string into a JSON object
if (process.env.GCP_CREDS_BASE64) {
  const decryptedJsonString = Buffer.from(process.env.GCP_CREDS_BASE64, 'base64').toString('ascii');
  pubsubOptions.credentials = JSON.parse(decryptedJsonString);
}

// Initialize PubSub client
const pubSubClient = new PubSub(pubsubOptions);
const emailTopicName = 'email-notification-dev';
const smsTopicName = 'sms-notification-dev';

// Define your static list of internal emails here
const INTERNAL_CC_LIST = process.env.ADMIN_EMAIL_CC ? process.env.ADMIN_EMAIL_CC.split(',') : [];

router.post('/email-notification', async (req, res) => {
    console.log('in email notifcation endpoint')
    console.log(req.body)

    // Securely add the CC list here on the server side
    const notificationPayload = {
        ...req.body,
        ccEmail: INTERNAL_CC_LIST
    };
    const dataBuffer = Buffer.from(JSON.stringify(notificationPayload));
    publishToTopic(emailTopicName, dataBuffer, res);
})

router.post('/sms-notification', async (req, res) => {
    console.log('in sms notifcation endpoint')
    console.log(req.body)

    // Send message to pub sub topic here
    const notificationPayload = {
        ...req.body
    };
    const dataBuffer = Buffer.from(JSON.stringify(notificationPayload));
    publishToTopic(smsTopicName, dataBuffer, res);
})

const publishToTopic = async (topicName, dataBuffer, res) => {
    // Send message to pub sub topic here
    try {
        // Would need to publish 3 messages (customer, technician and booking email)
        // notification payload would need to change so we set the msg to the proper email template based on the msg key
        // only metadata information is recieved from the api call
        const messageId = await pubSubClient.topic(topicName).publishMessage({ data: dataBuffer });
        console.log(`Message ${messageId} published.`);
        res.status(200).json({ success: true, message: 'Notification received', messageId });
    } catch (error) {
        console.error(`Error publishing to Pub/Sub: ${error.message}`);
        res.status(500).json({ success: false, error: 'Failed to publish message' });
    }
}

module.exports = router;