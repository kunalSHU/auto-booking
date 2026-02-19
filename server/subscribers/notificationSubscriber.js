const { PubSub } = require('@google-cloud/pubsub');
const { SESClient, SendEmailCommand } = require('@aws-sdk/client-ses'); // ES Modules import
const { SNSClient, PublishCommand } = require("@aws-sdk/client-sns");
const path = require('path');
const { emailTemplate, EmailTemplates } = require('../notificationTemplates/emails');
const { smsTemplate, SmsTemplates } = require('../notificationTemplates/sms');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const pubSubClient = new PubSub();
const emailSubscriptionName = 'email-notification-dev-sub';
const smsSubscriptionName = 'sms-notification-dev-sub';

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
const snsClient = new SNSClient(config);

const listenForMessages = () => {
    // References an existing subscription
    const emailSubscription = pubSubClient.subscription(emailSubscriptionName);
    const smsSubscription = pubSubClient.subscription(smsSubscriptionName);

    // Create an event handler to handle messages
    const emailMessageHandler = async (message) => {
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
                console.log(`\tEmail sent successfully to ${payload.pii.toEmail}! Message ID:`, response.MessageId);
            } catch (emailError) {
                console.error("\tError sending email:", emailError.message);
            }

        } catch (e) {
            console.error('\tFailed to parse email message data:', e.message);
        }

        // "Ack" (acknowledge) the message so it is removed from the queue
        message.ack();
    };

    const smsMessageHandler = async (message) => {
        console.log(`[SMS Worker] Received message ${message.id}`);

        try {
            const dataString = message.data.toString();
            const payload = JSON.parse(dataString);
            console.log(`\tProcessing sms for: ${payload.toNumber}`);

            try {
                const response = await sendSmsLogic(payload);
                console.log(`\tSMS sent successfully to ${payload.toNumber}! Message ID:`, response.MessageId);
            } catch (smsError) {
                console.error("\tError sending SMS:", smsError.message);
            }

        } catch (e) {
            console.error('\tFailed to parse sms message data:', e.message);
        }

        // SMS sending logic will go here
        message.ack();
    };

    emailSubscription.on('message', emailMessageHandler);
    smsSubscription.on('message', smsMessageHandler);

    console.log(`[Worker] Listening for messages on ${emailSubscriptionName} and ${smsSubscriptionName}...`);

    emailSubscription.on('error', (error) => {
        console.error(`[Email Worker] Error: ${error}`);
    });

    smsSubscription.on('error', (error) => {
        console.error(`[SMS Worker] Error: ${error}`);
    });
};

const sendSmsLogic = async (payload) => {

    console.log("Here is the payload: ", payload)
    if (payload.templateType === SmsTemplates.customerConfirmationSms) {
        payload.message = smsTemplate.customerConfirmationSms.body(payload.date, payload.time);
    }

    // Perform placeholder replacement on the generated message body
    // payload.message = replacePlaceholders(payload.message, payload);

    // Format phone number to E.164 (AWS SNS requirement)
    let phoneNumber = payload.toNumber;
    const numericPhone = phoneNumber.replace(/\D/g, '');

    if (numericPhone.length === 10) {
        phoneNumber = `+1${numericPhone}`;
    } else if (numericPhone.length === 11 && numericPhone.startsWith('1')) {
        phoneNumber = `+${numericPhone}`;
    } else if (!phoneNumber.startsWith('+')) {
        phoneNumber = `+${numericPhone}`;
    }

    const input = {
        Message: payload.message,
        PhoneNumber: phoneNumber,
        MessageAttributes: {
            'AWS.SNS.SMS.SMSType': {
                DataType: 'String',
                StringValue: 'Transactional' // 'Transactional' for critical alerts, 'Promotional' for marketing
            }
        }
    };

    try {
        const command = new PublishCommand(input);
        const response = await snsClient.send(command);
        return response;
    } catch (error) {
        console.error("[SMS Worker] SNS Error:", error);
        throw error;
    }
}

const sendEmailLogic = async (payload) => {

    console.log("Here is the payload: ", payload)
    // Get the details based on the template type in the payload
    const address = payload.serviceAddress ? payload.serviceAddress.string : '';

    if (payload.templateType === EmailTemplates.adminEmail) {
        console.log("admin email")
        payload.subject = emailTemplate.adminEmail.subject(payload.pii.customerName);
        payload.message = emailTemplate.adminEmail.body(payload.pii.customerName, payload.date, payload.time, address);
        payload.pii.toEmail = "janarthkulenthiranrealtor@gmail.com";
    } else if (payload.templateType === EmailTemplates.technicianEmail) {
        console.log("technician email")
        payload.subject = emailTemplate.technicianEmail.subject(payload.date, payload.time);
        payload.message = emailTemplate.technicianEmail.body(payload.pii.customerName, payload.pii.customerPhone, payload.date, payload.time, address);
        payload.pii.toEmail = "autotechnicianx@gmail.com";
    } else if (payload.templateType === EmailTemplates.customerEmail) {
        console.log("booking email")
        payload.subject = emailTemplate.customerEmail.subject;
        payload.message = emailTemplate.customerEmail.body(payload.pii.customerName, payload.date, payload.time, address);
    }

    const input = { // SendEmailRequest
        Source: "kunalshukla@hotmail.com", // required TODO: Ensure this email is verified in AWS SES
        Destination: { // Destination
            ToAddresses: [ // AddressList
                payload.pii.toEmail,
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