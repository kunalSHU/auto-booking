const SmsTemplates = {
    customerConfirmationSms: 'customerConfirmationSms',
    adminSms: 'adminSms'
};

const BUSINESS_NAME = "AutoVivo";

const smsTemplate = {
    customerConfirmationSms: {
        body: (customerName, serviceDate, timeWindow, vehicleYear, vehicleMakeModel, vehicleTrim) => `${BUSINESS_NAME}: Hi ${customerName}, your {{ServiceName}} is confirmed for ${serviceDate} during ${timeWindow}.
Vehicle: ${vehicleYear} ${vehicleMakeModel} ${vehicleTrim}
Technician: {{TechnicianName}}
Manage booking:
{{ManageBookingLink}}
`
    },
    adminSms: {
        body: (customerName, serviceDate, timeWindow, vehicleYear, vehicleMakeModel, vehicleTrim) => `New booking 📥
${customerName} | ${serviceDate} ${timeWindow}
Vehicle: ${vehicleYear} ${vehicleMakeModel} ${vehicleTrim}
`
    }
}

module.exports = { SmsTemplates, smsTemplate };
