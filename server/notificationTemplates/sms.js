const SmsTemplates = {
    customerConfirmationSms: 'customerConfirmationSms',
    adminSms: 'adminSms'
};

const BUSINESS_NAME = "AutoVivo";

const smsTemplate = {
    customerConfirmationSms: {
        body: (customerName, serviceDate, timeWindow) => `${BUSINESS_NAME}: Hi ${customerName}, your {{ServiceName}} is confirmed for ${serviceDate} during ${timeWindow}.
Vehicle: {{VehicleYear}} {{VehicleMake}} {{VehicleModel}}
Technician: {{TechnicianName}}
Manage booking:
{{ManageBookingLink}}
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
