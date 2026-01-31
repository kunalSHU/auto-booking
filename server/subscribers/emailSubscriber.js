const { PubSub } = require('@google-cloud/pubsub');
const { SESClient, SendEmailCommand } = require('@aws-sdk/client-ses'); // ES Modules import
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const pubSubClient = new PubSub();
const subscriptionName = 'email-notification-dev-sub';

// Verify credentials are loaded
if (!process.env.AWS_ACCESS_KEY_ID || !process.env.AWS_SECRET_ACCESS_KEY) {
    console.error('[Email Worker] CRITICAL: AWS Credentials not found in environment variables!');
}

const config = {
    region: 'us-east-1', // Ensure this matches the region where you verified your email
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
    }
}; // type is SESClientConfig
const client = new SESClient(config);

const listenForMessages = () => {
    // References an existing subscription
    const subscription = pubSubClient.subscription(subscriptionName);

    // Create an event handler to handle messages
    const messageHandler = async (message) => {
        console.log(`[Email Worker] Received message ${message.id}:`);

        try {
            const dataString = message.data.toString();
            const payload = JSON.parse(dataString);

            console.log(`\tProcessing email for: ${payload.toEmail}`);
            if (payload.ccEmail && payload.ccEmail.length > 0) {
                console.log(`\tCCing: ${payload.ccEmail.join(', ')}`);
            }
            console.log(`\tSubject: ${payload.subject}`);

            try {
                const response = await sendEmailLogic(payload);
                console.log(`\tEmail sent successfully to ${payload.toEmail}! Message ID:`, response.MessageId);
            } catch (emailError) {
                console.error("\tError sending email:", emailError.message);
            }

        } catch (e) {
            console.error('\tFailed to parse message data:', e.message);
        }

        // "Ack" (acknowledge) the message so it is removed from the queue
        message.ack();
    };

    subscription.on('message', messageHandler);

    console.log(`[Email Worker] Listening for messages on ${subscriptionName}...`);

    subscription.on('error', (error) => {
        console.error(`[Email Worker] Error: ${error}`);
    });
};

const sendEmailLogic = async (payload) => {
    const input = { // SendEmailRequest
        Source: "kunalshukla@hotmail.com", // required TODO: Ensure this email is verified in AWS SES
        Destination: { // Destination
            ToAddresses: [ // AddressList
                payload.toEmail,
            ]
        },
        Message: { // Message
            Subject: { // Content
                Data: payload.subject, // required
                Charset: "UTF-8",
            },
            Body: { // Body
                Text: {
                    Data: payload.message, // required
                    Charset: "UTF-8",
                }
            },
        }
    };

    try {
        const command = new SendEmailCommand(input);
        const response = await client.send(command);
        return response;
    } catch (error) {
        console.error("[Email Worker] SES Error:", error);
        throw error;
    }

}

module.exports = listenForMessages;