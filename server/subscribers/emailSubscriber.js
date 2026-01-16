const { PubSub } = require('@google-cloud/pubsub');

const pubSubClient = new PubSub();
const subscriptionName = 'email-notification-dev-sub';

const listenForMessages = () => {
    // References an existing subscription
    const subscription = pubSubClient.subscription(subscriptionName);

    // Create an event handler to handle messages
    const messageHandler = (message) => {
        console.log(`[Email Worker] Received message ${message.id}:`);
        
        try {
            const dataString = message.data.toString();
            const payload = JSON.parse(dataString);
            
            console.log(`\tProcessing email for: ${payload.toEmail}`);
            console.log(`\tSubject: ${payload.subject}`);
            // TODO: Add actual email sending logic here (e.g. Nodemailer, SendGrid)
            
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

module.exports = listenForMessages;