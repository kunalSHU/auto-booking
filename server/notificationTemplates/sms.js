const SmsTemplates = {
    customerConfirmationSms: 'customerConfirmationSms',
    adminSms: 'adminSms'
};

const BUSINESS_NAME = "Apex Auto Hub";

const smsTemplate = {
    customerConfirmationSms: {
        body: (serviceDate, timeWindow) => `${BUSINESS_NAME}: Your booking is confirmed for ${serviceDate} at ${timeWindow}.
Service: {{ServiceName}}
Location: {{ServiceAddress}}
Manage: {{ShortLink}}
`
    },
    adminSms: {
        body: (customerName, serviceDate, timeWindow) => `New booking 📥
${customerName} | ${serviceDate} ${timeWindow}
{{VehicleMake}} {{VehicleModel}}
`
    }
}

module.exports = { SmsTemplates, smsTemplate };
